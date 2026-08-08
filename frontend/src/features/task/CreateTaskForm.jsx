import { useEffect, useState } from "react";
import { getCategories } from "../category/categoryAPI";
import { createTask } from "./taskAPI";

const CreateTaskForm = () => {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        location: "",
        duration: "",
        budgetMin: "",
        budgetMax: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data.categories || []);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Failed to load categories"
                );
            }
        };
        loadCategories();
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
        setSuccess("");

        const minBudget = Number(formData.budgetMin);
        const maxBudget = Number(formData.budgetMax);

        if (minBudget > maxBudget) {
            setError(
                "Maximum budget must be greater than or equal to minimum budget"
            );
            return;
        }

        try {
            setLoading(true);
            const data = await createTask({
                ...formData,
                budgetMin: minBudget,
                budgetMax: maxBudget
            });
            setSuccess(data.message);
            setFormData({
                title: "",
                description: "",
                category: "",
                location: "",
                duration: "",
                budgetMin: "",
                budgetMax: ""
            });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to create task advertisement"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-6 py-12">
            <div className="border rounded-3xl p-8">
                <div>
                    <h1 className="text-3xl font-bold">
                        Post a Task
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Describe the work you need and set your budget range.
                    </p>
                </div>

                {error && (
                    <div className="mt-5 p-3 rounded-xl bg-red-50 text-red-700">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mt-5 p-3 rounded-xl bg-green-50 text-green-700">
                        {success}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="mt-7 space-y-5"
                >
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Task Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Example: Need a dog sitter for one week"
                            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-black"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Category
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full border rounded-xl p-3 bg-white outline-none focus:ring-2 focus:ring-black"
                            required
                        >
                            <option value="">
                                Select a category
                            </option>
                            {categories.map((category) => (
                                <option
                                    key={category._id}
                                    value={category._id}
                                >
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Explain what needs to be done..."
                            rows="6"
                            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-black"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Location
                        </label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Example: Dhanmondi, Dhaka"
                            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-black"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Duration
                        </label>
                        <input
                            type="text"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            placeholder="Example: 7 days"
                            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-black"
                            required
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Minimum Budget (BDT)
                            </label>
                            <input
                                type="number"
                                name="budgetMin"
                                value={formData.budgetMin}
                                onChange={handleChange}
                                min="0"
                                placeholder="4000"
                                className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-black"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Maximum Budget (BDT)
                            </label>
                            <input
                                type="number"
                                name="budgetMax"
                                value={formData.budgetMax}
                                onChange={handleChange}
                                min="0"
                                placeholder="5000"
                                className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-black"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || categories.length === 0}
                        className="w-full bg-black text-white py-3 rounded-xl disabled:opacity-60"
                    >
                        {loading
                            ? "Publishing..."
                            : "Publish Task"}
                    </button>

                    {categories.length === 0 && (
                        <p className="text-sm text-amber-700">
                            Create at least one category before posting a task.
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default CreateTaskForm;