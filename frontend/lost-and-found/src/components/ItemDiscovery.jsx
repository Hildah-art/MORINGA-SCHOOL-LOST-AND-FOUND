import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000"; 

const ItemDiscovery = () => {
    const [items, setItems] = useState([]);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [urgency, setUrgency] = useState("");
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchItems = async () => {
        setLoading(true);
        setError("");

        let endpoint = "/all-items";
        if (filter === "lost") endpoint = "/lost-items";
        else if (filter === "found") endpoint = "/found-items";

        try {
            const response = await axios.get(`${API_BASE}${endpoint}`, {
                params: {
                    search,
                    category,
                    urgency,
                    date,
                    location,


                },
            });

            const data = response.data;
            if (Array.isArray(data)) {
                setItems(data);
            } else {
                setItems([]);
                console.error("Expected array, got:", data);
            }
        } catch (err) {
            console.error("Error fetching items:", err);
            setError("Failed to load items.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [filter, category, urgency, date, location]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchItems();
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">🔍 Discover Items</h2>

            <form onSubmit={handleSearch} className="mb-4 grid gap-2 md:grid-cols-3 lg:grid-cols-4">
                <input
                    type="text"
                    placeholder="Search items..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="p-2 border rounded"
                />

                <select value={filter} onChange={(e) => setFilter(e.target.value)} className="p-2 border rounded">
                    <option value="all">All Items</option>
                    <option value="lost">Lost Items</option>
                    <option value="found">Found Items</option>
                </select>

                <select value={category} onChange={(e) => setCategory(e.target.value)} className="p-2 border rounded">
                    <option value="">All Categories</option>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="documents">Documents</option>
                    <option value="accessories">Accessories</option>
                    <option value="other">Other</option>
                </select>

                <select value={urgency} onChange={(e) => setUrgency(e.target.value)} className="p-2 border rounded">
                    <option value="">All Urgencies</option>
                    <option value="low">Low</option>
                    <option value="moderate">Moderate</option>
                    <option value="high">High</option>
                </select>

                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="p-2 border rounded"
                />

                <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="p-2 border rounded"
                />

                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 col-span-1">
                     Search
                </button>
            </form>

            {loading && <p className="text-gray-500">Loading items...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {items.length === 0 && !loading ? (
                    <p className="col-span-full text-gray-500 text-center">No items found.</p>
                ) : (
                    items.map((item) => (
                        <div key={`${item.type}-${item.id}`} className="border p-4 rounded shadow bg-white">
                            <img
                                src={
                                    item.image_url
                                        ? item.image_url
                                        : "https://via.placeholder.com/300x200.png?text=No+Image"
                                }
                                alt={item.title || "Item"}
                                className="w-full h-20 object-cover rounded mb-2"
                            />
                            <h3 className="text-lg font-semibold">{item.title || "Untitled Item"}</h3>
                            <p className="text-sm text-gray-600">{item.description || "No description provided."}</p>
                            <p className="text-sm"> <strong>Category:</strong> {item.category || "N/A"}</p>
                            <p className="text-sm"> <strong>Urgency:</strong> {item.urgency || "N/A"}</p>
                            <p className="text-sm"><strong>Location:</strong> {item.location || "N/A"}</p>
                            <p className="text-sm"> <strong>Date:</strong> {item.date?.slice(0, 10) || "N/A"}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ItemDiscovery;
