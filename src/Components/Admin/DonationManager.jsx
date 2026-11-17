import { useCallback, useEffect, useState } from "react";
import {
    createDonationCampaign,
    deactivateDonationCampaign,
    getDonationAudit,
    getDonationCampaigns,
    getDonations,
    resendDonationReceipt,
    updateDonationCampaign,
} from "../../services/adminService";
import {
    CURRENCY_OPTIONS,
    donationStatusLabel,
    formatCurrency,
    PROVIDER_LABELS,
} from "../../utils/currency";

const emptyCampaign = {
    title: "",
    slug: "",
    description: "",
    targetAmount: "",
    currency: "NGN",
    coverImage: "",
};

function unwrapList(response) {
    const payload = response.data?.data;
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.donations)) return payload.donations;
    return [];
}

function slugify(value) {
    return String(value)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export default function DonationManager() {
    const [donations, setDonations] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [audit, setAudit] = useState([]);
    const [filter, setFilter] = useState("");
    const [campaign, setCampaign] = useState(emptyCampaign);
    const [editingCampaignId, setEditingCampaignId] = useState("");
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [busy, setBusy] = useState(false);

    const refresh = useCallback(async () => {
        setBusy(true);
        try {
            const [donationResponse, campaignResponse, auditResponse] = await Promise.all([
                getDonations({ ...(filter ? { status: filter } : {}), limit: 200 }),
                getDonationCampaigns(),
                getDonationAudit(),
            ]);
            setDonations(unwrapList(donationResponse));
            setCampaigns(unwrapList(campaignResponse));
            setAudit(unwrapList(auditResponse));
            setError("");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Could not load donation records. Check administrator access and API connection."
            );
        } finally {
            setBusy(false);
        }
    }, [filter]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    async function submitCampaign(event) {
        event.preventDefault();
        setBusy(true);
        setError("");
        setNotice("");
        try {
            const payload = {
                ...campaign,
                targetAmount: Number(campaign.targetAmount),
                currency: campaign.currency,
            };
            if (editingCampaignId) await updateDonationCampaign(editingCampaignId, payload);
            else await createDonationCampaign(payload);
            setCampaign(emptyCampaign);
            setEditingCampaignId("");
            setNotice(editingCampaignId ? "Campaign updated." : "Campaign created.");
            await refresh();
        } catch (err) {
            setError(err.response?.data?.message || "Could not save the campaign.");
        } finally {
            setBusy(false);
        }
    }

    async function toggleCampaign(item) {
        if (
            item.isActive &&
            !window.confirm(
                "Deactivate this campaign? Existing donation records will be retained."
            )
        ) {
            return;
        }
        setError("");
        setNotice("");
        try {
            if (item.isActive) await deactivateDonationCampaign(item._id);
            else await updateDonationCampaign(item._id, { isActive: true });
            setNotice(item.isActive ? "Campaign deactivated." : "Campaign reactivated.");
            await refresh();
        } catch (err) {
            setError(err.response?.data?.message || "Could not update the campaign.");
        }
    }

    async function resendReceipt(item) {
        setError("");
        setNotice("");
        try {
            await resendDonationReceipt(item._id);
            setNotice(`Receipt queued for ${item.email || "the donor"}.`);
            await refresh();
        } catch (err) {
            setError(err.response?.data?.message || "Could not resend the receipt.");
        }
    }

    function exportCsv() {
        const headers = [
            "Reference",
            "Provider",
            "Donor",
            "Email",
            "Phone",
            "Amount",
            "Currency",
            "Status",
            "Verification source",
            "Purpose",
            "Campaign",
            "Created",
        ];
        const rows = donations.map((item) => [
            item.paymentReference,
            item.provider || "",
            item.isAnonymous ? "Anonymous" : item.donorName,
            item.email,
            item.phone,
            item.amount,
            item.currency,
            item.status,
            item.verificationSource || "",
            item.donationType,
            item.campaign?.title || "",
            item.createdAt,
        ]);
        const escape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
        const blob = new Blob(
            [[headers, ...rows].map((row) => row.map(escape).join(",")).join("\r\n")],
            { type: "text/csv;charset=utf-8" }
        );
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "royal-higherlife-donations.csv";
        link.click();
        URL.revokeObjectURL(url);
    }

    return (
        <section className="space-y-8">
            <div className="flex flex-wrap justify-between items-center gap-3">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">
                        Donations & campaigns
                    </h2>
                    <p className="text-slate-500">
                        Payments are reported as successful only after the provider verifies the
                        exact amount and currency.
                    </p>
                </div>
                <div className="flex gap-3">
                    <select
                        aria-label="Filter donation status"
                        value={filter}
                        onChange={(event) => setFilter(event.target.value)}
                        className="border rounded-lg px-3 py-2"
                    >
                        <option value="">All statuses</option>
                        <option value="pending">Pending</option>
                        <option value="successful">Verified successful</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                        <option value="completed">Legacy completed</option>
                    </select>
                    <button
                        onClick={exportCsv}
                        className="rounded-lg bg-slate-800 text-white px-4 py-2"
                    >
                        Export CSV
                    </button>
                </div>
            </div>

            {error && (
                <p role="alert" className="rounded-lg bg-red-50 text-red-700 p-3">
                    {error}
                </p>
            )}
            {notice && (
                <p role="status" className="rounded-lg bg-emerald-50 text-emerald-800 p-3">
                    {notice}
                </p>
            )}

            <div className="bg-white rounded-xl shadow overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                        <tr>
                            {[
                                "Reference",
                                "Donor",
                                "Amount",
                                "Purpose / Campaign",
                                "Provider / Status",
                                "Date",
                                "Receipt",
                            ].map((label) => (
                                <th key={label} className="p-3 text-left">
                                    {label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {donations.map((item) => (
                            <tr key={item._id || item.id} className="border-t">
                                <td className="p-3 font-mono">
                                    {item.paymentReference || "—"}
                                </td>
                                <td className="p-3">
                                    {item.isAnonymous ? "Anonymous" : item.donorName}
                                    <small className="block text-slate-500">
                                        {item.email}
                                    </small>
                                </td>
                                <td className="p-3">
                                    {formatCurrency(item.amount, item.currency)}{" "}
                                    {item.currency}
                                </td>
                                <td className="p-3">
                                    {item.donationType}
                                    {item.campaign?.title
                                        ? ` · ${item.campaign.title}`
                                        : ""}
                                </td>
                                <td className="p-3">
                                    <span className="block">
                                        {PROVIDER_LABELS[item.provider] ||
                                            item.provider ||
                                            "—"}
                                    </span>
                                    <small className="block text-slate-500">
                                        {item.status === "successful" && item.verifiedAt
                                            ? "Verified"
                                            : donationStatusLabel(
                                                  item.status,
                                                  item.verifiedAt
                                              )}
                                    </small>
                                </td>
                                <td className="p-3">
                                    {new Date(item.createdAt).toLocaleString()}
                                </td>
                                <td className="p-3">
                                    {["successful", "completed"].includes(item.status) &&
                                    item.email ? (
                                        <button
                                            type="button"
                                            onClick={() => resendReceipt(item)}
                                            className="text-blue-700 underline"
                                        >
                                            Resend
                                        </button>
                                    ) : (
                                        <span className="text-slate-400">—</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {!busy && donations.length === 0 && (
                            <tr>
                                <td className="p-5 text-center text-slate-500" colSpan="7">
                                    No donation records match this filter.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <form
                    onSubmit={submitCampaign}
                    className="bg-white rounded-xl shadow p-5 space-y-3"
                >
                    <h3 className="text-xl font-semibold">
                        {editingCampaignId ? "Edit campaign" : "Create a campaign"}
                    </h3>
                    <input
                        required
                        maxLength="120"
                        placeholder="Campaign title"
                        value={campaign.title}
                        onChange={(event) => {
                            const title = event.target.value;
                            setCampaign((current) => ({
                                ...current,
                                title,
                                slug:
                                    editingCampaignId || current.slug
                                        ? current.slug
                                        : slugify(title),
                            }));
                        }}
                        className="w-full border rounded-lg p-3"
                    />
                    <input
                        required
                        pattern="[a-z0-9-]+"
                        placeholder="url-slug"
                        value={campaign.slug}
                        onChange={(event) =>
                            setCampaign({
                                ...campaign,
                                slug: event.target.value.toLowerCase(),
                            })
                        }
                        className="w-full border rounded-lg p-3"
                    />
                    <textarea
                        required
                        maxLength="4000"
                        placeholder="Description"
                        value={campaign.description}
                        onChange={(event) =>
                            setCampaign({ ...campaign, description: event.target.value })
                        }
                        className="w-full border rounded-lg p-3"
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <select
                            aria-label="Campaign currency"
                            value={campaign.currency}
                            onChange={(event) =>
                                setCampaign({ ...campaign, currency: event.target.value })
                            }
                            className="w-full border rounded-lg p-3"
                        >
                            {CURRENCY_OPTIONS.map((currency) => (
                                <option key={currency.code} value={currency.code}>
                                    {currency.code} — {currency.name}
                                </option>
                            ))}
                        </select>
                        <input
                            required
                            type="number"
                            min="1"
                            step="0.01"
                            placeholder={`Target amount (${campaign.currency})`}
                            value={campaign.targetAmount}
                            onChange={(event) =>
                                setCampaign({
                                    ...campaign,
                                    targetAmount: event.target.value,
                                })
                            }
                            className="w-full border rounded-lg p-3"
                        />
                    </div>
                    <input
                        type="url"
                        placeholder="Cover image URL (optional)"
                        value={campaign.coverImage}
                        onChange={(event) =>
                            setCampaign({ ...campaign, coverImage: event.target.value })
                        }
                        className="w-full border rounded-lg p-3"
                    />
                    <div className="flex gap-3">
                        <button
                            disabled={busy}
                            className="rounded-lg bg-amber-500 px-4 py-2 font-semibold"
                        >
                            {editingCampaignId ? "Save campaign" : "Create campaign"}
                        </button>
                        {editingCampaignId && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingCampaignId("");
                                    setCampaign(emptyCampaign);
                                }}
                                className="border rounded-lg px-4 py-2"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>

                <div className="bg-white rounded-xl shadow p-5">
                    <h3 className="text-xl font-semibold mb-4">Campaigns</h3>
                    {campaigns.length ? (
                        campaigns.map((item) => {
                            const otherCurrencies = Object.entries(
                                item.raisedByCurrency || {}
                            ).filter(([code]) => code !== item.currency);
                            return (
                                <div
                                    key={item._id}
                                    className="border-b py-3 flex justify-between gap-3"
                                >
                                    <div>
                                        <strong>{item.title}</strong>
                                        <p className="text-sm text-slate-500">
                                            {formatCurrency(
                                                item.raisedAmount || 0,
                                                item.currency
                                            )}{" "}
                                            of{" "}
                                            {formatCurrency(item.targetAmount, item.currency)}{" "}
                                            {item.currency} · {item.progressPercent || 0}% ·{" "}
                                            {item.isActive ? "Active" : "Inactive"}
                                        </p>
                                        {otherCurrencies.length > 0 && (
                                            <p className="text-xs text-slate-500">
                                                Other currencies recorded separately:{" "}
                                                {otherCurrencies
                                                    .map(
                                                        ([code, amount]) =>
                                                            `${formatCurrency(
                                                                amount,
                                                                code
                                                            )} ${code}`
                                                    )
                                                    .join(" · ")}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => {
                                                setEditingCampaignId(item._id);
                                                setCampaign({
                                                    title: item.title,
                                                    slug: item.slug,
                                                    description: item.description,
                                                    targetAmount: String(item.targetAmount),
                                                    currency: item.currency,
                                                    coverImage: item.coverImage || "",
                                                });
                                            }}
                                            className="text-blue-700"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => toggleCampaign(item)}
                                            className={
                                                item.isActive
                                                    ? "text-red-600"
                                                    : "text-green-700"
                                            }
                                        >
                                            {item.isActive ? "Deactivate" : "Reactivate"}
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-slate-500">No campaigns.</p>
                    )}
                </div>
            </div>

            <section className="bg-white rounded-xl shadow p-5">
                <h3 className="text-xl font-semibold mb-3">Donation audit log</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b text-left">
                                <th className="p-3">Action</th>
                                <th>Reference</th>
                                <th>Campaign</th>
                                <th>Administrator</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {audit.map((entry) => (
                                <tr className="border-b" key={entry._id}>
                                    <td className="p-3">{entry.action}</td>
                                    <td className="font-mono">
                                        {entry.donation?.paymentReference || "—"}
                                    </td>
                                    <td>{entry.campaign?.title || "—"}</td>
                                    <td>
                                        {entry.actor
                                            ? `${entry.actor.firstName} ${entry.actor.lastName}`
                                            : "System"}
                                    </td>
                                    <td>{new Date(entry.createdAt).toLocaleString()}</td>
                                </tr>
                            ))}
                            {!audit.length && (
                                <tr>
                                    <td className="p-3 text-slate-500" colSpan="5">
                                        No audit events recorded.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </section>
    );
}
