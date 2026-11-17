import { useEffect, useState } from "react";
import { CalendarDays, HeartHandshake, MessageSquare, Users } from "lucide-react";
import { getDashboardStats } from "../../services/adminService";
import { formatCurrency } from "../../utils/currency";

export default function DashboardStats() {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        getDashboardStats()
            .then((response) => setStats(response.data?.data?.stats || null))
            .catch(() =>
                setError(
                    "Donation and ministry totals are unavailable until the admin API connects."
                )
            );
    }, []);

    const monthlyByCurrency = stats?.monthlyRevenueByCurrency || [];
    const monthlyValue = monthlyByCurrency.length
        ? monthlyByCurrency
              .map(
                  (item) =>
                      `${formatCurrency(item.amount, item.currency)} ${item.currency}`
              )
              .join(" · ")
        : stats?.monthlyRevenue
          ? formatCurrency(stats.monthlyRevenue, "NGN")
          : "—";

    const cards = [
        {
            label: "Members",
            value: stats ? Number(stats.members ?? stats.users ?? 0).toLocaleString() : "—",
            Icon: Users,
        },
        {
            label: "Verified donations",
            value: stats ? Number(stats.donations || 0).toLocaleString() : "—",
            Icon: HeartHandshake,
        },
        {
            label: "Verified giving this month",
            value: stats ? monthlyValue : "—",
            Icon: CalendarDays,
        },
        {
            label: "Contact messages",
            value: stats ? Number(stats.contacts || 0).toLocaleString() : "—",
            Icon: MessageSquare,
        },
    ];

    return (
        <section aria-label="Ministry dashboard statistics">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map(({ label, value, Icon }) => (
                    <article
                        key={label}
                        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                            <Icon size={24} />
                        </div>
                        <h2 className="mt-5 text-sm font-medium text-gray-500">{label}</h2>
                        <p className="mt-2 text-2xl font-bold text-gray-800">{value}</p>
                    </article>
                ))}
            </div>
            {error && (
                <p role="status" className="mt-3 text-sm text-slate-500">
                    {error}
                </p>
            )}
        </section>
    );
}
