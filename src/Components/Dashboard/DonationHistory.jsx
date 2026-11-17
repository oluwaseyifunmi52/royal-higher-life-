import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { donationStatusLabel, formatCurrency } from "../../utils/currency";

export default function DonationHistory({ donations = [], loading = false, error = "", search = "" }) {
    const visibleDonations = donations.filter((item) => `${item.paymentReference || ""} ${item.donationType || ""} ${item.campaign?.title || ""}`.toLowerCase().includes(search.toLowerCase()));

    return (
        <section className="member-panel">
            <div className="member-panel-heading"><div><h2>My donation history</h2><p>Your recent giving</p></div><Link to="/donate">View all <span aria-hidden="true">→</span></Link></div>
            {loading ? (
                <p className="member-muted">Loading your records…</p>
            ) : error ? (
                <p role="status" className="member-muted">{error}</p>
            ) : visibleDonations.length ? (
                <div className="member-table-wrap"><table className="member-table"><thead><tr><th>Reference</th><th>Purpose</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead><tbody>{visibleDonations.slice(0, 5).map((item) => <tr key={item._id || item.id}><td className="member-reference">{item.paymentReference || "—"}</td><td>{item.donationType || "Donation"}{item.campaign?.title && <small>{item.campaign.title}</small>}</td><td>{formatCurrency(item.amount, item.currency)} {item.currency}</td><td><span className="member-status-pill">{donationStatusLabel(item.status, item.verifiedAt)}</span></td><td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}</td></tr>)}</tbody></table></div>
            ) : (
                <div className="member-empty-state"><span className="member-empty-icon"><Heart size={24} /></span><div><strong>{search ? "No matching donations" : "No donations yet"}</strong><p>{search ? "Try another search." : "Donations made while signed in will appear here. You can also give as a guest on the donation page."}</p></div>{!search && <Link to="/donate" className="member-gold-button">Give now</Link>}</div>
            )}
        </section>
    );
}
