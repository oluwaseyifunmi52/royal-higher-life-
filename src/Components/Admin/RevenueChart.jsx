import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";

import { DollarSign, TrendingUp } from "lucide-react";

const revenueData = [
    { month: "Jan", revenue: 1200000 },
    { month: "Feb", revenue: 1450000 },
    { month: "Mar", revenue: 1800000 },
    { month: "Apr", revenue: 1650000 },
    { month: "May", revenue: 2200000 },
    { month: "Jun", revenue: 2450000 },
    { month: "Jul", revenue: 2800000 },
    { month: "Aug", revenue: 3100000 },
    { month: "Sep", revenue: 3400000 },
    { month: "Oct", revenue: 3700000 },
    { month: "Nov", revenue: 4200000 },
    { month: "Dec", revenue: 4800000 },
];

const formatCurrency = (value) => {
    return `₦${(value / 1000000).toFixed(1)}M`;
};

export default function RevenueChart() {
    const totalRevenue = revenueData.reduce(
        (sum, item) => sum + item.revenue,
        0
    );

    return (
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">

            {/* Header */}

            <div className="flex items-center justify-between mb-8">

                <div>

                    <h2 className="text-2xl font-bold text-gray-800">
                        Revenue Overview
                    </h2>

                    <p className="text-gray-500 mt-1">
                        Monthly church income
                    </p>

                </div>

                <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-xl">

                    <TrendingUp size={18} />

                    <span className="font-semibold">
                        +18.5%
                    </span>

                </div>

            </div>

            {/* Summary */}

            <div className="grid grid-cols-2 gap-6 mb-8">

                <div className="bg-gray-50 rounded-2xl p-5">

                    <p className="text-gray-500 text-sm">
                        Total Revenue
                    </p>

                    <h3 className="text-3xl font-bold text-gray-800 mt-2">
                        ₦{totalRevenue.toLocaleString()}
                    </h3>

                </div>

                <div className="bg-green-50 rounded-2xl p-5">

                    <div className="flex items-center gap-2 mb-2">

                        <DollarSign
                            className="text-green-700"
                            size={20}
                        />

                        <span className="font-semibold text-green-700">
                            This Month
                        </span>

                    </div>

                    <h3 className="text-3xl font-bold text-green-700">
                        ₦4.8M
                    </h3>

                </div>

            </div>

            {/* Chart */}

            <ResponsiveContainer
                width="100%"
                height={350}
            >
                <AreaChart data={revenueData}>

                    <defs>

                        <linearGradient
                            id="revenueColor"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >

                            <stop
                                offset="5%"
                                stopColor="#16a34a"
                                stopOpacity={0.45}
                            />

                            <stop
                                offset="95%"
                                stopColor="#16a34a"
                                stopOpacity={0}
                            />

                        </linearGradient>

                    </defs>

                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e5e7eb"
                    />

                    <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12 }}
                    />

                    <YAxis
                        tickFormatter={formatCurrency}
                        tick={{ fontSize: 12 }}
                    />

                    <Tooltip
                        formatter={(value) => [
                            `₦${value.toLocaleString()}`,
                            "Revenue",
                        ]}
                    />

                    <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#15803d"
                        strokeWidth={3}
                        fill="url(#revenueColor)"
                    />

                </AreaChart>
            </ResponsiveContainer>

        </div>
    );
}