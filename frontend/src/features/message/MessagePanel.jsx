import { useEffect, useState } from "react";
import {
    getConversationMessages,
    sendConversationMessage
} from "./messageAPI";

const MessagePanel = ({ taskId, bidId, participantName }) => {
    const [messages, setMessages] = useState([]);
    const [draft, setDraft] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");

    const loadMessages = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await getConversationMessages(taskId, bidId);
            setMessages(data.messages || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load conversation"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (taskId && bidId) {
            // Loading a conversation is an external API synchronization.
            // eslint-disable-next-line react-hooks/set-state-in-effect
            loadMessages();
        }
        // The conversation changes only when taskId or bidId changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [taskId, bidId]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!draft.trim()) return;

        try {
            setSending(true);
            setError("");
            await sendConversationMessage(taskId, bidId, draft.trim());
            setDraft("");
            await loadMessages();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to send message"
            );
        } finally {
            setSending(false);
        }
    };

    return (
        <section className="mt-5 border rounded-2xl p-4 bg-gray-50">
            <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold">
                    Conversation with {participantName || "participant"}
                </h3>
                <button
                    type="button"
                    onClick={loadMessages}
                    className="text-sm border rounded-lg px-3 py-1 bg-white"
                    title="Refresh conversation"
                >
                    Refresh
                </button>
            </div>

            {error && (
                <p className="mt-3 text-sm text-red-700">{error}</p>
            )}

            <div className="mt-3 min-h-24 max-h-56 overflow-y-auto space-y-2">
                {loading ? (
                    <p className="text-sm text-gray-500">Loading messages...</p>
                ) : messages.length === 0 ? (
                    <p className="text-sm text-gray-500">
                        No messages yet. Start the conversation.
                    </p>
                ) : (
                    messages.map((item) => (
                        <div
                            key={`${item.sender}-${item.createdAt}`}
                            className="rounded-xl bg-white border p-3"
                        >
                            <p className="text-sm text-gray-800">{item.message}</p>
                            <time className="block mt-1 text-xs text-gray-400">
                                {new Date(item.createdAt).toLocaleString()}
                            </time>
                        </div>
                    ))
                )}
            </div>

            <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
                <input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Write a message..."
                    maxLength={5000}
                    className="flex-1 border rounded-xl px-3 py-2 bg-white"
                />
                <button
                    type="submit"
                    disabled={sending || !draft.trim()}
                    className="bg-black text-white rounded-xl px-4 py-2 disabled:opacity-50"
                >
                    {sending ? "Sending..." : "Send"}
                </button>
            </form>
        </section>
    );
};

export default MessagePanel;
