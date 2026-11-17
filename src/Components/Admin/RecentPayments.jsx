import { motion } from "framer-motion";
import { CreditCard, Download, Landmark, RefreshCw, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getDonations } from "../../services/adminService";
import {
    donationStatusLabel,
    formatCurrency,
    PROVIDER_LABELS,
} from "../../utils/currency";

export default function RecentPayments() {
    const [search, setSearch] = useState("");
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadPayments = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const response = await getDonations({ limit: 25 });
            const payload = response.data?.data;
            setPayments(Array.isArray(payload?.donations) ? payload.donations : []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Recent payments are unavailable until the admin API connects."
            );
            setPayments([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadPayments();
    }, [loadPayments]);

    const filteredPayments = payments.filter((payment) =>
        `${payment.donorName || ""} ${payment.email || ""} ${payment.paymentReference || ""}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    function paymentIcon(provider) {
        return provider === "paypal" ? (
            <Landmark size={18} className="text-blue-600" />
        ) : (
            <CreditCard size={18} className="text-green-600" />
        );
    }

    function exportCsv() {
        const headers = ["Reference", "Donor", "Email", "Amount", "Currency", "Provider", "Status", "Date"];
        const rows = filteredPayments.map((payment) => [
            payment.paymentReference,
            payment.isAnonymous ? "Anonymous" : payment.donorName,
            payment.email,
            payment.amount,
            payment.currency,
            payment.provider,
            payment.status,
            payment.createdAt,
        ]);
        const escape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
        const blob = new Blob(
            [[headers, ...rows].map((row) => row.map(escape).join(",")).join("\r\n")],
            { type: "text/csv;charset=utf-8" }
        );
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "royal-higherlife-recent-payments.csv";
        link.click();
        URL.revokeObjectURL(url);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-lg border border-gray-200"
        >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-6 border-b">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Recent Payments</h2>
                    <p className="text-gray-500">Latest verified and pending donation transactions</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search donor or reference..."
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-700 outline-none"
                        />
                    </div>
                    <button
                        onClick={loadPayments}
                        className="border px-4 rounded-xl flex items-center gap-2"
                    >
                        <RefreshCw size={18} />
                        Refresh
                    </button>
                    <button
                        onClick={exportCsv}
                        className="bg-green-700 hover:bg-green-800 text-white px-5 rounded-xl flex items-center gap-2"
                    >
                        <Download size={18} />
                        Export
                    </button>
                </div>
            </div>

            {error && (
                <p role="alert" className="m-6 rounded-lg bg-red-50 p-3 text-red-700">
                    {error}
                </p>
            )}

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left p-4">Transaction</th>
                            <th className="text-left">Donor</th>
                            <th className="text-left">Amount</th>
                            <th className="text-left">Provider</th>
                            <th className="text-left">Date</th>
                            <th className="text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPayments.map((payment) => (
                            <tr
                                key={payment._id || payment.id}
                                className="border-t hover:bg-green-50 transition"
                            >
                                <td className="p-4 font-semibold font-mono text-sm">
                                    {payment.paymentReference || "—"}
                                </td>
                                <td>
                                    {payment.isAnonymous ? "Anonymous" : payment.donorName}
                                    <small className="block text-gray-500">{payment.email}</small>
                                </td>
                                <td className="font-bold text-green-700">
                                    {formatCurrency(payment.amount, payment.currency)}{" "}
                                    {payment.currency}
                                </td>
                                <td>
                                    <div className="flex items-center gap-2">
                                        {paymentIcon(payment.provider)}
                                        {PROVIDER_LABELS[payment.provider] ||
                                            payment.provider ||
                                            "—"}
                                    </div>
                                </td>
                                <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                            payment.status === "successful" &&
                                            payment.verifiedAt
                                                ? "bg-green-100 text-green-700"
                                                : payment.status === "failed"
                                                  ? "bg-red-100 text-red-700"
                                                  : "bg-yellow-100 text-yellow-700"
                                        }`}
                                    >
                                        {donationStatusLabel(
                                            payment.status,
                                            payment.verifiedAt
                                        )}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {!loading && filteredPayments.length === 0 && (
                            <tr>
                                <td className="p-6 text-center text-gray-500" colSpan="6">
                                    No donation payments found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center flex-wrap gap-4 p-6 border-t">
                <p className="text-gray-500">
                    Showing {filteredPayments.length} of {payments.length} recent payments
                </p>
                {loading && <p className="text-gray-500">Loading payments…</p>}
            </div>
        </motion.div>
    );
}
