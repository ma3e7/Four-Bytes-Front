import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/recipePage.css";

import { getCurrentUser } from "../services/authService";
import recipeService from "../services/recipeService";
import NoteComponent from "../components/Notes/NoteComponent";
import ReviewComponent from "../components/Reviews/ReviewComponent";

export default function RecipePage() {
    const { recipeId } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);

    const user = getCurrentUser();

    useEffect(() => {
        async function fetchData() {
            try {
                const r = await recipeService.getRecipeById(recipeId);
                setRecipe(r);
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
        setRecipe(prev => ({ ...prev, bookmarked: updated.bookmarked }));
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

            {recipe.image && <img src={recipe.image} alt={recipe.name} className="recipe-image" />}

            <div className="recipe-info">
                <p><strong>Cooking time:</strong> {recipe.cookingTime} min</p>
                <p><strong>Complexity:</strong> {recipe.complexity}/5</p>
            </div>

            <div className="ingredients-section">
                <h2>Ingredients</h2>
                <ul className="ingredients-list">
                    {recipe.ingredients.map(ing => (
                        <li key={ing._id} className="ingredient-item">{ing.name}</li>
                    ))}
                </ul>
            </div>

            <div className="description-section">
                <h2>Description</h2>
                <p className="description">{recipe.description}</p>
            </div>

            {/* Notes i Reviews */}
            <NoteComponent recipeId={recipeId} user={user} />
            <ReviewComponent recipeId={recipeId} user={user} />
        </div>
    );
}
