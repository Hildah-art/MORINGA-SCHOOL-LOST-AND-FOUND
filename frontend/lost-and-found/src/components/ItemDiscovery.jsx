import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Styles/index.css";

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

    const navigate = useNavigate();

    const fetchItems = async () => {
        setLoading(true);
        setError("");

        let endpoint = "/all-items";
        if (filter === "lost") endpoint = "/lost-items";
        else if (filter === "found") endpoint = "/found-items";

        try {
            const response = await axios.get(`${API_BASE}${endpoint}`, {
                params: { search, category, urgency, date, location },
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
        <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>Discover Items</h2>

            <form onSubmit={handleSearch} style={{ marginBottom: "24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
                <input type="text" placeholder="Search items..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} />
                <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}>
                    <option value="all">All Items</option>
                    <option value="lost">Lost Items</option>
                    <option value="found">Found Items</option>
                </select>
                <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}>
                    <option value="">All Categories</option>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="documents">Documents</option>
                    <option value="accessories">Accessories</option>
                    <option value="other">Other</option>
                </select>
                <select value={urgency} onChange={(e) => setUrgency(e.target.value)} style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}>
                    <option value="">All Urgencies</option>
                    <option value="low">Low</option>
                    <option value="moderate">Moderate</option>
                    <option value="high">High</option>
                </select>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} />
                <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} />
                <button type="submit" style={{ backgroundColor: "#2563eb", color: "white", padding: "8px 16px", borderRadius: "4px", border: "none", cursor: "pointer" }}>Search</button>
            </form>

            {loading && <p style={{ color: "#6b7280" }}>Loading items...</p>}
            {error && <p style={{ color: "#ef4444" }}>{error}</p>}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px" }}>
                {items.length === 0 && !loading ? (
                    <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "#6b7280" }}>No items found.</p>
                ) : (
                    items.map((item) => (
                        <div key={`${item.type}-${item.id}`} style={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "16px", textAlign: "center", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)" }}>
                            <img src={item.image_url || "https://via.placeholder.com/150.png?text=No+Image"} alt={item.title || "Item"} style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "4px", backgroundColor: "white", marginBottom: "12px" }} />
                            <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "8px" }}>{item.title || "Untitled Item"}</h3>
                            <p style={{ fontSize: "0.9rem", margin: "4px 0" }}>{item.description || "No description provided."}</p>
                            <p style={{ fontSize: "0.85rem", margin: "4px 0" }}><strong>Category:</strong> {item.category || "N/A"}</p>
                            <p style={{ fontSize: "0.85rem", margin: "4px 0" }}><strong>Urgency:</strong> {item.urgency || "N/A"}</p>
                            <p style={{ fontSize: "0.85rem", margin: "4px 0" }}><strong>Location:</strong> {item.location || "N/A"}</p>
                            <p style={{ fontSize: "0.85rem", margin: "4px 0" }}><strong>Date:</strong> {item.date?.slice(0, 10) || "N/A"}</p>

                            <button
                                onClick={() => navigate(`/claim/${item.id}`)}
                                style={{ marginTop: "10px", padding: "6px 12px", borderRadius: "4px", backgroundColor: "#10b981", color: "white", border: "none", cursor: "pointer" }}
                            >
                                Claim
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ItemDiscovery;
