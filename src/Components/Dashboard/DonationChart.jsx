import {
    LineChart,
    Line,
    XAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const data = [
    { month: "Jan", amount: 120000 },
    { month: "Feb", amount: 220000 },
    { month: "Mar", amount: 180000 },
    { month: "Apr", amount: 310000 },
    { month: "May", amount: 270000 },
    { month: "Jun", amount: 410000 },
];

export default function DonationChart() {
    return (
        <div className="bg-white rounded-2xl shadow p-6 h-[400px]">

            <h3 className="font-bold text-xl mb-5">
                Donation Analytics
            </h3>

            <ResponsiveContainer width="100%" height="90%">

                <LineChart data={data}>

                    <XAxis dataKey="month" />

                    <Tooltip />

                    <Line
                        dataKey="amount"
                        stroke="#15803d"
                        strokeWidth={4}
                    />

                </LineChart>

            </ResponsiveContainer>

        </div>
    );
}