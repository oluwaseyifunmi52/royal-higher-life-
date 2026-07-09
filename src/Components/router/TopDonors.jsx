import { motion } from "framer-motion";
import {
    FaCrown,
    FaMedal,
    FaAward,
    FaUserCircle,
} from "react-icons/fa";

const medalStyles = {
    1: {
        icon: <FaCrown className="text-yellow-400 text-3xl" />,
        bg: "bg-gradient-to-r from-yellow-400 to-yellow-600",
        label: "Platinum Donor",
    },
    2: {
        icon: <FaMedal className="text-gray-200 text-3xl" />,
        bg: "bg-gradient-to-r from-gray-400 to-gray-600",
        label: "Gold Donor",
    },
    3: {
        icon: <FaAward className="text-orange-400 text-3xl" />,
        bg: "bg-gradient-to-r from-orange-400 to-orange-600",
        label: "Silver Donor",
    },
};

export default function TopDonors({ donors = [] }) {
    const sortedDonors = [...donors].sort(
        (a, b) => Number(b.amount) - Number(a.amount)
    );

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">

                {/* Heading */}

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: .6 }}
                    className="text-center mb-16"
                >
                    <p className="uppercase tracking-[6px] text-green-700 font-semibold">
                        Hall of Generosity
                    </p>

                    <h2 className="text-5xl font-black mt-4">
                        Top Donors
                    </h2>

                    <p className="text-gray-500 mt-5 max-w-3xl mx-auto leading-8">
                        We celebrate the generosity of every giver.
                        Together we are building God's Kingdom,
                        changing lives and impacting generations.
                    </p>
                </motion.div>

                {sortedDonors.length === 0 ? (
                    <div className="bg-slate-50 rounded-3xl p-20 text-center shadow-lg">

                        <FaCrown className="mx-auto text-6xl text-yellow-400 mb-6" />

                        <h3 className="text-3xl font-bold">
                            No Top Donors Yet
                        </h3>

                        <p className="text-gray-500 mt-4">
                            Your biggest supporters will appear here.
                        </p>

                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">

                        {sortedDonors.slice(0, 6).map((donor, index) => {

                            const rank = index + 1;
                            const medal = medalStyles[rank];

                            return (

                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    whileHover={{
                                        y: -10,
                                        scale: 1.02,
                                    }}
                                    transition={{
                                        delay: index * .1,
                                    }}
                                    className="relative bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200"
                                >

                                    {/* Ribbon */}

                                    {medal && (
                                        <div
                                            className={`${medal.bg} text-white py-3 text-center font-bold`}
                                        >
                                            {medal.label}
                                        </div>
                                    )}

                                    <div className="p-8">

                                        <div className="flex justify-between">

                                            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">

                                                <FaUserCircle className="text-5xl text-green-700" />

                                            </div>

                                            {medal?.icon}

                                        </div>

                                        <h3 className="text-2xl font-bold mt-8">

                                            {donor.anonymous
                                                ? "Anonymous Donor"
                                                : donor.name}

                                        </h3>

                                        <p className="text-gray-500 mt-2">

                                            {donor.country || "Nigeria"}

                                        </p>

                                        <div className="mt-8">

                                            <p className="text-gray-500">
                                                Total Given
                                            </p>

                                            <h2 className="text-4xl font-black text-green-700 mt-2">

                                                ₦{Number(donor.amount).toLocaleString()}

                                            </h2>

                                        </div>

                                        <div className="mt-8 flex justify-between">

                                            <div>

                                                <p className="text-sm text-gray-500">
                                                    Donations
                                                </p>

                                                <h4 className="font-bold text-xl">
                                                    {donor.totalDonations || 1}
                                                </h4>

                                            </div>

                                            <div>

                                                <p className="text-sm text-gray-500">
                                                    Rank
                                                </p>

                                                <h4 className="font-bold text-xl">
                                                    #{rank}
                                                </h4>

                                            </div>

                                        </div>

                                        <div className="mt-8">

                                            <div className="flex justify-between text-sm mb-2">

                                                <span>Loyalty</span>

                                                <span>100%</span>

                                            </div>

                                            <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">

                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: "100%" }}
                                                    transition={{ duration: 1 }}
                                                    className="h-full bg-gradient-to-r from-green-600 to-yellow-400"
                                                />

                                            </div>

                                        </div>

                                    </div>

                                </motion.div>

                            );

                        })}

                    </div>
                )}
            </div>
        </section>
    );
}