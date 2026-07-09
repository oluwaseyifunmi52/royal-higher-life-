import { motion } from "framer-motion";
import {
    Crown,
    Medal,
    Award,
    TrendingUp,
    HeartHandshake,
} from "lucide-react";

const donors = [
    {
        id: 1,
        name: "Grace Adebayo",
        avatar: "https://i.pravatar.cc/150?img=32",
        donations: 1250000,
        gifts: 18,
    },
    {
        id: 2,
        name: "Michael Johnson",
        avatar: "https://i.pravatar.cc/150?img=12",
        donations: 980000,
        gifts: 15,
    },
    {
        id: 3,
        name: "Sarah Williams",
        avatar: "https://i.pravatar.cc/150?img=48",
        donations: 820000,
        gifts: 12,
    },
    {
        id: 4,
        name: "John David",
        avatar: "https://i.pravatar.cc/150?img=51",
        donations: 650000,
        gifts: 10,
    },
    {
        id: 5,
        name: "Elizabeth Smith",
        avatar: "https://i.pravatar.cc/150?img=41",
        donations: 510000,
        gifts: 8,
    },
];

const highestDonation = Math.max(
    ...donors.map((donor) => donor.donations)
);

function rankIcon(index) {
    switch (index) {
        case 0:
            return <Crown className="text-yellow-500" size={22} />;
        case 1:
            return <Medal className="text-gray-500" size={22} />;
        case 2:
            return <Award className="text-amber-700" size={22} />;
        default:
            return (
                <span className="font-bold text-gray-600">
                    #{index + 1}
                </span>
            );
    }
}

export default function TopDonors() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6"
        >
            {/* Header */}

            <div className="flex justify-between items-center mb-8">

                <div>

                    <h2 className="text-2xl font-bold text-gray-800">
                        Top Donors
                    </h2>

                    <p className="text-gray-500 mt-1">
                        Highest ministry contributors
                    </p>

                </div>

                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl flex items-center gap-2">

                    <TrendingUp size={18} />

                    <span className="font-semibold">
                        This Year
                    </span>

                </div>

            </div>

            {/* Donor List */}

            <div className="space-y-5">

                {donors.map((donor, index) => {

                    const progress =
                        (donor.donations / highestDonation) * 100;

                    return (

                        <motion.div
                            key={donor.id}
                            whileHover={{ scale: 1.02 }}
                            className="border rounded-2xl p-5 hover:shadow-md transition"
                        >

                            <div className="flex items-center justify-between">

                                <div className="flex items-center gap-4">

                                    <div className="w-10 flex justify-center">

                                        {rankIcon(index)}

                                    </div>

                                    <img
                                        src={donor.avatar}
                                        alt={donor.name}
                                        className="w-14 h-14 rounded-full border-2 border-green-200"
                                    />

                                    <div>

                                        <h3 className="font-bold text-lg text-gray-800">
                                            {donor.name}
                                        </h3>

                                        <p className="text-gray-500 text-sm flex items-center gap-2">

                                            <HeartHandshake
                                                size={15}
                                                className="text-green-700"
                                            />

                                            {donor.gifts} Donations

                                        </p>

                                    </div>

                                </div>

                                <div className="text-right">

                                    <h3 className="text-xl font-bold text-green-700">

                                        ₦{donor.donations.toLocaleString()}

                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        Total Given
                                    </p>

                                </div>

                            </div>

                            {/* Progress */}

                            <div className="mt-5">

                                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">

                                    <div
                                        className="bg-green-700 h-3 rounded-full transition-all duration-700"
                                        style={{
                                            width: `${progress}%`,
                                        }}
                                    />

                                </div>

                            </div>

                        </motion.div>

                    );

                })}

            </div>

            {/* Footer */}

            <div className="border-t mt-8 pt-6 flex justify-between items-center">

                <div>

                    <p className="text-gray-500 text-sm">
                        Total Top Donors
                    </p>

                    <h3 className="font-bold text-2xl text-gray-800">
                        {donors.length}
                    </h3>

                </div>

                <button className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl transition">

                    View All Donors

                </button>

            </div>

        </motion.div>
    );
}