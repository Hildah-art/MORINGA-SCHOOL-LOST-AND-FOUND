import { useState } from "react";
import { CgSpinner } from "react-icons/cg";

const PostItem = () => {
    const categories = [
        { id: 1, name: "Electronics" },
        { id: 2, name: "Clothing" },
        { id: 3, name: "Documents" },
    ];

    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [image, setImage] = useState(null);
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => setImage(e.target.files[0]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name || !location || !date || !image || !description || !category) {
            alert("Please fill in all fields");
            return;
        }

        setLoading(true);

        setTimeout(() => {
            console.table({ name, location, date, image, description, category });
            alert("Item posted successfully!");
            setLoading(false);

            // Clear form
            setName("");
            setLocation("");
            setDate("");
            setImage(null);
            setDescription("");
            setCategory("");
        }, 1500);
    };

    return (
        <div className="min-h-screen flex flex-col justify-center p-6 bg-white">
            {/* TOP HEADING */}
            <h1 className="text-4xl font-extrabold text-center text-[#2E4734] mb-6">
                Found Item Reporting
            </h1>

            {/* FORM CARD */}
            <div className="w-full max-w-md mx-auto bg-[#F7F7F7] shadow-lg rounded-2xl p-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Item Name */}
                    <div className="flex flex-col space-y-1 text-[#1A1A1A]">
                        <label htmlFor="name" className="font-medium">Item Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter item name"
                            className="px-4 py-2 bg-white rounded-3xl border border-gray-300 focus:outline-none"
                            required
                        />
                    </div>

                    {/* Location */}
                    <div className="flex flex-col space-y-1 text-[#1A1A1A]">
                        <label htmlFor="location" className="font-medium">Item Location</label>
                        <input
                            type="text"
                            id="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Enter location"
                            className="px-4 py-2 bg-white rounded-3xl border border-gray-300 focus:outline-none"
                            required
                        />
                    </div>

                    {/* Date */}
                    <div className="flex flex-col space-y-1 text-[#1A1A1A]">
                        <label htmlFor="date" className="font-medium">Date Found</label>
                        <input
                            type="date"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="px-4 py-2 bg-white rounded-3xl border border-gray-300 focus:outline-none"
                            required
                        />
                    </div>

                    {/* Image */}
                    <div className="flex flex-col space-y-1 text-[#1A1A1A]">
                        <label htmlFor="image" className="font-medium">Upload Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            id="image"
                            onChange={handleImageChange}
                            className="px-4 py-2 bg-white rounded-3xl border border-gray-300 focus:outline-none"
                        />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col space-y-1 text-[#1A1A1A]">
                        <label htmlFor="description" className="font-medium">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the item"
                            className="px-4 py-2 bg-white rounded-3xl border border-gray-300 focus:outline-none"
                            required
                        />
                    </div>

                    {/* Category */}
                    <div className="flex flex-col space-y-1 text-[#1A1A1A]">
                        <label htmlFor="category" className="font-medium">Category</label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="px-4 py-2 bg-white rounded-3xl border border-gray-300 focus:outline-none"
                            required
                        >
                            <option value="">Select category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={String(cat.id)}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="mt-4 w-52 bg-[#224F35] flex items-center justify-center h-10 hover:bg-[#1c3f2b] text-white font-semibold py-2 rounded-lg transition duration-300"
                        >
                            {loading && <CgSpinner size={20} className="animate-spin mr-2" />}
                            {loading ? "Posting..." : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostItem;
