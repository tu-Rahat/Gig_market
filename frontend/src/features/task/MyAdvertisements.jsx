import { useEffect, useState } from "react";
import {
    getMyTasks,
    updateTask,
    cancelTask
} from "./taskAPI";
import {
    getCategories
} from "../category/categoryAPI";

const emptyForm = {
    title: "",
    description: "",
    category: "",
    location: "",
    duration: "",
    budgetMin: "",
    budgetMax: ""
};

const MyAdvertisements = () => {
    const [tasks, setTasks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(emptyForm);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const loadData = async () => {
        try {
            const [
                taskData,
                categoryData
            ] = await Promise.all([
                getMyTasks(),
                getCategories()
            ]);
            setTasks(taskData.tasks || []);
            setCategories(categoryData.categories || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to load advertisements"
            );
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const startEdit = (task) => {
        if (task.status !== "open") {
            return;
        }
        setEditingId(task._id);
        setFormData({
            title: task.title,
            description: task.description,
            category: task.category?._id || "",
            location: task.location,
            duration: task.duration,
            budgetMin: task.budgetMin,
            budgetMax: task.budgetMax
        });
        setError("");
        setMessage("");
    };

    const closeEdit = () => {
        setEditingId(null);
        setFormData(emptyForm);
    };

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleSave = async (event) => {
        event.preventDefault();
        try {
            setError("");
            setMessage("");
            const data = await updateTask(
                editingId,
                {
                    ...formData,
                    budgetMin: Number(formData.budgetMin),
                    budgetMax: Number(formData.budgetMax)
                }
            );
            setMessage(data.message);
            closeEdit();
            await loadData();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to update advertisement"
            );
        }
    };

    const handleCancelTask = async (taskId) => {
        const confirmed = window.confirm(
            "Cancel this advertisement? This cannot be undone."
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setMessage("");
            const data = await cancelTask(taskId);
            setMessage(data.message);

            if (editingId === taskId) {
                closeEdit();
            }

            await loadData();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to cancel advertisement"
            );
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <div>
                <h1 className="text-3xl font-bold">
                    My Advertisements
                </h1>
                <p className="mt-2 text-gray-600">
                    Edit or cancel advertisements before a worker is selected.
                </p>
            </div>

            {error && (
                <div className="mt-5 p-3 rounded-xl bg-red-50 text-red-700">
                    {error}
                </div>
            )}

            {message && (
                <div className="mt-5 p-3 rounded-xl bg-green-50 text-green-700">
                    {message}
                </div>
            )}

            <div className="space-y-5 mt-8">
                {tasks.map((task) => (
                    <article
                        key={task._id}
                        className="border rounded-3xl p-6"
                    >
                        <div className="flex flex-col md:flex-row md:justify-between gap-5">
                            <div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <h2 className="text-xl font-semibold">
                                        {task.title}
                                    </h2>
                                    <span className="text-sm border rounded-full px-3 py-1">
                                        {task.status}
                                    </span>
                                </div>
                                <p className="mt-3 text-gray-600">
                                    {task.description}
                                </p>
                                <div className="mt-4 text-sm text-gray-600 space-y-1">
                                    <p>
                                        Category:{" "}
                                        {task.category?.name ||
                                            "Uncategorized"}
                                    </p>
                                    <p>
                                        Location: {task.location}
                                    </p>
                                    <p>
                                        Duration: {task.duration}
                                    </p>
                                    <p>
                                        Budget: {task.budgetMin} -{" "}
                                        {task.budgetMax} BDT
                                    </p>
                                </div>
                            </div>

                            {task.status === "open" && (
                                <div className="flex gap-3 h-fit">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            startEdit(task)
                                        }
                                        className="border px-4 py-2 rounded-xl"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleCancelTask(
                                                task._id
                                            )
                                        }
                                        className="bg-black text-white px-4 py-2 rounded-xl"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </article>
                ))}
            </div>

            {tasks.length === 0 && (
                <div className="mt-8 border border-dashed rounded-2xl p-10 text-center text-gray-500">
                    You have not posted any advertisements yet.
                </div>
            )}

            {editingId && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
                    <form
                        onSubmit={handleSave}
                        className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-7"
                    >
                        <div className="flex justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold">
                                    Edit Advertisement
                                </h2>
                                <p className="text-gray-600 mt-1">
                                    Changes are allowed only while the task is open.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={closeEdit}
                                className="text-xl"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4 mt-6">
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Task title"
                                className="w-full border rounded-xl p-3"
                                required
                            />

                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full border rounded-xl p-3 bg-white"
                                required
                            >
                                <option value="">
                                    Select category
                                </option>
                                {categories.map(
                                    (category) => (
                                        <option
                                            key={category._id}
                                            value={category._id}
                                        >
                                            {category.name}
                                        </option>
                                    )
                                )}
                            </select>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="5"
                                placeholder="Description"
                                className="w-full border rounded-xl p-3"
                                required
                            />

                            <input
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Location"
                                className="w-full border rounded-xl p-3"
                                required
                            />

                            <input
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                placeholder="Duration"
                                className="w-full border rounded-xl p-3"
                                required
                            />

                            <div className="grid sm:grid-cols-2 gap-4">
                                <input
                                    type="number"
                                    name="budgetMin"
                                    value={formData.budgetMin}
                                    onChange={handleChange}
                                    min="0"
                                    placeholder="Minimum budget"
                                    className="w-full border rounded-xl p-3"
                                    required
                                />
                                <input
                                    type="number"
                                    name="budgetMax"
                                    value={formData.budgetMax}
                                    onChange={handleChange}
                                    min="0"
                                    placeholder="Maximum budget"
                                    className="w-full border rounded-xl p-3"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-7">
                            <button
                                type="submit"
                                className="bg-black text-white px-5 py-3 rounded-xl"
                            >
                                Save Changes
                            </button>
                            <button
                                type="button"
                                onClick={closeEdit}
                                className="border px-5 py-3 rounded-xl"
                            >
                                Close
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default MyAdvertisements;