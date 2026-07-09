import { motion } from "framer-motion";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from "recharts";

import {
    HeartHandshake,
    TrendingUp,
} from "lucide-react";

const donationData = [
    {
        month: "Jan",
        donations: 850000,
        donors: 35,
    },
    {
        month: "Feb",
        donations: 1200000,
        donors: 52,
    },
    {
        month: "Mar",
        donations: 1500000,
        donors: 63,
    },
    {
        month: "Apr",
        donations: 1350000,
        donors: 58,
    },
    {
        month: "May",
        donations: 1800000,
        donors: 71,
    },
    {
        month: "Jun",
        donations: 2250000,
        donors: 82,
    },
    {
        month: "Jul",
        donations: 2600000,
        donors: 95,
    },
    {
        month: "Aug",
        donations: 3100000,
        donors: 108,
    },
    {
        month: "Sep",
        donations: 2850000,
        donors: 103,
    },
    {
        month: "Oct",
        donations: 3400000,
        donors: 120,
    },
    {
        month: "Nov",
        donations: 3900000,
        donors: 136,
    },
    {
        month: "Dec",
        donations: 4500000,
        donors: 150,
    },
];

const totalDonations = donationData.reduce(
    (sum, item) => sum + item.donations,
    0
);

const totalDonors = donationData.reduce(
    (sum, item) => sum + item.donors,
    0
);

export default function DonationChart() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-gray-200 shadow-lg p-6"
        >
            {/* Header */}

            <div className="flex justify-between items-center mb-8">

                <div>

                    <div className="flex items-center gap-3">

                        <HeartHandshake
                            className="text-green-700"
                            size={28}
                        />

                        <h2 className="text-2xl font-bold text-gray-800">
                            Donation Analytics
                        </h2>

                    </div>

                    <p className="text-gray-500 mt-2">
                        Monthly giving overview
                    </p>

                </div>

                <div className="bg-green-100 px-4 py-2 rounded-xl flex items-center gap-2">

                    <TrendingUp
                        className="text-green-700"
                        size={18}
                    />

                    <span className="text-green-700 font-semibold">
                        +22.8%
                    </span>

                </div>

            </div>

            {/* Summary Cards */}

            <div className="grid md:grid-cols-2 gap-5 mb-8">

                <div className="bg-green-50 rounded-2xl p-5">

                    <p className="text-gray-500">
                        Total Donations
                    </p>

                    <h3 className="text-3xl font-bold text-green-700 mt-2">
                        ₦{totalDonations.toLocaleString()}
                    </h3>

                </div>

                <div className="bg-blue-50 rounded-2xl p-5">

                    <p className="text-gray-500">
                        Total Donors
                    </p>

                    <h3 className="text-3xl font-bold text-blue-700 mt-2">
                        {totalDonors}
                    </h3>

                </div>

            </div>

            {/* Chart */}

            <ResponsiveContainer
                width="100%"
                height={360}
            >

                <BarChart
                    data={donationData}
                >

                    <CartesianGrid
                        strokeDasharray="3 3"
                    />

                    <XAxis
                        dataKey="month"
                    />

                    <YAxis
                        tickFormatter={(value) =>
                            `₦${value / 1000000}M`
                        }
                    />

                    <Tooltip
                        formatter={(value) =>
                            [`₦${value.toLocaleString()}`, "Donations"]
                        }
                    />

                    <Legend />

                    <Bar
                        dataKey="donations"
                        fill="#15803d"
                        radius={[10, 10, 0, 0]}
                        name="Monthly Donations"
                    />

                </BarChart>

            </ResponsiveContainer>

            {/* Footer */}

            <div className="mt-8 border-t pt-5 flex justify-between flex-wrap gap-4">

                <div>

                    <p className="text-sm text-gray-500">
                        Average Monthly Giving
                    </p>

                    <h4 className="font-bold text-xl text-gray-800">
                        ₦
                        {Math.round(
                            totalDonations / donationData.length
                        ).toLocaleString()}
                    </h4>

                </div>

                <button className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl transition">

                    View Donation Report

                </button>

            </div>

        </motion.div>
    );
}