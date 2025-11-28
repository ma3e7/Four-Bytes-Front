import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/recipePage.css";

import { getCurrentUser } from "../services/authService";
import recipeService from "../services/recipeService";
import noteService from "../services/noteService";
import reviewService from "../services/reviewService";

export default function RecipePage() {
    const { recipeId } = useParams();

    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);

    const [note, setNote] = useState(null);
    const [reviews, setReviews] = useState([]);

    const [newNote, setNewNote] = useState("");
    const [newReviewComment, setNewReviewComment] = useState("");
    const [newReviewRating, setNewReviewRating] = useState(5);

    const user = getCurrentUser();

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch recipe
                const r = await recipeService.getRecipeById(recipeId);
                setRecipe(r);

                // Fetch note samo ako je user ulogovan
                let n = [];
                if (user) {
                    n = await noteService.getNotes(recipeId);
                }
                setNote(n[0] || null);

                // Fetch reviews (svi)
                const rev = await reviewService.getReviews(recipeId);
                setReviews(rev);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [recipeId, user]);

    // Bookmark
    async function handleBookmark() {
        if (!user) return;
        const updated = await recipeService.toggleBookmark(recipeId);
        setRecipe((prev) => ({ ...prev, bookmarked: updated.bookmarked }));
    }

    // Note handlers
    async function handleAddOrEditNote(e) {
        e.preventDefault();
        if (!newNote.trim()) return;

        if (note) {
            const updated = await noteService.editNote(note._id, newNote);
            setNote(updated);
        } else {
            const created = await noteService.createNote(recipeId, newNote);
            created.user = { username: user.username, _id: user._id };
            setNote(created);
        }
        setNewNote("");
    }

    async function handleDeleteNote() {
        if (!note) return;
        await noteService.deleteNote(note._id);
        setNote(null);
    }

    // Review handlers
    const userReview = reviews.find(r => r.user?._id === user?._id);

    async function handleAddOrEditReview(e) {
        e.preventDefault();
        if (!newReviewComment.trim()) return;

        if (userReview) {
            const updated = await reviewService.editReview(
                userReview._id,
                newReviewRating,
                newReviewComment
            );
            updated.user = { username: user.username, _id: user._id };
            setReviews(reviews.map(r => r._id === userReview._id ? updated : r));
        } else {
            const created = await reviewService.createReview(
                recipeId,
                newReviewRating,
                newReviewComment
            );
            created.user = { username: user.username, _id: user._id };
            setReviews([...reviews, created]);
        }

        setNewReviewComment("");
        setNewReviewRating(5);
    }

    async function handleDeleteReview(reviewId) {
        await reviewService.deleteReview(reviewId);
        setReviews(reviews.filter(r => r._id !== reviewId));
    }

    if (loading) return <div className="loading">Loading recipe...</div>;
    if (!recipe) return <div className="error">Recipe not found.</div>;

    return (
        <div className="recipe-page">
            <div className="recipe-header">
                <h1>{recipe.name}</h1>
                {user && (
                    <button
                        className={`bookmark-btn ${recipe.bookmarked ? "bookmarked" : ""}`}
                        onClick={handleBookmark}
                    >
                        {recipe.bookmarked ? "★ Bookmarked" : "☆ Bookmark"}
                    </button>
                )}
            </div>

            {recipe.image && (
                <img src={recipe.image} alt={recipe.name} className="recipe-image" />
            )}

            <div className="recipe-info">
                <p><strong>Cooking time:</strong> {recipe.cookingTime} min</p>
                <p><strong>Complexity:</strong> {recipe.complexity}/5</p>
            </div>

            <div className="ingredients-section">
                <h2>Ingredients</h2>
                <ul className="ingredients-list">
                    {recipe.ingredients.map((ing) => (
                        <li key={ing._id} className="ingredient-item">{ing.name}</li>
                    ))}
                </ul>
            </div>

            <div className="description-section">
                <h2>Description</h2>
                <p className="description">{recipe.description}</p>
            </div>

            {user && (
                <div className="notes-section">
                    <h2>Notes</h2>
                    <form className="note-form" onSubmit={handleAddOrEditNote}>
                        <textarea
                            placeholder="Write a note..."
                            value={note ? note.text : newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                        ></textarea>
                        <button type="submit">{note ? "Edit Note" : "Add Note"}</button>
                        {note && <button type="button" onClick={handleDeleteNote}>Delete Note</button>}
                    </form>
                </div>
            )}

            {!user && (
                <div className="login-prompt">
                    Log in to create notes for this recipe.
                </div>
            )}

            <div className="reviews-section">
                <h2>Reviews</h2>
                {user && (
                    <form className="review-form" onSubmit={handleAddOrEditReview}>
                        <div className="rating-input">
                            <label>Rating:</label>
                            <select
                                value={userReview ? userReview.rating : newReviewRating}
                                onChange={(e) => setNewReviewRating(Number(e.target.value))}
                            >
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </select>
                        </div>
                        <textarea
                            placeholder="Write your review..."
                            value={userReview ? userReview.comment : newReviewComment}
                            onChange={(e) => setNewReviewComment(e.target.value)}
                        ></textarea>
                        <button type="submit">{userReview ? "Edit Review" : "Post Review"}</button>
                        {userReview && (
                            <button type="button" onClick={() => handleDeleteReview(userReview._id)}>
                                Delete Review
                            </button>
                        )}
                    </form>
                )}

                {!user && (
                    <div className="login-prompt">
                        Log in to post a review.
                    </div>
                )}

                <div className="reviews-list">
                    {reviews.map((review) => (
                        <div key={review._id} className="review-item">
                            <div className="review-header">
                                <span className="review-author">
                                    {review.user?.username ?? "Unknown"}
                                </span>
                                <span className="review-rating">
                                    {"★".repeat(review.rating)}
                                </span>
                            </div>
                            <p className="review-comment">{review.comment}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
