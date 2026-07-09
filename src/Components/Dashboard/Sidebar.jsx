import {
    Home,
    Heart,
    Calendar,
    Users,
    Bell,
    Settings,
    LogOut,
} from "lucide-react";

const menu = [
    { icon: Home, title: "Dashboard" },
    { icon: Heart, title: "My Donations" },
    { icon: Calendar, title: "Events" },
    { icon: Users, title: "Prayer Requests" },
    { icon: Bell, title: "Notifications" },
    { icon: Settings, title: "Settings" },
];

export default function Sidebar() {
    return (
        <aside className="w-72 min-h-screen bg-green-900 text-white p-6">

            <h1 className="text-3xl font-bold mb-12">
                Royal Higher Life
            </h1>

            <nav className="space-y-2">

                {menu.map(({ icon: Icon, title }) => (

                    <button
                        key={title}
                        className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-green-800 transition"
                    >
                        <Icon size={20} />
                        {title}
                    </button>

                ))}

            </nav>

            <button className="mt-20 flex items-center gap-4 text-red-300 hover:text-white">
                <LogOut />
                Logout
            </button>

        </aside>
    );
}