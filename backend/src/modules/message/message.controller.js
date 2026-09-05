const Message = require("./message.model");
const Bid = require("../bid/bid.model");
const Task = require("../task/task.model");
const {
    createIntegrityTag,
    verifyIntegrityTag
} = require("../../crypto/integrity/integrity.service");

const getMessageSecret = () => {
    const secret = process.env.CRYPTO_HMAC_SECRET || process.env.JWT_SECRET;
    if (!secret) throw new Error("Message integrity secret is not configured");
    return secret;
};

const getConversation = async (taskId, bidId, userId) => {
    const task = await Task.findById(taskId).select("createdBy");
    const bid = await Bid.findOne({ _id: bidId, task: taskId }).select("bidder");

    if (!task || !bid) {
        return { error: { status: 404, message: "Task or bid not found" } };
    }

    const isClient = task.createdBy.toString() === userId;
    const isBidder = bid.bidder.toString() === userId;
    if (!isClient && !isBidder) {
        return { error: { status: 403, message: "You are not a participant in this conversation" } };
    }

    return {
        task,
        bid,
        recipientId: isClient ? bid.bidder : task.createdBy
    };
};

const messagePayload = (message) => ({
    task: String(message.task),
    bid: String(message.bid),
    sender: String(message.sender),
    recipient: String(message.recipient),
    message: message.message,
    createdAt: message.createdAt
});

const sendMessage = async (req, res) => {
    try {
        const { taskId, bidId } = req.params;
        const text = String(req.body.message || "").trim();
        if (!text) return res.status(400).json({ message: "Message is required" });

        const conversation = await getConversation(taskId, bidId, req.user.id);
        if (conversation.error) return res.status(conversation.error.status).json({ message: conversation.error.message });

        const payload = {
            task: taskId,
            bid: bidId,
            sender: req.user.id,
            recipient: String(conversation.recipientId),
            message: text,
            createdAt: new Date()
        };
        const pendingMessage = new Message(payload);
        const normalizedPayload = messagePayload(pendingMessage);
        const integrityTag = createIntegrityTag(
            normalizedPayload,
            getMessageSecret()
        );
        pendingMessage.integrityTag = integrityTag;
        const saved = await pendingMessage.save();

        return res.status(201).json({
            message: "Message sent successfully",
            data: { ...normalizedPayload, integrityTag }
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to send message", error: error.message });
    }
};

const listMessages = async (req, res) => {
    try {
        const { taskId, bidId } = req.params;
        const conversation = await getConversation(taskId, bidId, req.user.id);
        if (conversation.error) return res.status(conversation.error.status).json({ message: conversation.error.message });

        const messages = await Message.find({ task: taskId, bid: bidId })
            .sort({ createdAt: 1 })
            .lean();
        const secret = getMessageSecret();
        const verified = messages.map((message) => {
            if (!verifyIntegrityTag(messagePayload(message), message.integrityTag, secret)) {
                throw new Error("Message integrity verification failed");
            }
            return messagePayload(message);
        });

        return res.status(200).json({ count: verified.length, messages: verified });
    } catch (error) {
        const status = error.message === "Message integrity verification failed" ? 409 : 500;
        return res.status(status).json({ message: error.message });
    }
};

module.exports = { sendMessage, listMessages };
