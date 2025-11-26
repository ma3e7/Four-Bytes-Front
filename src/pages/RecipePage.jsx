// pages/RecipePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/RecipePage.css';

const API_URL = "https://lighthearted-sable-a6c328.netlify.app/api";

const RecipePage = () => {
    const { recipeId } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [newNote, setNewNote] = useState('');
    const [user, setUser] = useState(null);

    // Provera da li je korisnik ulogovan
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    // Učitavanje recepta
    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/recipes`);
                if (!response.ok) throw new Error('Failed to fetch recipes');
                
                const recipes = await response.json();
                const foundRecipe = recipes.find(r => r._id === recipeId);
                
                if (foundRecipe) {
                    setRecipe(foundRecipe);
                } else {
                    setError('Recipe not found');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [recipeId]);

    // Dodavanje recenzije
    const handleAddReview = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('Please login to add a review');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    recipe: recipeId,
                    rating: newReview.rating,
                    comment: newReview.comment,
                    user: user.id
                })
            });

            if (!response.ok) throw new Error('Failed to add review');

            const savedReview = await response.json();
            
            // Ažuriranje recepta sa novom recenzijom
            const updatedRecipe = {
                ...recipe,
                reviews: [...recipe.reviews, savedReview]
            };
            setRecipe(updatedRecipe);
            setNewReview({ rating: 5, comment: '' });
        } catch (err) {
            setError(err.message);
        }
    };

    // Dodavanje beleške
    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('Please login to add a note');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/note`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    recipe: recipeId,
                    content: newNote,
                    user: user.id
                })
            });

            if (!response.ok) throw new Error('Failed to add note');

            const savedNote = await response.json();
            
            // Ažuriranje recepta sa novom beleškom
            const updatedRecipe = {
                ...recipe,
                notes: [...recipe.notes, savedNote]
            };
            setRecipe(updatedRecipe);
            setNewNote('');
        } catch (err) {
            setError(err.message);
        }
    };

    // Brisanje recenzije
    const handleDeleteReview = async (reviewId) => {
        if (!user) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to delete review');

            // Uklanjanje recenzije iz stanja
            const updatedRecipe = {
                ...recipe,
                reviews: recipe.reviews.filter(review => review._id !== reviewId)
            };
            setRecipe(updatedRecipe);
        } catch (err) {
            setError(err.message);
        }
    };

    // Brisanje beleške
    const handleDeleteNote = async (noteId) => {
        if (!user) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/note/${noteId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to delete note');

            // Uklanjanje beleške iz stanja
            const updatedRecipe = {
                ...recipe,
                notes: recipe.notes.filter(note => note._id !== noteId)
            };
            setRecipe(updatedRecipe);
        } catch (err) {
            setError(err.message);
        }
    };

    // Bookmark funkcionalnost
    const handleToggleBookmark = async () => {
        if (!user) {
            alert('Please login to bookmark recipes');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/recipes/bookmark/${recipeId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to toggle bookmark');

            const data = await response.json();
            setRecipe(data.recipe);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div className="loading">Loading recipe...</div>;
    if (error) return <div className="error">Error: {error}</div>;
    if (!recipe) return <div className="error">Recipe not found</div>;

    return (
        <div className="recipe-page">
            <button onClick={() => navigate(-1)} className="back-button">
                ← Back
            </button>

            <div className="recipe-header">
                <h1>{recipe.name}</h1>
                <button 
                    onClick={handleToggleBookmark}
                    className={`bookmark-btn ${recipe.bookmarked ? 'bookmarked' : ''}`}
                >
                    {recipe.bookmarked ? '★ Bookmarked' : '☆ Bookmark'}
                </button>
            </div>

            {recipe.image && (
                <img src={recipe.image} alt={recipe.name} className="recipe-image" />
            )}

            <div className="recipe-info">
                <p><strong>Cooking Time:</strong> {recipe.cookingTime} minutes</p>
                <p><strong>Complexity:</strong> {recipe.complexity}/5</p>
            </div>

            <section className="ingredients-section">
                <h2>Ingredients</h2>
                <ul className="ingredients-list">
                    {recipe.ingredients && recipe.ingredients.map(ingredient => (
                        <li key={ingredient._id} className="ingredient-item">
                            {ingredient.name}
                        </li>
                    ))}
                </ul>
            </section>

            <section className="description-section">
                <h2>Preparation Description</h2>
                <p className="description">{recipe.description}</p>
            </section>

            {/* Notes Section */}
            <section className="notes-section">
                <h2>Notes</h2>
                {user ? (
                    <form onSubmit={handleAddNote} className="note-form">
                        <textarea
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            placeholder="Add your personal notes about this recipe..."
                            required
                            rows="3"
                        />
                        <button type="submit">Add Note</button>
                    </form>
                ) : (
                    <p className="login-prompt">Please login to add notes</p>
                )}
                
                <div className="notes-list">
                    {recipe.notes && recipe.notes.map(note => (
                        <div key={note._id} className="note-item">
                            <div className="note-content">
                                <p>{note.content}</p>
                                <small>By: {note.user?.username || 'Unknown'}</small>
                            </div>
                            {user && note.user?._id === user.id && (
                                <button 
                                    onClick={() => handleDeleteNote(note._id)}
                                    className="delete-btn"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Reviews Section */}
            <section className="reviews-section">
                <h2>Reviews</h2>
                {user ? (
                    <form onSubmit={handleAddReview} className="review-form">
                        <div className="rating-input">
                            <label>Rating:</label>
                            <select
                                value={newReview.rating}
                                onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                            >
                                {[1, 2, 3, 4, 5].map(num => (
                                    <option key={num} value={num}>{num} ★</option>
                                ))}
                            </select>
                        </div>
                        <textarea
                            value={newReview.comment}
                            onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                            placeholder="Share your experience with this recipe..."
                            required
                            rows="4"
                        />
                        <button type="submit">Submit Review</button>
                    </form>
                ) : (
                    <p className="login-prompt">Please login to add reviews</p>
                )}
                
                <div className="reviews-list">
                    {recipe.reviews && recipe.reviews.map(review => (
                        <div key={review._id} className="review-item">
                            <div className="review-header">
                                <span className="review-rating">{'★'.repeat(review.rating)}</span>
                                <span className="review-author">By: {review.user?.username || 'Unknown'}</span>
                            </div>
                            <p className="review-comment">{review.comment}</p>
                            {user && review.user?._id === user.id && (
                                <button 
                                    onClick={() => handleDeleteReview(review._id)}
                                    className="delete-btn"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default RecipePage;