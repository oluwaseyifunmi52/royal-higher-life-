import { motion } from "framer-motion";
import {
  Search,
  Mail,
  Reply,
  Trash2,
  Clock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";

const messages = [
  {
    id: 1,
    name: "Grace Adebayo",
    email: "grace@gmail.com",
    avatar: "https://i.pravatar.cc/150?img=32",
    subject: "Prayer Request",
    message:
      "Please remember my family in your prayers during this difficult season.",
    time: "5 mins ago",
    unread: true,
    priority: "High",
  },
  {
    id: 2,
    name: "Michael Johnson",
    email: "michael@gmail.com",
    avatar: "https://i.pravatar.cc/150?img=12",
    subject: "Donation Inquiry",
    message:
      "I would like to know if I can make recurring monthly donations.",
    time: "25 mins ago",
    unread: false,
    priority: "Normal",
  },
  {
    id: 3,
    name: "Sarah Williams",
    email: "sarah@gmail.com",
    avatar: "https://i.pravatar.cc/150?img=22",
    subject: "Volunteer Registration",
    message:
      "I would love to volunteer during the upcoming church outreach.",
    time: "1 hour ago",
    unread: true,
    priority: "Medium",
  },
  {
    id: 4,
    name: "John David",
    email: "john@gmail.com",
    avatar: "https://i.pravatar.cc/150?img=45",
    subject: "Event Information",
    message:
      "Could you kindly provide details about the annual youth conference?",
    time: "3 hours ago",
    unread: false,
    priority: "Low",
  },
];

export default function MessagesPanel() {
  const [search, setSearch] = useState("");

  const filteredMessages = messages.filter(
    (message) =>
      message.name.toLowerCase().includes(search.toLowerCase()) ||
      message.subject.toLowerCase().includes(search.toLowerCase())
  );

  const priorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      case "Low":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-green-100 text-green-700";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-lg border border-gray-200"
    >
      {/* Header */}

      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 p-6 border-b">

        <div>

          <h2 className="text-2xl font-bold text-gray-800">
            Messages
          </h2>

          <p className="text-gray-500">
            Church contact messages & inquiries
          </p>

        </div>

        <div className="relative">

          <Search
            size={18}
            className="absolute left-3 top-3 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-700 outline-none"
          />

        </div>

      </div>

      {/* Messages */}

      <div className="divide-y">

        {filteredMessages.map((msg) => (

          <motion.div
            key={msg.id}
            whileHover={{ scale: 1.01 }}
            className="p-5 hover:bg-green-50 transition"
          >

            <div className="flex justify-between items-start">

              <div className="flex gap-4">

                <img
                  src={msg.avatar}
                  alt={msg.name}
                  className="w-14 h-14 rounded-full"
                />

                <div>

                  <div className="flex items-center gap-3">

                    <h3 className="font-bold text-gray-800">
                      {msg.name}
                    </h3>

                    {msg.unread ? (
                      <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                        New
                      </span>
                    ) : (
                      <CheckCircle
                        size={16}
                        className="text-green-600"
                      />
                    )}

                  </div>

                  <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">

                    <Mail size={15} />

                    {msg.email}

                  </div>

                  <h4 className="font-semibold mt-3">
                    {msg.subject}
                  </h4>

                  <p className="text-gray-600 mt-1">
                    {msg.message}
                  </p>

                  <div className="flex items-center gap-3 mt-4">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityColor(
                        msg.priority
                      )}`}
                    >
                      <AlertCircle
                        size={12}
                        className="inline mr-1"
                      />

                      {msg.priority}

                    </span>

                    <span className="flex items-center gap-1 text-gray-500 text-sm">

                      <Clock size={14} />

                      {msg.time}

                    </span>

                  </div>

                </div>

              </div>

              {/* Actions */}

              <div className="flex gap-2">

                <button className="bg-green-700 hover:bg-green-800 text-white p-3 rounded-xl transition">

                  <Reply size={18} />

                </button>

                <button className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-xl transition">

                  <Trash2 size={18} />

                </button>

              </div>

            </div>

          </motion.div>

        ))}

      </div>

      {/* Footer */}

      <div className="flex justify-between items-center p-6 border-t flex-wrap gap-4">

        <div>

          <h3 className="font-bold text-lg">
            Total Messages
          </h3>

          <p className="text-gray-500">
            {messages.length} Messages Received
          </p>

        </div>

        <button className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl transition">

          View All Messages

        </button>

      </div>

    </motion.div>
  );
}