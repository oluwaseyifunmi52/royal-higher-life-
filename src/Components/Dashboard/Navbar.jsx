import { Bell, Search } from "lucide-react";

export default function Navbar() {
    return (
        <header className="bg-white shadow px-8 py-5 flex justify-between items-center">

            <h2 className="text-2xl font-bold">
                Dashboard
            </h2>

            <div className="flex items-center gap-6">

                <div className="relative">

                    <Search
                        className="absolute left-3 top-3 text-gray-400"
                        size={18}
                    />

                    <input
                        placeholder="Search..."
                        className="border rounded-xl pl-10 pr-4 py-2"
                    />

                </div>

                <Bell />

                <img
                    src="https://i.pravatar.cc/150?img=12"
                    alt="user"
                    className="w-11 h-11 rounded-full"
                />

            </div>

        </header>
    );
}