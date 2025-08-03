// src/components/ItemDiscovery.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";


const TABS = ["All", "Lost", "Found"];
const URGENCY_LEVELS = ["Low", "Medium", "High"];

const ItemDiscovery = () => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [activeTab, setActiveTab] = useState("All");
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({ category: "", date: "", location: "", urgency: "" });

    useEffect(() => {
        axios.get("http://localhost:3000/items")
            .then(res => {
                setItems(res.data);
                setFilteredItems(res.data);
          })
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        let temp = [...items];

        if (activeTab !== "All") {
            temp = temp.filter(item => item.status === activeTab);
        }

        if (filters.category) {
            temp = temp.filter(item => item.category === filters.category);
        }

        if (filters.date) {
            temp = temp.filter(item => item.date === filters.date);
        }

        if (filters.location) {
            temp = temp.filter(item => item.location.toLowerCase().includes(filters.location.toLowerCase()));
        }

        if (filters.urgency) {
            temp = temp.filter(item => item.urgency === filters.urgency);
        }

        if (search) {
            temp = temp.filter(item =>
                item.name.toLowerCase().includes(search.toLowerCase()) ||
                item.description.toLowerCase().includes(search.toLowerCase())
            );
        }

        setFilteredItems(temp);
    }, [activeTab, search, filters, items]);

    return (
        <div className="itemdiscovery-wrapper">
            <h1 className="itemdiscovery-title">Item Listings</h1>

            <div className="itemdiscovery-top-controls">
                <div className="itemdiscovery-tabs">
                    {TABS.map(tab => (
                        <button
                            key={tab}
                            className={`tab-button ${activeTab === tab ? "active" : ""}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <input
                    type="text"
                    placeholder="Search items..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                />
            </div>

            <div className="itemdiscovery-filters">
                <select
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="filter-select"
                >
                    <option value="">All Categories</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Documents">Documents</option>
                </select>

                <input
                    type="date"
                    onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
                    className="filter-input"
                />

                <input
                    type="text"
                    placeholder="Location"
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                    className="filter-input"
                />

                <select
                    onChange={(e) => setFilters(prev => ({ ...prev, urgency: e.target.value }))}
                    className="filter-select"
                >
                    <option value="">All Urgencies</option>
                    {URGENCY_LEVELS.map(level => (
                        <option key={level} value={level}>{level}</option>
                    ))}
                </select>
            </div>

            <div className="itemdiscovery-grid">
                {filteredItems.map(item => (
                    <div key={item.id} className="item-card">
                        <img
                            src={item.imageUrl || "https://via.placeholder.com/150"}
                            alt={item.name}
                            className="item-image"
                        />
                        <h2 className="item-title">{item.name}</h2>
                        <p className="item-description">{item.description.slice(0, 60)}...</p>
                        <p className="item-date">Date: {item.date}</p>
                        <p className="item-urgency">Urgency: {item.urgency || "Not specified"}</p>
                        <Link
                            to={`/items/${item.id}`}
                            className="item-link"
                        >
                            View Details
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ItemDiscovery;
