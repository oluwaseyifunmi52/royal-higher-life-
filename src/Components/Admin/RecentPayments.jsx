import { motion } from "framer-motion";
import {
    Search,
    Download,
    CreditCard,
    Landmark,
    Smartphone,
    MoreVertical,
} from "lucide-react";
import { useState } from "react";

const payments = [
    {
        id: "TXN-1001",
        donor: "Grace Adebayo",
        amount: 50000,
        method: "Paystack",
        status: "Successful",
        date: "12 Jul 2026",
    },
    {
        id: "TXN-1002",
        donor: "Michael Johnson",
        amount: 150000,
        method: "Flutterwave",
        status: "Successful",
        date: "11 Jul 2026",
    },
    {
        id: "TXN-1003",
        donor: "Sarah Williams",
        amount: 30000,
        method: "Bank Transfer",
        status: "Pending",
        date: "11 Jul 2026",
    },
    {
        id: "TXN-1004",
        donor: "John David",
        amount: 75000,
        method: "Card",
        status: "Failed",
        date: "10 Jul 2026",
    },
    {
        id: "TXN-1005",
        donor: "Elizabeth Smith",
        amount: 100000,
        method: "USSD",
        status: "Successful",
        date: "10 Jul 2026",
    },
];

export default function RecentPayments() {
    const [search, setSearch] = useState("");

    const filteredPayments = payments.filter((payment) =>
        payment.donor.toLowerCase().includes(search.toLowerCase())
    );

    function paymentIcon(method) {
        switch (method) {
            case "Bank Transfer":
                return <Landmark size={18} className="text-blue-600" />;
            case "USSD":
                return <Smartphone size={18} className="text-purple-600" />;
            default:
                return <CreditCard size={18} className="text-green-600" />;
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-lg border border-gray-200"
        >
            {/* Header */}

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-6 border-b">

                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Recent Payments
                    </h2>

                    <p className="text-gray-500">
                        Latest donation transactions
                    </p>
                </div>

                <div className="flex gap-3">

                    <div className="relative">

                        <Search
                            size={18}
                            className="absolute left-3 top-3 text-gray-400"
                        />

                        <input
                            type="text"
                            placeholder="Search donor..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-700 outline-none"
                        />

                    </div>

                    <button className="bg-green-700 hover:bg-green-800 text-white px-5 rounded-xl flex items-center gap-2">

                        <Download size={18} />

                        Export

                    </button>

                </div>

            </div>

            {/* Table */}

            <div className="overflow-x-auto">

                <table className="w-full">

                    <thead className="bg-gray-50">

                        <tr>

                            <th className="text-left p-4">Transaction</th>
                            <th className="text-left">Donor</th>
                            <th className="text-left">Amount</th>
                            <th className="text-left">Method</th>
                            <th className="text-left">Date</th>
                            <th className="text-left">Status</th>
                            <th className="text-left">Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {filteredPayments.map((payment) => (

                            <tr
                                key={payment.id}
                                className="border-t hover:bg-green-50 transition"
                            >

                                <td className="p-4 font-semibold">
                                    {payment.id}
                                </td>

                                <td>
                                    {payment.donor}
                                </td>

                                <td className="font-bold text-green-700">
                                    ₦{payment.amount.toLocaleString()}
                                </td>

                                <td>

                                    <div className="flex items-center gap-2">

                                        {paymentIcon(payment.method)}

                                        {payment.method}

                                    </div>

                                </td>

                                <td>
                                    {payment.date}
                                </td>

                                <td>

                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-semibold
                    ${payment.status === "Successful"
                                                ? "bg-green-100 text-green-700"
                                                : payment.status === "Pending"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {payment.status}
                                    </span>

                                </td>

                                <td>

                                    <button className="hover:bg-gray-100 p-2 rounded-lg">

                                        <MoreVertical size={20} />

                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

            {/* Footer */}

            <div className="flex justify-between items-center flex-wrap gap-4 p-6 border-t">

                <p className="text-gray-500">
                    Showing {filteredPayments.length} of {payments.length} payments
                </p>

                <div className="flex gap-2">

                    <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">
                        Previous
                    </button>

                    <button className="px-4 py-2 bg-green-700 text-white rounded-lg">
                        1
                    </button>

                    <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">
                        2
                    </button>

                    <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">
                        Next
                    </button>

                </div>

            </div>

        </motion.div>
    );
}