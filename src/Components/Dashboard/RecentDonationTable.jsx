import {
    CheckCircle,
    Clock,
    CreditCard,
    Landmark,
    Smartphone,
} from "lucide-react";

const donations = [
    {
        id: 1,
        donor: "Grace A.",
        email: "grace@gmail.com",
        amount: 50000,
        purpose: "Church Planting",
        method: "Paystack",
        status: "Completed",
        date: "Today",
    },
    {
        id: 2,
        donor: "Emeka O.",
        email: "emeka@gmail.com",
        amount: 25000,
        purpose: "Youth Ministry",
        method: "Bank Transfer",
        status: "Completed",
        date: "Yesterday",
    },
    {
        id: 3,
        donor: "Anonymous",
        email: "Hidden",
        amount: 100000,
        purpose: "Building Project",
        method: "Flutterwave",
        status: "Pending",
        date: "2 Days Ago",
    },
    {
        id: 4,
        donor: "Sarah John",
        email: "sarah@gmail.com",
        amount: 15000,
        purpose: "Medical Outreach",
        method: "Card",
        status: "Completed",
        date: "3 Days Ago",
    },
    {
        id: 5,
        donor: "David Michael",
        email: "david@gmail.com",
        amount: 70000,
        purpose: "Mission Outreach",
        method: "USSD",
        status: "Completed",
        date: "Last Week",
    },
];

function paymentIcon(method) {
    switch (method) {
        case "Bank Transfer":
            return <Landmark size={16} />;
        case "USSD":
            return <Smartphone size={16} />;
        default:
            return <CreditCard size={16} />;
    }
}

export default function RecentDonationsTable() {
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Recent Donations
                    </h2>

                    <p className="text-gray-500 mt-1">
                        Latest donations received
                    </p>
                </div>

                <button className="px-5 py-2 bg-green-700 text-white rounded-xl hover:bg-green-800 transition">
                    View All
                </button>
            </div>

            <div className="overflow-x-auto">

                <table className="w-full">

                    <thead>

                        <tr className="border-b">

                            <th className="text-left py-4">Donor</th>

                            <th className="text-left">Purpose</th>

                            <th className="text-left">Method</th>

                            <th className="text-left">Amount</th>

                            <th className="text-left">Status</th>

                            <th className="text-left">Date</th>

                        </tr>

                    </thead>

                    <tbody>

                        {donations.map((donation) => (

                            <tr
                                key={donation.id}
                                className="border-b hover:bg-gray-50 transition"
                            >

                                <td className="py-5">

                                    <div className="flex items-center gap-4">

                                        <div className="w-12 h-12 rounded-full bg-green-700 text-white flex items-center justify-center font-bold">

                                            {donation.donor.charAt(0)}

                                        </div>

                                        <div>

                                            <h4 className="font-semibold">

                                                {donation.donor}

                                            </h4>

                                            <p className="text-sm text-gray-500">

                                                {donation.email}

                                            </p>

                                        </div>

                                    </div>

                                </td>

                                <td>

                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">

                                        {donation.purpose}

                                    </span>

                                </td>

                                <td>

                                    <div className="flex items-center gap-2">

                                        {paymentIcon(donation.method)}

                                        {donation.method}

                                    </div>

                                </td>

                                <td className="font-bold text-green-700">

                                    ₦{donation.amount.toLocaleString()}

                                </td>

                                <td>

                                    {donation.status === "Completed" ? (

                                        <span className="flex items-center gap-2 text-green-700">

                                            <CheckCircle size={18} />

                                            Completed

                                        </span>

                                    ) : (

                                        <span className="flex items-center gap-2 text-orange-600">

                                            <Clock size={18} />

                                            Pending

                                        </span>

                                    )}

                                </td>

                                <td className="text-gray-500">

                                    {donation.date}

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}