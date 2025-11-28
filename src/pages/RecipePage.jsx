import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/recipePage.css";

import { getCurrentUser } from "../services/authService";
import recipeService from "../services/recipeService";
import noteService from "../services/noteService";
import reviewService from "../services/reviewService";

export default function RecipePage() {
    const { recipeId } = useParams(); 
    const navigate = useNavigate();

    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);

    const [notes, setNotes] = useState([]);
    const [reviews, setReviews] = useState([]);

    const [newNote, setNewNote] = useState("");
    const [newReviewComment, setNewReviewComment] = useState("");
    const [newReviewRating, setNewReviewRating] = useState(5);

    const user = getCurrentUser();

    useEffect(() => {
        async function fetchData() {
            try {
                const r = await recipeService.getRecipeById(recipeId);
                setRecipe(r);

                const n = await noteService.getNotes(recipeId);
                setNotes(n);

                const rev = await reviewService.getReviews(recipeId);
                setReviews(rev);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [recipeId]);

    async function handleBookmark() {
        if (!user) return;

        const updated = await recipeService.toggleBookmark(recipeId);
        setRecipe((prev) => ({ ...prev, bookmarked: updated.bookmarked }));
    }

    async function handleAddNote(e) {
        e.preventDefault();
        if (!newNote.trim()) return;

        const created = await noteService.createNote(recipeId, newNote);
        setNotes((prev) => [...prev, created]);
        setNewNote("");
    }

    async function handleDeleteNote(noteId) {
        await noteService.deleteNote(noteId);
        setNotes((prev) => prev.filter((n) => n._id !== noteId));
    }

    async function handleAddReview(e) {
        e.preventDefault();

        const created = await reviewService.createReview(
            recipeId,
            newReviewRating,
            newReviewComment
        );

        setReviews((prev) => [...prev, created]);
        setNewReviewComment("");
        setNewReviewRating(5);
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
                    <form className="note-form" onSubmit={handleAddNote}>
                        <textarea
                            placeholder="Write a note..."
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                        ></textarea>
                        <button type="submit">Add Note</button>
                    </form>
                    <div className="notes-list">
                        {notes.map((note) => (
                            <div key={note._id} className="note-item">
                                <div className="note-content">
                                    <p>{note.text}</p>
                                    <small>By {note.user?.username ?? "Unknown"}</small>
                                </div>
                                <button
                                    className="delete-btn"
                                    onClick={() => handleDeleteNote(note._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!user && (
                <div className="login-prompt">
                    Log in to create notes for this recipe.
                </div>
            )}

            <div className="reviews-section">
                <h2>Reviews</h2>
                {user ? (
                    <form className="review-form" onSubmit={handleAddReview}>
                        <div className="rating-input">
                            <label>Rating:</label>
                            <select
                                value={newReviewRating}
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
                            value={newReviewComment}
                            onChange={(e) => setNewReviewComment(e.target.value)}
                        ></textarea>
                        <button type="submit">Post Review</button>
                    </form>
                ) : (
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
