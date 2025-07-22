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
        <div className="p-4 min-h-screen bg-[#FFFFFF]">
            <h1 className="text-4xl font-extrabold text-center text-[#2E4734] mb-6">Item Listings</h1>

            <div className="flex flex-wrap justify-between mb-4 gap-2">
                <div className="flex gap-2">
                    {TABS.map(tab => (
                        <button
                            key={tab}
                            className={`px-4 py-2 rounded-full transition ${activeTab === tab
                                    ? "bg-[#2E4734] text-white"
                                    : "bg-[#F7F7F7] text-[#1A1A1A]"
                                }`}
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
                    className="px-4 py-2 border border-[#D1D5DB] text-[#1A1A1A] rounded-xl w-full sm:w-1/3 bg-[#FFFFFF]"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <select
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="p-2 rounded-xl border border-[#D1D5DB] bg-[#FFFFFF] text-[#1A1A1A]"
                >
                    <option value="">All Categories</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Documents">Documents</option>
                </select>

                <input
                    type="date"
                    onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
                    className="p-2 rounded-xl border border-[#D1D5DB] bg-[#FFFFFF] text-[#1A1A1A]"
                />

                <input
                    type="text"
                    placeholder="Location"
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                    className="p-2 rounded-xl border border-[#D1D5DB] bg-[#FFFFFF] text-[#1A1A1A]"
                />

                <select
                    onChange={(e) => setFilters(prev => ({ ...prev, urgency: e.target.value }))}
                    className="p-2 rounded-xl border border-[#D1D5DB] bg-[#FFFFFF] text-[#1A1A1A]"
                >
                    <option value="">All Urgencies</option>
                    {URGENCY_LEVELS.map(level => (
                        <option key={level} value={level}>{level}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map(item => (
                    <div key={item.id} className="bg-[#F7F7F7] shadow rounded-lg p-4">
                        <img
                            src={item.imageUrl || "https://via.placeholder.com/150"}
                            alt={item.name}
                            className="w-full h-40 object-cover rounded-md mb-2"
                        />
                        <h2 className="text-lg font-bold text-[#1A1A1A] mb-1">{item.name}</h2>
                        <p className="text-sm text-[#D1D5DB] mb-1">{item.description.slice(0, 60)}...</p>
                        <p className="text-sm text-[#1A1A1A]">Date: {item.date}</p>
                        <p className="text-sm text-[#1A1A1A]">Urgency: {item.urgency || "Not specified"}</p>
                        <Link
                            to={`/items/${item.id}`}
                            className="mt-2 inline-block text-[#224F35] hover:underline"
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
