import { useCallback, useEffect, useState } from "react";
import ReviewCard from "../Components/Cards/ReviewCard.jsx";
import TestimonyForm from "../Components/TestimonyForm.jsx";
import { getPublicReviews } from "../services/publicContentService.js";

export default function Reviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadReviews = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const response = await getPublicReviews();
            const entries = response.data?.data;
            if (!Array.isArray(entries)) throw new Error("The testimony response was invalid.");
            setReviews(entries);
        } catch {
            setError("Approved testimonies are temporarily unavailable. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadReviews(); }, [loadReviews]);

    return (
        <section className="review-section">
            <h2>Testimonies & Reviews</h2>
            <div id="reviewsContainer" aria-live="polite">
                {loading ? <p role="status">Loading approved testimonies…</p> : error ? (
                    <div role="alert">
                        <p>{error}</p>
                        <button type="button" onClick={loadReviews}>Retry</button>
                    </div>
                ) : reviews.length === 0 ? (
                    <p>No testimonies available yet.</p>
                ) : (
                    reviews.map((review) => (
                        <ReviewCard key={review._id || review.reference} {...review} comment={review.message} />
                    ))
                )}
            </div>
            <TestimonyForm />
        </section>
    );
}
