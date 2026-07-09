import { useState } from "react";
import ReviewCard from "../Components/Cards/ReviewCard.jsx";
import { saveReview } from "../services/reviewService.js";

export default function Reviews() {
    const [rating, setRating] = useState(0);
    const [reviews, setReviews] = useState([]);

    function handleSubmit(event) {
        event.preventDefault();
        const form = event.currentTarget;
        const data = Object.fromEntries(new FormData(form));
        const review = { name: data.name, comment: data.comment, rating: rating || 5 };
        saveReview(review);
        setReviews((items) => [...items, review]);
        setRating(0);
        form.reset();
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
                <button type="submit">Submit Review</button>
            </form>
            <div id="reviewsContainer">
                {reviews.map((review, index) => (
                    <ReviewCard key={`${review.name}-${index}`} {...review} />
                ))}
            </div>
        </section>
    );
}