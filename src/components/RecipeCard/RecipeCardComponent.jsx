import React from "react";
import "./RecipeCard.css";

export default function RecipeCard({ recipe }) {
    return (
        <div className="recipe-card">
            <div
                className="recipe-image"
                style={{ backgroundImage: `url(${recipe.image})` }}
            >
                <h3 className="recipe-name">{recipe.name}</h3>
            </div>

            <div className="recipe-info">
                <div className="rating-time">
                    <span>⭐ {recipe.rating || 0}</span>
                    <span>⏱ {recipe.cookingTime} min</span>
                </div>
            </div>

            <div className="ingredients-overlay">
                <h4>Ingredients</h4>

                <div className="ingredients-list">
                    {recipe.ingredients.map((ing) => (
                        <span key={ing._id}>{ing.name}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}
