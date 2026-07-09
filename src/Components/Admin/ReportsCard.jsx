import { motion } from "framer-motion";
import {
    FileText,
    Download,
    FileSpreadsheet,
    FileBarChart,
    Calendar,
    TrendingUp,
} from "lucide-react";

const reports = [
    {
        id: 1,
        title: "Donation Report",
        description: "Complete donation summary for this month.",
        type: "PDF",
        date: "July 2026",
        icon: FileText,
        color: "bg-red-100 text-red-600",
    },
    {
        id: 2,
        title: "Financial Statement",
        description: "Income and expenditure report.",
        type: "Excel",
        date: "July 2026",
        icon: FileSpreadsheet,
        color: "bg-green-100 text-green-700",
    },
    {
        id: 3,
        title: "Attendance Report",
        description: "Church attendance statistics.",
        type: "CSV",
        date: "July 2026",
        icon: FileBarChart,
        color: "bg-blue-100 text-blue-700",
    },
];

export default function ReportsCard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-lg border border-gray-200"
        >
            {/* Header */}

            <div className="flex justify-between items-center p-6 border-b">

                <div>

                    <h2 className="text-2xl font-bold text-gray-800">
                        Reports Center
                    </h2>

                    <p className="text-gray-500 mt-1">
                        Generate and download church reports.
                    </p>

                </div>

                <button className="bg-green-700 hover:bg-green-800 text-white px-5 py-3 rounded-xl flex items-center gap-2 transition">

                    <Download size={18} />

                    Export All

                </button>

            </div>

            {/* Statistics */}

            <div className="grid md:grid-cols-3 gap-5 p-6">

                <div className="bg-green-50 rounded-2xl p-5">

                    <TrendingUp
                        size={30}
                        className="text-green-700 mb-3"
                    />

                    <h3 className="text-3xl font-bold text-green-700">
                        24
                    </h3>

                    <p className="text-gray-500">
                        Reports Generated
                    </p>

                </div>

                <div className="bg-blue-50 rounded-2xl p-5">

                    <FileText
                        size={30}
                        className="text-blue-700 mb-3"
                    />

                    <h3 className="text-3xl font-bold text-blue-700">
                        156
                    </h3>

                    <p className="text-gray-500">
                        Downloads
                    </p>

                </div>

                <div className="bg-yellow-50 rounded-2xl p-5">

                    <Calendar
                        size={30}
                        className="text-yellow-600 mb-3"
                    />

                    <h3 className="text-3xl font-bold text-yellow-600">
                        Monthly
                    </h3>

                    <p className="text-gray-500">
                        Auto Reports
                    </p>

                </div>

            </div>

            {/* Reports */}

            <div className="space-y-4 px-6 pb-6">

                {reports.map((report) => {

                    const Icon = report.icon;

                    return (

                        <motion.div
                            key={report.id}
                            whileHover={{ scale: 1.02 }}
                            className="flex justify-between items-center border rounded-2xl p-5 hover:shadow-md transition"
                        >

                            <div className="flex items-center gap-5">

                                <div
                                    className={`w-14 h-14 rounded-xl flex items-center justify-center ${report.color}`}
                                >

                                    <Icon size={28} />

                                </div>

                                <div>

                                    <h3 className="font-bold text-lg text-gray-800">
                                        {report.title}
                                    </h3>

                                    <p className="text-gray-500">
                                        {report.description}
                                    </p>

                                    <div className="flex gap-4 mt-2 text-sm text-gray-500">

                                        <span>
                                            {report.type}
                                        </span>

                                        <span>
                                            {report.date}
                                        </span>

                                    </div>

                                </div>

                            </div>

                            <button className="bg-green-700 hover:bg-green-800 text-white px-5 py-3 rounded-xl flex items-center gap-2 transition">

                                <Download size={18} />

                                Download

                            </button>

                        </motion.div>

                    );

                })}

            </div>

            {/* Footer */}

            <div className="border-t p-6 flex justify-between items-center flex-wrap gap-4">

                <div>

                    <h3 className="font-bold text-lg">
                        Report Summary
                    </h3>

                    <p className="text-gray-500">
                        Financial, donation, attendance and ministry reports.
                    </p>

                </div>

                <button className="bg-gray-100 hover:bg-gray-200 px-6 py-3 rounded-xl transition">

                    View History

                </button>

            </div>

        </motion.div>
    );
}