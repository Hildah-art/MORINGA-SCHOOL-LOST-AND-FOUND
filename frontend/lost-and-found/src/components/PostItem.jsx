import { useState } from "react";

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !location || !date || !image || !description || !category) {
            alert("Please fill in all fields");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("title", name);
        formData.append("location", location);
        formData.append("date", date);
        formData.append("image", image);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("user_id", 1); // Adjust as needed

        try {
            const response = await fetch("http://localhost:5000/found-items", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                alert("Item posted successfully!");
                // Clear form
                setName("");
                setLocation("");
                setDate("");
                setImage(null);
                setDescription("");
                setCategory("");
            } else {
                alert(result.message || "Failed to post item.");
            }
        } catch (error) {
            console.error("Error posting item:", error);
            alert("Network error. Please try again.");
        }

        setLoading(false);
    };

    return (
        <div className="postitem-container">
            <h1 className="postitem-heading">Found Item Reporting</h1>

            <div className="postitem-form-card">
                <form onSubmit={handleSubmit}>
                    <div className="postitem-label-group">
                        <label htmlFor="name">Item Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter item name"
                            className="postitem-input"
                            required
                        />
                    </div>

                    <div className="postitem-label-group">
                        <label htmlFor="location">Item Location</label>
                        <input
                            type="text"
                            id="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Enter location"
                            className="postitem-input"
                            required
                        />
                    </div>

                    <div className="postitem-label-group">
                        <label htmlFor="date">Date Found</label>
                        <input
                            type="date"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="postitem-input"
                            required
                        />
                    </div>

                    <div className="postitem-label-group">
                        <label htmlFor="image">Upload Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            id="image"
                            onChange={handleImageChange}
                            className="postitem-file-input"
                            required
                        />
                    </div>

                    <div className="postitem-label-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the item"
                            className="postitem-textarea"
                            required
                        />
                    </div>

                    <div className="postitem-label-group">
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="postitem-select"
                            required
                        >
                            <option value="">Select category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.name}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="postitem-button-wrapper">
                        <button type="submit" className="postitem-button" disabled={loading}>
                            {loading ? "Posting..." : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostItem;