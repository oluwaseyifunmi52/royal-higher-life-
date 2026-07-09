import { motion } from "framer-motion";
import {
    FaHeart,
    FaUserCircle,
    FaCheckCircle,
} from "react-icons/fa";

export default function RecentDonations({ donations = [] }) {
    return (
        <section className="py-20 bg-slate-50">

            <div className="max-w-7xl mx-auto px-6">

                {/* Heading */}

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: .6 }}
                    className="text-center mb-14"
                >

                    <span className="uppercase tracking-[5px] text-green-700 font-semibold">
                        Giving History
                    </span>

                    <h2 className="text-5xl font-black mt-4">
                        Recent Donations
                    </h2>

                    <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
                        Every donation helps Royal Higher Life Ministries
                        spread the Gospel, serve communities,
                        and transform lives.
                    </p>

                </motion.div>

                {/* Empty State */}

                {donations.length === 0 && (

                    <div className="bg-white rounded-3xl p-16 shadow-lg text-center">

                        <FaHeart className="text-6xl text-green-700 mx-auto mb-6" />

                        <h3 className="text-3xl font-bold">

                            No Donations Yet

                        </h3>

                        <p className="text-gray-500 mt-4">

                            Be the first person to support this ministry.

                        </p>

                    </div>

                )}

                {/* Donation Cards */}

                <div className="grid lg:grid-cols-2 gap-8">

                    {donations.map((donation, index) => (

                        <motion.div

                            key={index}

                            initial={{ opacity: 0, y: 40 }}

                            whileInView={{ opacity: 1, y: 0 }}

                            transition={{ delay: index * .08 }}

                            whileHover={{
                                y: -8,
                                scale: 1.02,
                            }}

                            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8"

                        >

                            <div className="flex justify-between items-center">

                                <div className="flex items-center gap-4">

                                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">

                                        <FaUserCircle className="text-4xl text-green-700" />

                                    </div>

                                    <div>

                                        <h3 className="font-bold text-xl">

                                            {donation.anonymous
                                                ? "Anonymous Donor"
                                                : donation.name}

                                        </h3>

                                        <p className="text-gray-500">

                                            {donation.email || "Member"}

                                        </p>

                                    </div>

                                </div>

                                <FaCheckCircle className="text-green-600 text-2xl" />

                            </div>

                            {/* Amount */}

                            <div className="mt-8 flex justify-between items-center">

                                <div>

                                    <p className="text-gray-500">

                                        Donation Amount

                                    </p>

                                    <h2 className="text-4xl font-black text-green-700">

                                        ₦{Number(donation.amount).toLocaleString()}

                                    </h2>

                                </div>

                                <span className="bg-yellow-100 text-yellow-700 px-5 py-2 rounded-full font-semibold">

                                    {donation.currency || "NGN"}

                                </span>

                            </div>

                            {/* Purpose */}

                            <div className="mt-8">

                                <p className="text-gray-500 mb-2">

                                    Purpose

                                </p>

                                <div className="inline-block bg-green-50 text-green-700 px-4 py-2 rounded-full">

                                    {donation.purpose || "General Offering"}

                                </div>

                            </div>

                            {/* Message */}

                            {donation.message && (

                                <div className="mt-8 bg-slate-100 rounded-xl p-5">

                                    <p className="italic text-gray-700">

                                        "{donation.message}"

                                    </p>

                                </div>

                            )}

                            {/* Footer */}

                            <div className="flex justify-between items-center mt-10 pt-6 border-t">

                                <span className="text-gray-500">

                                    {donation.date || "Just Now"}

                                </span>

                                <span className="text-green-700 font-bold">

                                    Completed

                                </span>

                            </div>

                        </motion.div>

                    ))}

                </div>

            </div>

        </section>
    );
}