import { motion } from "framer-motion";
import { FaHandHoldingHeart, FaDonate, FaChartLine } from "react-icons/fa";
import { formatCurrency } from "../../utils/currency";

const GOAL = 5000000;

const VERIFIED_STATUSES = new Set(["successful", "completed"]);

export default function DonationTracker({ donations = [] }) {
    const verified = donations.filter(
        (item) => !item.status || VERIFIED_STATUSES.has(item.status)
    );

    const totalsByCurrency = verified.reduce((totals, item) => {
        const code = String(item.currency || "NGN").toUpperCase();
        totals[code] = (totals[code] || 0) + Number(item.amount || 0);
        return totals;
    }, {});

    // The goal is denominated in NGN. We never convert other currencies into
    // NGN using a hardcoded exchange rate.
    const totalRaised = totalsByCurrency.NGN || 0;
    const remaining = Math.max(0, GOAL - totalRaised);
    const percentage = Math.min((totalRaised / GOAL) * 100, 100);

    const currencyCodes = Array.from(
        new Set(["NGN", "USD", "EUR", "GBP", ...Object.keys(totalsByCurrency)])
    );

    return (
        <section className="w-full bg-gradient-to-br from-green-900 via-green-800 to-emerald-700 text-white py-24">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <p className="uppercase tracking-[8px] text-yellow-400 font-semibold mb-4">
                        Royal Higher Life Ministries
                    </p>
                    <h1 className="text-6xl font-black leading-tight mb-6">
                        Give with Purpose.
                        <br />
                        Track Every Blessing.
                    </h1>
                    <p className="text-green-100 text-xl max-w-3xl">
                        Every donation changes lives, supports ministry outreach, and helps
                        spread the Gospel.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 mt-16 border border-white/20 shadow-2xl"
                >
                    <div className="grid lg:grid-cols-2 gap-10">
                        <div>
                            <p className="uppercase text-green-200">Total Raised (NGN)</p>
                            <h2 className="text-5xl font-black mt-3">
                                {formatCurrency(totalRaised, "NGN")}
                            </h2>
                            <p className="mt-3 text-green-200">
                                Goal{" "}
                                <span className="text-yellow-400 font-bold">
                                    {formatCurrency(GOAL, "NGN")}
                                </span>
                            </p>
                            <div className="w-full h-5 rounded-full bg-white/20 mt-8 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{ duration: 1 }}
                                    className="h-full rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500"
                                />
                            </div>
                            <div className="flex justify-between mt-4">
                                <span>{percentage.toFixed(1)}%</span>
                                <span>{formatCurrency(remaining, "NGN")} Remaining</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            {currencyCodes.map((code) => (
                                <div
                                    key={code}
                                    className="bg-white/10 rounded-2xl p-6 border border-white/10"
                                >
                                    <h3 className="text-yellow-300 text-2xl font-bold">
                                        {formatCurrency(totalsByCurrency[code] || 0, code)}
                                    </h3>
                                    <p className="mt-2 text-green-200">{code}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 mt-16">
                    <motion.div
                        whileHover={{ y: -8 }}
                        className="bg-white text-gray-800 rounded-3xl p-8 shadow-xl"
                    >
                        <FaDonate className="text-4xl text-green-700 mb-5" />
                        <h3 className="text-4xl font-black">{verified.length}</h3>
                        <p className="mt-2">Verified Donations</p>
                    </motion.div>
                    <motion.div
                        whileHover={{ y: -8 }}
                        className="bg-white text-gray-800 rounded-3xl p-8 shadow-xl"
                    >
                        <FaHandHoldingHeart className="text-4xl text-yellow-500 mb-5" />
                        <h3 className="text-4xl font-black">{percentage.toFixed(0)}%</h3>
                        <p className="mt-2">NGN Goal Completed</p>
                    </motion.div>
                    <motion.div
                        whileHover={{ y: -8 }}
                        className="bg-white text-gray-800 rounded-3xl p-8 shadow-xl"
                    >
                        <FaChartLine className="text-4xl text-green-700 mb-5" />
                        <h3 className="text-4xl font-black">
                            {formatCurrency(remaining, "NGN")}
                        </h3>
                        <p className="mt-2">Remaining NGN Goal</p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
