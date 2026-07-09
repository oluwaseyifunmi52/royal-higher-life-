import { motion } from "framer-motion";
import {
    FaHandHoldingHeart,
    FaDonate,
    FaChartLine,
} from "react-icons/fa";

const GOAL = 5000000;

export default function DonationTracker({ donations = [] }) {
    const totalRaised = donations.reduce(
        (sum, item) => sum + Number(item.amount),
        0
    );

    const remaining = GOAL - totalRaised;

    const percentage = Math.min(
        (totalRaised / GOAL) * 100,
        100
    );

    const currencies = [
        {
            label: "NGN",
            symbol: "₦",
            amount: totalRaised,
        },
        {
            label: "USD",
            symbol: "$",
            amount: totalRaised / 1500,
        },
        {
            label: "EUR",
            symbol: "€",
            amount: totalRaised / 1700,
        },
        {
            label: "GBP",
            symbol: "£",
            amount: totalRaised / 1900,
        },
    ];

    return (
        <section className="w-full bg-gradient-to-br from-green-900 via-green-800 to-emerald-700 text-white py-24">

            <div className="max-w-7xl mx-auto px-6">

                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: .8 }}
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

                        Every donation changes lives,
                        supports ministry outreach,
                        and helps spread the Gospel.

                    </p>

                </motion.div>

                {/* Main Card */}

                <motion.div

                    initial={{ opacity: 0, scale: .9 }}

                    whileInView={{ opacity: 1, scale: 1 }}

                    transition={{ duration: .8 }}

                    className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 mt-16 border border-white/20 shadow-2xl"

                >

                    <div className="grid lg:grid-cols-2 gap-10">

                        {/* Left */}

                        <div>

                            <p className="uppercase text-green-200">

                                Total Raised

                            </p>

                            <h2 className="text-5xl font-black mt-3">

                                ₦{totalRaised.toLocaleString()}

                            </h2>

                            <p className="mt-3 text-green-200">

                                Goal

                                <span className="text-yellow-400 font-bold">

                                    {" "}
                                    ₦{GOAL.toLocaleString()}

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

                                <span>

                                    {percentage.toFixed(1)}%

                                </span>

                                <span>

                                    ₦{remaining.toLocaleString()} Remaining

                                </span>

                            </div>

                        </div>

                        {/* Right */}

                        <div className="grid grid-cols-2 gap-5">

                            {currencies.map((currency) => (

                                <div

                                    key={currency.label}

                                    className="bg-white/10 rounded-2xl p-6 border border-white/10"

                                >

                                    <h3 className="text-yellow-300 text-2xl font-bold">

                                        {currency.symbol}

                                        {currency.amount.toLocaleString(undefined, {
                                            maximumFractionDigits: 0,
                                        })}

                                    </h3>

                                    <p className="mt-2 text-green-200">

                                        {currency.label}

                                    </p>

                                </div>

                            ))}

                        </div>

                    </div>

                </motion.div>

                {/* Statistics */}

                <div className="grid md:grid-cols-3 gap-8 mt-16">

                    <motion.div

                        whileHover={{ y: -8 }}

                        className="bg-white text-gray-800 rounded-3xl p-8 shadow-xl"

                    >

                        <FaDonate className="text-4xl text-green-700 mb-5" />

                        <h3 className="text-4xl font-black">

                            {donations.length}

                        </h3>

                        <p className="mt-2">

                            Total Donations

                        </p>

                    </motion.div>

                    <motion.div

                        whileHover={{ y: -8 }}

                        className="bg-white text-gray-800 rounded-3xl p-8 shadow-xl"

                    >

                        <FaHandHoldingHeart className="text-4xl text-yellow-500 mb-5" />

                        <h3 className="text-4xl font-black">

                            {percentage.toFixed(0)}%

                        </h3>

                        <p className="mt-2">

                            Goal Completed

                        </p>

                    </motion.div>

                    <motion.div

                        whileHover={{ y: -8 }}

                        className="bg-white text-gray-800 rounded-3xl p-8 shadow-xl"

                    >

                        <FaChartLine className="text-4xl text-green-700 mb-5" />

                        <h3 className="text-4xl font-black">

                            ₦{remaining.toLocaleString()}

                        </h3>

                        <p className="mt-2">

                            Remaining Goal

                        </p>

                    </motion.div>

                </div>

            </div>

        </section>
    );
}