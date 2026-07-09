import { useState } from "react";
import { motion } from "framer-motion";
import {
    CalendarDays,
    Search,
    Plus,
    Edit,
    Trash2,
    MapPin,
    Users,
} from "lucide-react";

const events = [
    {
        id: 1,
        title: "Sunday Worship Service",
        category: "Church Service",
        date: "July 13, 2026",
        time: "9:00 AM",
        location: "Main Auditorium",
        attendees: 450,
        status: "Upcoming",
    },
    {
        id: 2,
        title: "Youth Conference",
        category: "Conference",
        date: "July 18, 2026",
        time: "10:00 AM",
        location: "Youth Center",
        attendees: 220,
        status: "Upcoming",
    },
    {
        id: 3,
        title: "Prayer Night",
        category: "Prayer",
        date: "July 5, 2026",
        time: "6:00 PM",
        location: "Prayer Hall",
        attendees: 180,
        status: "Completed",
    },
    {
        id: 4,
        title: "Community Outreach",
        category: "Outreach",
        date: "August 2, 2026",
        time: "8:00 AM",
        location: "Ibadan City",
        attendees: 120,
        status: "Upcoming",
    },
    {
        id: 5,
        title: "Bible Study",
        category: "Teaching",
        date: "July 9, 2026",
        time: "5:30 PM",
        location: "Conference Room",
        attendees: 90,
        status: "Cancelled",
    },
];

export default function EventsTable() {
    const [search, setSearch] = useState("");

    const filteredEvents = events.filter(
        (event) =>
            event.title.toLowerCase().includes(search.toLowerCase()) ||
            event.category.toLowerCase().includes(search.toLowerCase())
    );

    const statusStyle = (status) => {
        switch (status) {
            case "Upcoming":
                return "bg-green-100 text-green-700";
            case "Completed":
                return "bg-blue-100 text-blue-700";
            case "Cancelled":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-lg border border-gray-200"
        >
            {/* Header */}

            <div className="flex flex-col lg:flex-row justify-between items-center gap-4 p-6 border-b">

                <div>

                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <CalendarDays className="text-green-700" />
                        Church Events
                    </h2>

                    <p className="text-gray-500">
                        Manage upcoming and previous ministry events.
                    </p>

                </div>

                <div className="flex gap-3">

                    <div className="relative">

                        <Search
                            size={18}
                            className="absolute left-3 top-3 text-gray-400"
                        />

                        <input
                            type="text"
                            placeholder="Search event..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-700 outline-none"
                        />

                    </div>

                    <button className="bg-green-700 hover:bg-green-800 text-white px-5 rounded-xl flex items-center gap-2">

                        <Plus size={18} />

                        New Event

                    </button>

                </div>

            </div>

            {/* Table */}

            <div className="overflow-x-auto">

                <table className="w-full">

                    <thead className="bg-gray-50">

                        <tr>

                            <th className="text-left p-4">Event</th>
                            <th className="text-left">Date</th>
                            <th className="text-left">Location</th>
                            <th className="text-left">Attendees</th>
                            <th className="text-left">Status</th>
                            <th className="text-left">Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {filteredEvents.map((event) => (

                            <tr
                                key={event.id}
                                className="border-t hover:bg-green-50 transition"
                            >

                                <td className="p-4">

                                    <div>

                                        <h3 className="font-semibold text-gray-800">
                                            {event.title}
                                        </h3>

                                        <p className="text-sm text-gray-500">
                                            {event.category}
                                        </p>

                                    </div>

                                </td>

                                <td>

                                    <p className="font-medium">
                                        {event.date}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        {event.time}
                                    </p>

                                </td>

                                <td>

                                    <div className="flex items-center gap-2">

                                        <MapPin
                                            size={16}
                                            className="text-green-700"
                                        />

                                        {event.location}

                                    </div>

                                </td>

                                <td>

                                    <div className="flex items-center gap-2">

                                        <Users
                                            size={16}
                                            className="text-blue-600"
                                        />

                                        {event.attendees}

                                    </div>

                                </td>

                                <td>

                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-semibold ${statusStyle(
                                            event.status
                                        )}`}
                                    >
                                        {event.status}
                                    </span>

                                </td>

                                <td>

                                    <div className="flex gap-2">

                                        <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition">

                                            <Edit size={16} />

                                        </button>

                                        <button className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition">

                                            <Trash2 size={16} />

                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

            {/* Footer */}

            <div className="flex justify-between items-center p-6 border-t flex-wrap gap-4">

                <div>

                    <h3 className="font-semibold text-lg">
                        {filteredEvents.length} Events
                    </h3>

                    <p className="text-gray-500">
                        Church calendar overview
                    </p>

                </div>

                <button className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl transition">

                    View Calendar

                </button>

            </div>

        </motion.div>
    );
}