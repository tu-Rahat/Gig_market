import { useEffect, useState } from "react";
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from "./categoryAPI";

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        description: ""
    });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

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

    useEffect(() => {
        loadCategories();
    }, []);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const resetForm = () => {
        setFormData({
            name: "",
            description: ""
        });
        setEditingId(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setMessage("");

        if (!formData.name.trim()) {
            setError("Category name is required");
            return;
        }

        try {
            setLoading(true);

            if (editingId) {
                const data = await updateCategory(
                    editingId,
                    formData
                );
                setMessage(data.message);
            } else {
                const data = await createCategory(formData);
                setMessage(data.message);
            }

            resetForm();
            await loadCategories();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Category operation failed"
            );
        } finally {
            setLoading(false);
        }
    };

    const startEdit = (category) => {
        setEditingId(category._id);
        setFormData({
            name: category.name,
            description: category.description || ""
        });
        setError("");
        setMessage("");
    };

    const handleDelete = async (categoryId) => {
        const confirmed = window.confirm(
            "Delete this category?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setMessage("");
            const data = await deleteCategory(categoryId);
            setMessage(data.message);

            if (editingId === categoryId) {
                resetForm();
            }

            await loadCategories();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to delete category"
            );
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="grid lg:grid-cols-[380px_1fr] gap-8">
                <section className="border rounded-3xl p-6 h-fit">
                    <h1 className="text-2xl font-bold">
                        {editingId
                            ? "Edit Category"
                            : "Create Category"}
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Manage the job categories used by Gig Market.
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
                                Category Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Example: Pet Sitting"
                                className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-black"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Short category description"
                                rows="4"
                                className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-3 rounded-xl disabled:opacity-60"
                        >
                            {loading
                                ? "Saving..."
                                : editingId
                                    ? "Update Category"
                                    : "Create Category"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="w-full border py-3 rounded-xl"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </form>
                </section>

                <section>
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h2 className="text-2xl font-bold">
                                Categories
                            </h2>
                            <p className="text-gray-600">
                                {categories.length} categories available
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {categories.map((category) => (
                            <article
                                key={category._id}
                                className="border rounded-2xl p-5"
                            >
                                <h3 className="font-semibold text-lg">
                                    {category.name}
                                </h3>
                                <p className="text-gray-600 mt-2 min-h-12">
                                    {category.description ||
                                        "No description added."}
                                </p>

                                <div className="flex gap-3 mt-5">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            startEdit(category)
                                        }
                                        className="border px-4 py-2 rounded-xl"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDelete(category._id)
                                        }
                                        className="bg-black text-white px-4 py-2 rounded-xl"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>

                    {categories.length === 0 && (
                        <div className="border border-dashed rounded-2xl p-8 text-center text-gray-500">
                            No categories have been created yet.
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default CategoryManager;