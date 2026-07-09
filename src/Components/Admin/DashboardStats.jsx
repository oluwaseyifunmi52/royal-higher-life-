import { motion } from "framer-motion";
import {
    Users,
    HeartHandshake,
    DollarSign,
    CalendarDays,
    TrendingUp,
    TrendingDown,
} from "lucide-react";

const stats = [
    {
        id: 1,
        title: "Total Members",
        value: "2,548",
        change: "+12.5%",
        trend: "up",
        icon: Users,
        bg: "bg-blue-100",
        color: "text-blue-600",
    },
    {
        id: 2,
        title: "Total Donations",
        value: "₦18,450,000",
        change: "+18.2%",
        trend: "up",
        icon: HeartHandshake,
        bg: "bg-green-100",
        color: "text-green-600",
    },
    {
        id: 3,
        title: "Monthly Revenue",
        value: "₦3,280,000",
        change: "+9.8%",
        trend: "up",
        icon: DollarSign,
        bg: "bg-yellow-100",
        color: "text-yellow-600",
    },
    {
        id: 4,
        title: "Upcoming Events",
        value: "14",
        change: "-2%",
        trend: "down",
        icon: CalendarDays,
        bg: "bg-purple-100",
        color: "text-purple-600",
    },
];

export default function DashboardStats() {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((item, index) => {
                const Icon = item.icon;

                return (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.4,
                            delay: index * 0.1,
                        }}
                        whileHover={{
                            y: -8,
                            scale: 1.02,
                        }}
                        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md transition-all hover:shadow-xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div
                                className={`flex h-14 w-14 items-center justify-center rounded-xl ${item.bg}`}
                            >
                                <Icon className={item.color} size={28} />
                            </div>

                            <div
                                className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${item.trend === "up"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-600"
                                    }`}
                            >
                                {item.trend === "up" ? (
                                    <TrendingUp size={16} />
                                ) : (
                                    <TrendingDown size={16} />
                                )}

                                {item.change}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="mt-6">
                            <h3 className="text-sm font-medium text-gray-500">
                                {item.title}
                            </h3>

                            <p className="mt-2 text-3xl font-bold text-gray-800">
                                {item.value}
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="mt-6 border-t pt-4">
                            <p className="text-sm text-gray-500">
                                Compared to last month
                            </p>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}