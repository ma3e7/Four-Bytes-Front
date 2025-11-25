// components/RecipeCardComponent.jsx
import "./RecipeCard.css";

export default function RecipeCardComponent({ recipe }) {
    return (
        <div className="recipe-card">
            <div className="recipe-image" style={{ backgroundImage: `url(${recipe.image})` }}>
                <h3 className="recipe-title">{recipe.name}</h3>
            </div>

            <div className="recipe-info">
                <div className="recipe-meta">
                    <span>⭐ {recipe.complexity}</span>
                    <span>⏱ {recipe.cookingTime} min</span>
                </div>

                <div className="ingredients-box">
                    {recipe.ingredients?.slice(0, 5).map((i, index) => (
                        <span key={index} className="ingredient-item">
                            {i.name}
                        </span>
                    ))}
                    {recipe.ingredients?.length > 5 && <p>+ više...</p>}
                </div>
            </div>
        </div>
    );
}
