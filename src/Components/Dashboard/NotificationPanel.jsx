import {
    Bell,
    HeartHandshake,
    CalendarDays,
    Users,
    ShieldCheck,
    CheckCircle,
} from "lucide-react";

const notifications = [
    {
        id: 1,
        icon: HeartHandshake,
        title: "New Donation",
        message: "Grace A. donated ₦50,000 to Church Planting.",
        time: "2 mins ago",
        color: "bg-green-100 text-green-700",
        unread: true,
    },
    {
        id: 2,
        icon: CalendarDays,
        title: "Upcoming Event",
        message: "Youth Conference starts tomorrow at 9:00 AM.",
        time: "30 mins ago",
        color: "bg-blue-100 text-blue-700",
        unread: true,
    },
    {
        id: 3,
        icon: Users,
        title: "New Member",
        message: "Michael Johnson has joined the ministry.",
        time: "1 hour ago",
        color: "bg-purple-100 text-purple-700",
        unread: false,
    },
    {
        id: 4,
        icon: ShieldCheck,
        title: "Security Alert",
        message: "Your account was successfully logged in.",
        time: "Yesterday",
        color: "bg-yellow-100 text-yellow-700",
        unread: false,
    },
    {
        id: 5,
        icon: CheckCircle,
        title: "Payment Successful",
        message: "Your donation payment has been confirmed.",
        time: "Yesterday",
        color: "bg-emerald-100 text-emerald-700",
        unread: false,
    },
];

export default function NotificationPanel() {
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">

            {/* Header */}

            <div className="flex justify-between items-center p-6 border-b">

                <div className="flex items-center gap-3">

                    <Bell className="text-green-700" size={24} />

                    <div>

                        <h2 className="text-xl font-bold">
                            Notifications
                        </h2>

                        <p className="text-gray-500 text-sm">
                            Latest updates
                        </p>

                    </div>

                </div>

                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {notifications.filter((n) => n.unread).length}
                </span>

            </div>

            {/* Notification List */}

            <div className="max-h-[450px] overflow-y-auto">

                {notifications.map((notification) => {
                    const Icon = notification.icon;

                    return (
                        <div
                            key={notification.id}
                            className={`flex gap-4 p-5 border-b hover:bg-gray-50 transition duration-300 ${notification.unread ? "bg-green-50" : ""
                                }`}
                        >
                            <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center ${notification.color}`}
                            >
                                <Icon size={22} />
                            </div>

                            <div className="flex-1">

                                <div className="flex justify-between items-start">

                                    <h3 className="font-semibold text-gray-800">
                                        {notification.title}
                                    </h3>

                                    {notification.unread && (
                                        <span className="w-3 h-3 rounded-full bg-green-600"></span>
                                    )}

                                </div>

                                <p className="text-gray-600 mt-1 text-sm leading-6">
                                    {notification.message}
                                </p>

                                <p className="text-xs text-gray-400 mt-3">
                                    {notification.time}
                                </p>

                            </div>

                        </div>
                    );
                })}

            </div>

            {/* Footer */}

            <div className="p-5 border-t">

                <button className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl font-semibold transition duration-300">
                    View All Notifications
                </button>

            </div>

        </div>
    );
}