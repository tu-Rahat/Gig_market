import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    createEscrowHold,
    getEligibleEscrowTasks,
    getMyEscrows
} from "./escrowAPI";
const EscrowCenter = () => {
 const [escrows, setEscrows] = useState([]);
 const [eligibleTasks, setEligibleTasks] = useState([]);
 const [formData, setFormData] = useState({
    taskId: "",
    amount: "",
    completionDeadline: ""
});
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");
 const [message, setMessage] = useState("");
 const loadEscrows = async () => {
 try {
 const data = await getMyEscrows();
 setEscrows(data.escrows || []);
 } catch (err) {
 setError(
 err.response?.data?.message ||
 "Failed to load escrow records"
 );
 }
 };
 const loadEligibleTasks = async () => {
    try {
        const data = await getEligibleEscrowTasks();

        setEligibleTasks(data.tasks || []);
    } catch (err) {
        setError(
            err.response?.data?.message ||
            "Failed to load eligible tasks"
        );
    }
};
	const selectedTask = eligibleTasks.find(
    (task) => task._id === formData.taskId
);

	useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadEscrows();

    // Load tasks where the owner has already selected a provider
    // through Feature 7.
    loadEligibleTasks();
}, []);
 const handleChange = (event) => {
 setFormData({
 ...formData,
 [event.target.name]: event.target.value
 });
 };
 const handleSubmit = async (event) => {
 event.preventDefault();
 setError("");
 setMessage("");
 try {
 setLoading(true);
 const data = await createEscrowHold({
    taskId: formData.taskId,
    amount: Number(formData.amount),
    completionDeadline: formData.completionDeadline
});
 setMessage(data.message);
 setFormData({
    taskId: "",
    amount: "",
    completionDeadline: ""
});
 await loadEscrows();
 } catch (err) {
 setError(
 err.response?.data?.message ||
 "Failed to create escrow hold"
 );

 } finally {
 setLoading(false);
 }
 };
 return (
 <div className="max-w-6xl mx-auto px-6 py-12">
 <div className="grid lg:grid-cols-[390px_1fr] gap-8">
 <section className="border rounded-3xl p-6 h-fit">
 <h1 className="text-2xl font-bold">
 Hold Demo Payment
 </h1>
 <p className="mt-2 text-gray-600">
 Simulate holding payment after selecting a worker.
 </p>
 
 {error && (
 <div className="mt-4 p-3 rounded-xl bg-red-50 text-red-700">
 {error}
 </div>
 )}
 {message && (
 <div className="mt-4 p-3 rounded-xl bg-green-50 text-green-700">
 {message}
 </div>
 )}
 <form
 onSubmit={handleSubmit}
 className="mt-6 space-y-4"
 >
 <div>
    <label className="block text-sm font-medium mb-2">
        Select Task
    </label>

    <select
        name="taskId"
        value={formData.taskId}
        onChange={handleChange}
        className="w-full border rounded-xl p-3 bg-white outline-none focus:ring-2 focus:ring-black"
        required
    >
        <option value="">
            Select a task
        </option>

        {eligibleTasks.map((task) => (
            <option
                key={task._id}
                value={task._id}
            >
                {task.title}
            </option>
        ))}
    </select>
</div>
 {selectedTask?.selectedWorker && (
    <div>
        <label className="block text-sm font-medium mb-2">
            Selected Provider
        </label>

        <div className="w-full border rounded-xl p-3 bg-gray-50">
            <p className="font-medium">
                {selectedTask.selectedWorker.name ||
                    "Selected Provider"}
            </p>

            {selectedTask.selectedWorker.email && (
                <p className="text-sm text-gray-500 mt-1">
                    {selectedTask.selectedWorker.email}
                </p>
            )}

            <p className="text-xs text-gray-500 mt-2">
                Provider selected through Feature 7
            </p>
        </div>
    </div>
)}
{formData.taskId && !selectedTask?.selectedWorker && (
    <div className="p-3 rounded-xl bg-amber-50 text-amber-800 text-sm">
        This task does not have a selected provider yet.
        Please select a provider through the bidding workflow first.
    </div>
)}
 <div>
 <label className="block text-sm font-medium mb-2">
 Amount (BDT)
 </label>

 <input
 type="number"
 name="amount"
 value={formData.amount}
 onChange={handleChange}
 min="1"
 placeholder="5000"
 className="w-full border rounded-xl p-3 outline-none focus:ring2 focus:ring-black"
 required
 />
 </div>
 <div>
 <label className="block text-sm font-medium mb-2">
 Completion Deadline
 </label>
 <input
 type="datetime-local"
 name="completionDeadline"
 value={formData.completionDeadline}
 onChange={handleChange}
 className="w-full border rounded-xl p-3 outline-none focus:ring2 focus:ring-black"
 required
 />
 </div>
 <button
 type="submit"
 disabled={loading}
 className="w-full bg-black text-white py-3 rounded-xl disabled:
opacity-60"
 >
 {loading
 ? "Holding Payment..."
 : "Hold Demo Payment"}
 </button>
 </form>
 </section>
 <section>
 <div className="mb-5">
 <h2 className="text-2xl font-bold">
 My Escrow Records
 </h2>
 <p className="text-gray-600">
 Payments where you are the task owner or worker.
 </p>
 </div>
 <div className="space-y-4">
 {escrows.map((escrow) => (
 <article
 key={escrow._id}
 className="border rounded-2xl p-5"
 >
 <div className="flex flex-col md:flex-row md:justify-between
gap-4">
 <div>
 <h3 className="font-semibold text-lg">
 {escrow.task?.title ||
 "Task"}
 </h3>
 <p className="text-gray-600 mt-1">
 {escrow.amount}{" "}
 {escrow.currency}
 </p>
 <p className="text-sm text-gray-500 mt-2">
 Reference:{" "}
 {escrow.paymentReference}
 </p>
 </div>
 <span className="border rounded-full px-3 py-1 text-sm h-fit w-fit">
 {escrow.status}
 </span>
 </div>
 <div className="mt-5">
 <Link
 to={`/jobs/countdown?escrowId=${escrow._id}`}
 className="inline-block bg-black text-white px-4 py-2
rounded-xl"
 >
 View Countdown
 </Link>
 </div>
 </article>
 ))}
 </div>
 {escrows.length === 0 && (
 <div className="border border-dashed rounded-2xl p-8 text-center textgray-500">
 No escrow records yet.
 </div>
 )}
 </section>
 </div>
 </div>
 );
};
export default EscrowCenter;