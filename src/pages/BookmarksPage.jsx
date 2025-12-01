import { useEffect, useState } from "react";
import recipeService from "../services/recipeService";
import RecipeCardComponent from "../components/RecipeCard/RecipeCardComponent";
import PaginatorComponent from "../components/Paginator/PaginatorComponent";
import SearchComponent from "../components/SearchBaR/SearchComponent";
import "../styles/homePage.css";

export default function BookmarksPage() {
    const [recipes, setRecipes] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);

    const itemsPerPage = 16;

    useEffect(() => {
        recipeService.getBookmarkedRecipes()
            .then(setRecipes)
            .catch(console.error);
    }, []);

    const start = currentPage * itemsPerPage;
    const currentRecipes = recipes.slice(start, start + itemsPerPage);
    const totalPages = Math.ceil(recipes.length / itemsPerPage);

    return (
        <div className="home-container">
            <h1 className="home-title">Bookmarked Recipes</h1>

            <SearchComponent
                setRecipes={setRecipes}
                setCurrentPage={setCurrentPage}
            />

            <div className="recipe-grid">
                {currentRecipes.map(recipe => (
                    <RecipeCardComponent key={recipe._id} recipe={recipe} />
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
