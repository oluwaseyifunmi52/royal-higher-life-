import { useEffect, useState } from "react";
import { CalendarDays, HeartHandshake, MessageSquare, Users, BookOpen, Images, Video, HandHeart, Mail, Building2, Star, CreditCard } from "lucide-react";
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
            label: "Website users",
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
        { label: "Published sermons", value: stats ? Number(stats.publishedSermons || 0).toLocaleString() : "—", Icon: BookOpen },
        { label: "Upcoming events", value: stats ? Number(stats.upcomingEvents || 0).toLocaleString() : "—", Icon: CalendarDays },
        { label: "Published testimonies", value: stats ? Number(stats.publishedTestimonials || 0).toLocaleString() : "—", Icon: Star },
        { label: "Gallery pictures", value: stats ? Number(stats.galleryImages || 0).toLocaleString() : "—", Icon: Images },
        { label: "Gallery videos", value: stats ? Number(stats.galleryVideos || 0).toLocaleString() : "—", Icon: Video },
        { label: "Volunteer applications", value: stats ? Number(stats.volunteerApplications || 0).toLocaleString() : "—", Icon: HandHeart },
        { label: "Prayer requests", value: stats ? Number(stats.prayerRequests || 0).toLocaleString() : "—", Icon: HeartHandshake },
        { label: "Partnership enquiries", value: stats ? Number(stats.partnershipApplications || 0).toLocaleString() : "—", Icon: Building2 },
        { label: "Newsletter subscribers", value: stats ? Number(stats.newsletterSubscribers || 0).toLocaleString() : "—", Icon: Mail },
        { label: "Pending payments", value: stats ? Number(stats.pendingDonations || 0).toLocaleString() : "—", Icon: CreditCard },
        { label: "Failed payments", value: stats ? Number(stats.failedDonations || 0).toLocaleString() : "—", Icon: CreditCard },
    ];

    return (
        <section aria-label="Ministry dashboard statistics">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
