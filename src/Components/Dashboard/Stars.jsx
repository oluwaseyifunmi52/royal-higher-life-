

export default function StatsCards({
    title = "Average Rating",
    rating = 5,
    totalReviews = 0,
}) {
    return (
        <div className="dashboard-card stars-card">
            <div className="card-header">
                <h3>{title}</h3>
            </div>

            <div className="card-body">
                <div className="stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            className={
                                star <= Math.round(rating)
                                    ? "star active"
                                    : "star"
                            }
                        >
                            ★
                        </span>
                    ))}
                </div>

                <h2>{rating.toFixed(1)} / 5</h2>
                <p>{totalReviews} Reviews</p>
            </div>
        </div>
    );
}