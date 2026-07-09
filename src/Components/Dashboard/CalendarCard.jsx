import {
    CalendarDays,
    Clock3,
    MapPin,
    ArrowRight,
} from "lucide-react";

const events = [
    {
        id: 1,
        title: "Sunday Worship Service",
        date: "July 13, 2026",
        time: "9:00 AM",
        location: "Main Auditorium",
        status: "Upcoming",
    },
    {
        id: 2,
        title: "Bible Study",
        date: "July 15, 2026",
        time: "6:00 PM",
        location: "Youth Hall",
        status: "Scheduled",
    },
    {
        id: 3,
        title: "Prayer Vigil",
        date: "July 18, 2026",
        time: "10:00 PM",
        location: "Prayer Ground",
        status: "Upcoming",
    },
];

export default function CalendarCard() {
    const today = new Date();

    return (
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">

            {/* Header */}

            <div className="bg-gradient-to-r from-green-700 to-green-900 text-white p-6">

                <div className="flex items-center gap-3">

                    <CalendarDays size={28} />

                    <div>

                        <h2 className="text-2xl font-bold">
                            Church Calendar
                        </h2>

                        <p className="text-green-100 text-sm">
                            Upcoming Ministry Events
                        </p>

                    </div>

                </div>

            </div>

            {/* Today's Date */}

            <div className="p-6 border-b">

                <h3 className="text-4xl font-bold text-green-700">
                    {today.getDate()}
                </h3>

                <p className="text-gray-600">
                    {today.toLocaleString("default", {
                        month: "long",
                        year: "numeric",
                    })}
                </p>

            </div>

            {/* Events */}

            <div className="divide-y">

                {events.map((event) => (

                    <div
                        key={event.id}
                        className="p-5 hover:bg-green-50 transition-all duration-300"
                    >

                        <div className="flex justify-between items-start">

                            <div>

                                <h3 className="font-bold text-gray-800">
                                    {event.title}
                                </h3>

                                <div className="flex items-center gap-2 mt-3 text-gray-500">

                                    <Clock3 size={16} />

                                    <span>{event.time}</span>

                                </div>

                                <div className="flex items-center gap-2 mt-2 text-gray-500">

                                    <MapPin size={16} />

                                    <span>{event.location}</span>

                                </div>

                                <p className="text-sm text-gray-400 mt-3">
                                    {event.date}
                                </p>

                            </div>

                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                                {event.status}
                            </span>

                        </div>

                    </div>

                ))}

            </div>

            {/* Footer */}

            <div className="p-5">

                <button className="w-full bg-green-700 hover:bg-green-800 text-white rounded-xl py-3 flex items-center justify-center gap-2 transition duration-300">

                    View Full Calendar

                    <ArrowRight size={18} />

                </button>

            </div>

        </div>
    );
}