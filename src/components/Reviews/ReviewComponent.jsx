import { useEffect, useState } from "react";
import reviewService from "../../services/reviewService";
import './review.css';

export default function ReviewsSection({ recipeId, user }) {
    const [reviews, setReviews] = useState([]);
    const [currentUserReview, setCurrentUserReview] = useState(null);
    const [reviewText, setReviewText] = useState("");
    const [reviewRating, setReviewRating] = useState(5);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        async function fetchReviews() {
            const revs = await reviewService.getReviews(recipeId);
            setReviews(revs);

            if (user) {
                const ur = revs.find(r => String(r.user?.id) === String(user._id));
                setCurrentUserReview(ur || null);
                if (ur) {
                    setReviewText(ur.comment);
                    setReviewRating(ur.rating);
                }
            }
        }
        fetchReviews();
    }, [recipeId, user]);

    async function handleAddOrEditReview(e) {
        e.preventDefault();
        if (!reviewText.trim()) return;

        if (currentUserReview) {
            const updated = await reviewService.editReview(currentUserReview._id, reviewRating, reviewText);
            updated.user = { username: user.username, id: user._id };
            setReviews(reviews.map(r => r._id === currentUserReview._id ? updated : r));
            setCurrentUserReview(updated);
        } else {
            const created = await reviewService.createReview(recipeId, reviewRating, reviewText);
            created.user = { username: user.username, id: user._id };
            setReviews([...reviews, created]);
            setCurrentUserReview(created);
        }

        setIsEditing(false);
    }

    async function handleDeleteReview() {
        if (!currentUserReview) return;
        await reviewService.deleteReview(currentUserReview._id);
        setReviews(reviews.filter(r => r._id !== currentUserReview._id));
        setCurrentUserReview(null);
        setReviewText("");
        setReviewRating(5);
        setIsEditing(false);
    }

    return (
        <div className="reviews-section">
            <h2>Reviews</h2>
            {user ? (
                currentUserReview ? (
                    !isEditing ? (
                        <div className="review-item">
                            <div className="review-header">
                                <span className="review-author">{user.username}</span>
                                <span className="review-rating">{"★".repeat(currentUserReview.rating)}</span>
                            </div>
                            <p className="review-comment">{currentUserReview.comment}</p>
                            <div className="review-actions">
                                <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit</button>

                                <button className="delete-btn" onClick={() => handleDeleteReview(currentUserReview._id)}>Delete</button>
                            </div>
                        </div>

                    ) : (
                        <form onSubmit={handleAddOrEditReview} className="review-form">
                            <div className="rating-input">
                                <label>Rating:</label>
                                <select value={reviewRating} onChange={e => setReviewRating(Number(e.target.value))}>
                                    {[1, 2, 3, 4, 5].map(n => <option key={n}>{n}</option>)}
                                </select>
                            </div>
                            <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} />
                            <button type="submit">Save Review</button>
                            <button type="button" onClick={() => { setIsEditing(false); setReviewText(currentUserReview.comment); setReviewRating(currentUserReview.rating); }}>Cancel</button>
                        </form>
                    )
                ) : (
                    <form onSubmit={handleAddOrEditReview} className="review-form">
                        <div className="rating-input">
                            <label>Rating:</label>
                            <select value={reviewRating} onChange={e => setReviewRating(Number(e.target.value))}>
                                {[1, 2, 3, 4, 5].map(n => <option key={n}>{n}</option>)}
                            </select>
                        </div>
                        <textarea placeholder="Write your review..." value={reviewText} onChange={e => setReviewText(e.target.value)} />
                        <button type="submit">Post Review</button>
                    </form>
                )
            ) : (
                <div className="login-prompt">Log in to post a review.</div>
            )}

            <div className="reviews-list">
                {reviews.filter(r => String(r.user?.id) !== String(user?._id)).map(r => (
                    <div key={r._id} className="review-item">
                        <div className="review-header">
                            <span className="review-author">{r.user?.username ?? "Unknown"}</span>
                            <span className="review-rating">{"★".repeat(r.rating)}</span>
                        </div>
                        <p className="review-comment">{r.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
