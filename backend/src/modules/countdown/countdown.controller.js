const Escrow = require("../escrow/escrow.model");
const getCountdown = async (req, res) => {
 try {
 const escrow = await Escrow.findById(req.params.escrowId)
 .populate("task", "title status")
 .populate("owner", "name")
 .populate("worker", "name");
 if (!escrow) {
 return res.status(404).json({
 message: "Escrow record not found"
 });
 }
 const userId = req.user.id;
 if (
 escrow.owner._id.toString() !== userId &&
 escrow.worker._id.toString() !== userId
 ) {
 return res.status(403).json({
 message:
 "You do not have access to this countdown"
 });
 }
 const now = new Date();
 const deadline = new Date(
 escrow.completionDeadline
 );
 const remainingMs = Math.max(
 deadline.getTime() - now.getTime(),
 0
 );
 const expired = remainingMs === 0;
 const totalSeconds = Math.floor(
 remainingMs / 1000
 );
 const days = Math.floor(
 totalSeconds / 86400
 );
 const hours = Math.floor(
 (totalSeconds % 86400) / 3600
 );
 const minutes = Math.floor(
 (totalSeconds % 3600) / 60
 );
 const seconds = totalSeconds % 60;
 return res.status(200).json({
    escrowId: escrow._id,
 task: escrow.task,
 owner: escrow.owner,
 worker: escrow.worker,
 status: escrow.status,
 completionDeadline:
 escrow.completionDeadline,
 expired,
 remainingMs,
 remaining: {
 days,
 hours,
 minutes,
 seconds
 }
 });
 } catch (error) {
 return res.status(500).json({
 message: "Failed to load task countdown",
 error: error.message
 });
 }
};
module.exports = {
 getCountdown
};