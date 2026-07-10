import { CalendarDays, Clock3, MapPin, ArrowRight } from "lucide-react";

const upcomingEvents = [
    {
        id: 1,
        title: "Sunday Worship Service",
        date: "Sunday, July 12",
        time: "9:00 AM",
        location: "Main Auditorium",
    },
    {
        id: 2,
        title: "Youth Fellowship",
        date: "Friday, July 17",
        time: "5:00 PM",
        location: "Youth Center",
    },
    {
        id: 3,
        title: "Prayer & Fasting",
        date: "Monday, July 20",
        time: "6:00 AM",
        location: "Prayer Hall",
    },
];

export default function CalendarCard() {
    return (
        <section className="bg-white rounded-2xl shadow-lg p-6 h-full">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">
                        Upcoming Events
                    </h2>

                    <p className="text-sm text-slate-500">
                        Church calendar
                    </p>
                </div>

                <div className="bg-blue-100 p-3 rounded-xl">
                    <CalendarDays
                        size={26}
                        className="text-blue-600"
                    />
                </div>
            </div>

            <div className="space-y-4">
                {upcomingEvents.map((event) => (
                    <div
                        key={event.id}
                        className="border rounded-xl p-4 hover:shadow-md transition"
                    >
                        <h3 className="font-semibold text-slate-800 mb-3">
                            {event.title}
                        </h3>

                        <div className="space-y-2 text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                                <CalendarDays size={16} />
                                <span>{event.date}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Clock3 size={16} />
                                <span>{event.time}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <MapPin size={16} />
                                <span>{event.location}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition">
                View Full Calendar
                <ArrowRight size={18} />
            </button>
        </section>
    );
}