export default function ReviewCard({ name, comment, rating }) {
    return (
        <article className="review-card">
            <header>
                <h3>{name}</h3>
                <p className="rating">{"★".repeat(rating)}{"☆".repeat(5 - rating)}</p>
            </header>
            <p>{comment}</p>
        </article>
    );
}
