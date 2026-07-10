import { Heart, Users, CalendarDays, Star } from "lucide-react";

const stats = [
    {
        title: "Total Donations",
        value: "₦2,500,000",
        icon: Heart,
    },
    {
        title: "Members",
        value: "1,245",
        icon: Users,
    },
    {
        title: "Events",
        value: "18",
        icon: CalendarDays,
    },
    {
        title: "Reviews",
        value: "4.9 ★",
        icon: Star,
    },
];

export default function StatsCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {stats.map((item, index) => {
                const Icon = item.icon;

                return (
                    <div
                        key={index}
                        className="bg-white rounded-xl shadow-md p-6"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-gray-500 text-sm">
                                    {item.title}
                                </p>

                                <h2 className="text-2xl font-bold mt-2">
                                    {item.value}
                                </h2>
                            </div>

                            <Icon
                                size={36}
                                className="text-blue-600"
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}