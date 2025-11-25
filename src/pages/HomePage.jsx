
import { useEffect, useState } from "react";
import { getAllRecipes } from "../services/recipeService";
import RecipeCardComponent from "../components/RecipeCard/RecipeCardComponent";
import PaginatorComponent from "../components/Paginator/PaginatorComponent";
import "../styles/homePage.css";

export default function HomePage() {
    const [recipes, setRecipes] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);

    const itemsPerPage = 16;

    useEffect(() => {
        getAllRecipes().then(setRecipes).catch(console.error);
    }, []);

    const start = currentPage * itemsPerPage;
    const currentRecipes = recipes.slice(start, start + itemsPerPage);
    const totalPages = Math.ceil(recipes.length / itemsPerPage);

    return (
        <div className="home-container">
            <h1 className="home-title">Recepti</h1>

            <div className="recipe-grid">
                {currentRecipes.map((recipe) => (
                    <RecipeCardComponent key={recipe.id} recipe={recipe} />
                ))}
            </div>

            <PaginatorComponent
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
}
