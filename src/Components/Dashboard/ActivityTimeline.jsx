import { Heart, Clock3 } from "lucide-react";
import { formatCurrency } from "../../utils/currency";

export default function ActivityTimeline({ donations = [] }) {
  return <section className="member-panel">
    <div className="member-panel-heading"><div><h2>Recent activities</h2><p>Recent activity on your account</p></div><Clock3 size={19} className="member-gold-icon" /></div>
    {donations.length ? <div className="member-activity-list">{donations.slice(0, 5).map((item) => <article className="member-activity-row" key={item._id || item.id}><span className="member-activity-icon"><Heart size={19} /></span><div className="member-activity-copy"><strong>Donation confirmed</strong><p>{formatCurrency(item.amount, item.currency)} {item.currency} {item.donationType ? `for ${item.donationType}` : "donation"}</p></div><time>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}</time></article>)}</div> : <div className="member-inline-empty"><span className="member-empty-icon"><Heart size={21} /></span><div><strong>No recent activity</strong><p>Confirmed donations made while signed in will appear here.</p></div></div>}
  </section>;
}
