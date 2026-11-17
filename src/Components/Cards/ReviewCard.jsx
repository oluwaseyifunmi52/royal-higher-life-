export default function ReviewCard({ name, comment, message, title, rating = 5 }) {
    const content = comment || message || "";
    return (
        <article className="review-card">
            <header>
                <h3>{title || name}</h3>
                <p className="rating">{"★".repeat(rating)}{"☆".repeat(5 - rating)}</p>
            </header>
            <p>{content}</p>
            {title && <p className="review-author">{name}</p>}
        </article>
    );
}
