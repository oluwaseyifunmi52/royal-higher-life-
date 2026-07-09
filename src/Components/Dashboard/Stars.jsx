import StarsCard from "../Cards/StarsCard";

export default function Dashboard() {
    return (
        <div className="dashboard-grid">
            <StarsCard
                title="Customer Rating"
                rating={4.8}
                totalReviews={154}
            />
        </div>
    );
}