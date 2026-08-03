import { useState } from "react";
import ReviewCard from "../Components/Cards/ReviewCard.jsx";
import { saveReview } from "../services/reviewService.js";

export default function Reviews() {
    const [rating, setRating] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [status, setStatus] = useState(null);

    async function handleSubmit(event) {
        event.preventDefault();

        const form = event.currentTarget;
        const data = Object.fromEntries(new FormData(form));
        const review = { name: data.name, comment: data.comment, rating: rating || 5 };

        setStatus({ type: "loading", text: "Submitting review..." });

        try {
            await saveReview(review);
            setReviews((items) => [...items, review]);
            setRating(0);
            form.reset();
            setStatus({ type: "success", text: "Thank you! Your review has been submitted." });
        } catch (error) {
            setStatus({ type: "error", text: error.message });
        }
    }

    return (
        <section className="review-section">
            <h2>Leave a Comment & Rating</h2>
            <form id="reviewForm" onSubmit={handleSubmit}>
                <input name="name" placeholder="Your Name" required type="text" />
                <textarea name="comment" placeholder="Write your comment..." required />
                <div className="stars" id="starRating">
                    {[1, 2, 3, 4, 5].map((value) => (
                        <button
                            aria-label={`${value} star rating`}
                            className={value <= rating ? "active" : ""}
                            key={value}
                            onClick={() => setRating(value)}
                            type="button"
                        >
                            ★
                        </button>
                    ))}
                </div>
                <button type="submit" disabled={status?.type === "loading"}>
                    {status?.type === "loading" ? "Submitting..." : "Submit Review"}
                </button>
            </form>
            {status && (
                <p className={`form-status ${status.type}`} role="status" aria-live="polite">
                    {status.text}
                </p>
            )}
            <div id="reviewsContainer">
                {reviews.map((review, index) => (
                    <ReviewCard key={`${review.name}-${index}`} {...review} />
                ))}
            </div>
        </section>
    );
}
