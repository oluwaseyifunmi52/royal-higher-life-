import { motion } from "framer-motion";
import {
    FaBible,
    FaChurch,
    FaHandsHelping,
    FaHeartbeat,
    FaGraduationCap,
    FaGlobeAfrica,
} from "react-icons/fa";

const impacts = [
    {
        icon: <FaBible />,
        amount: "₦5,000",
        title: "Bible Distribution",
        description:
            "Provides Bibles and Christian materials to new believers and mission fields.",
        color: "from-green-500 to-emerald-700",
    },
    {
        icon: <FaHandsHelping />,
        amount: "₦10,000",
        title: "Feed a Family",
        description:
            "Supports food relief and welfare for families in need within our community.",
        color: "from-yellow-400 to-orange-500",
    },
    {
        icon: <FaGraduationCap />,
        amount: "₦25,000",
        title: "Youth Ministry",
        description:
            "Helps organize youth conferences, discipleship classes, and leadership training.",
        color: "from-blue-500 to-indigo-700",
    },
    {
        icon: <FaHeartbeat />,
        amount: "₦50,000",
        title: "Medical Outreach",
        description:
            "Provides free medical care, medications, and health outreach programs.",
        color: "from-red-500 to-pink-600",
    },
    {
        icon: <FaChurch />,
        amount: "₦100,000",
        title: "Church Building",
        description:
            "Supports church construction, renovation, and ministry expansion projects.",
        color: "from-purple-500 to-violet-700",
    },
    {
        icon: <FaGlobeAfrica />,
        amount: "₦500,000",
        title: "Mission Outreach",
        description:
            "Sponsors evangelism, church planting, and missionary work across Africa.",
        color: "from-emerald-500 to-green-800",
    },
];

export default function ImpactCards() {
    return (
        <section className="py-24 bg-gradient-to-b from-slate-50 to-white">

            <div className="max-w-7xl mx-auto px-6">

                {/* Heading */}

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <p className="uppercase tracking-[6px] text-green-700 font-semibold">
                        Your Impact
                    </p>

                    <h2 className="text-5xl font-black mt-4">
                        Every Gift Changes Lives
                    </h2>

                    <p className="text-gray-600 mt-6 max-w-3xl mx-auto leading-8">
                        Your generosity fuels ministry, transforms communities,
                        spreads the Gospel, and brings hope to thousands of people.
                    </p>
                </motion.div>

                {/* Cards */}

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

                    {impacts.map((item, index) => (

                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.1,
                            }}
                            whileHover={{
                                y: -10,
                                scale: 1.03,
                            }}
                            className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
                        >

                            {/* Top Gradient */}

                            <div
                                className={`bg-gradient-to-r ${item.color} h-2`}
                            />

                            <div className="p-8">

                                <div
                                    className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${item.color}
                  flex items-center justify-center text-white text-4xl shadow-lg`}
                                >
                                    {item.icon}
                                </div>

                                <h3 className="text-3xl font-black mt-8 text-green-800">
                                    {item.amount}
                                </h3>

                                <h4 className="text-xl font-bold mt-4">
                                    {item.title}
                                </h4>

                                <p className="text-gray-600 mt-4 leading-7">
                                    {item.description}
                                </p>

                                <button
                                    className={`mt-8 w-full py-4 rounded-xl text-white font-semibold
                  bg-gradient-to-r ${item.color}
                  hover:opacity-90 transition`}
                                >
                                    Sponsor This Cause
                                </button>

                            </div>

                        </motion.div>

                    ))}

                </div>

                {/* Bottom Banner */}

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-20 bg-gradient-to-r from-green-800 to-green-600 rounded-3xl p-12 text-center text-white shadow-2xl"
                >

                    <h2 className="text-4xl font-black">
                        Together We Can Make a Difference
                    </h2>

                    <p className="mt-6 text-lg text-green-100 max-w-3xl mx-auto">
                        Every donation—large or small—helps Royal Higher Life Ministries
                        reach more people with the love of Christ and support life-changing
                        projects in our communities and beyond.
                    </p>

                    <button className="mt-10 bg-yellow-400 hover:bg-yellow-500 text-green-900 font-bold px-10 py-4 rounded-full transition">
                        Donate Today
                    </button>

                </motion.div>

            </div>

        </section>
    );
}