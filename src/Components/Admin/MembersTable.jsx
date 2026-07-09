import { motion } from "framer-motion";
import {
    Search,
    MoreVertical,
    UserPlus,
    Mail,
    Phone,
} from "lucide-react";
import { useState } from "react";

const members = [
    {
        id: 1,
        name: "Grace Adebayo",
        email: "grace@gmail.com",
        phone: "+234 812 345 6789",
        status: "Active",
        joined: "12 Jan 2026",
        image: "https://i.pravatar.cc/150?img=1",
    },
    {
        id: 2,
        name: "Michael Johnson",
        email: "michael@gmail.com",
        phone: "+234 813 222 4567",
        status: "Active",
        joined: "20 Feb 2026",
        image: "https://i.pravatar.cc/150?img=12",
    },
    {
        id: 3,
        name: "Sarah Williams",
        email: "sarah@gmail.com",
        phone: "+234 815 789 1122",
        status: "Pending",
        joined: "2 Mar 2026",
        image: "https://i.pravatar.cc/150?img=22",
    },
    {
        id: 4,
        name: "John David",
        email: "john@gmail.com",
        phone: "+234 806 987 2345",
        status: "Inactive",
        joined: "17 Apr 2026",
        image: "https://i.pravatar.cc/150?img=31",
    },
    {
        id: 5,
        name: "Elizabeth Smith",
        email: "elizabeth@gmail.com",
        phone: "+234 807 456 1111",
        status: "Active",
        joined: "8 May 2026",
        image: "https://i.pravatar.cc/150?img=41",
    },
];

export default function MembersTable() {
    const [search, setSearch] = useState("");

    const filteredMembers = members.filter((member) =>
        member.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-lg border border-gray-200"
        >
            {/* Header */}

            <div className="flex flex-col lg:flex-row justify-between items-center p-6 border-b gap-4">

                <div>

                    <h2 className="text-2xl font-bold text-gray-800">
                        Church Members
                    </h2>

                    <p className="text-gray-500">
                        Manage registered church members
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
                            placeholder="Search member..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-600 outline-none"
                        />

                    </div>

                    <button className="bg-green-700 hover:bg-green-800 text-white px-5 rounded-xl flex items-center gap-2">

                        <UserPlus size={18} />

                        Add Member

                    </button>

                </div>

            </div>

            {/* Table */}

            <div className="overflow-x-auto">

                <table className="w-full">

                    <thead className="bg-gray-50">

                        <tr className="text-left">

                            <th className="p-4">Member</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Joined</th>
                            <th>Status</th>
                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {filteredMembers.map((member) => (

                            <tr
                                key={member.id}
                                className="border-t hover:bg-green-50 transition"
                            >

                                {/* Member */}

                                <td className="p-4">

                                    <div className="flex items-center gap-4">

                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-12 h-12 rounded-full"
                                        />

                                        <div>

                                            <h4 className="font-semibold">
                                                {member.name}
                                            </h4>

                                        </div>

                                    </div>

                                </td>

                                {/* Email */}

                                <td>

                                    <div className="flex items-center gap-2">

                                        <Mail
                                            size={16}
                                            className="text-gray-400"
                                        />

                                        {member.email}

                                    </div>

                                </td>

                                {/* Phone */}

                                <td>

                                    <div className="flex items-center gap-2">

                                        <Phone
                                            size={16}
                                            className="text-gray-400"
                                        />

                                        {member.phone}

                                    </div>

                                </td>

                                {/* Joined */}

                                <td>{member.joined}</td>

                                {/* Status */}

                                <td>

                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-semibold
                    ${member.status === "Active"
                                                ? "bg-green-100 text-green-700"
                                                : member.status === "Pending"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {member.status}
                                    </span>

                                </td>

                                {/* Action */}

                                <td>

                                    <button className="hover:bg-gray-100 p-2 rounded-lg">

                                        <MoreVertical size={20} />

                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

            {/* Footer */}

            <div className="flex justify-between items-center p-6 border-t flex-wrap gap-3">

                <p className="text-gray-500">
                    Showing {filteredMembers.length} of {members.length} members
                </p>

                <div className="flex gap-2">

                    <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">
                        Previous
                    </button>

                    <button className="px-4 py-2 bg-green-700 text-white rounded-lg">
                        1
                    </button>

                    <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">
                        2
                    </button>

                    <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">
                        Next
                    </button>

                </div>

            </div>

        </motion.div>
    );
}