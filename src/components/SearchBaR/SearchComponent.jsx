import { useState } from "react";
import "./search.css";
import recipeService from "../../services/recipeService";
import ingredientService from "../../services/ingredientService";

export default function SearchComponent({ setRecipes, setCurrentPage }) {
    const [searchType, setSearchType] = useState("name");
    const [inputValue, setInputValue] = useState("");
    const [tags, setTags] = useState([]);
    const [suggestions, setSuggestions] = useState([]);

    const { getRecipesByName, getRecipesByIngredients, getAllRecipes } = recipeService;

    const handleInputChange = async (e) => {
        const value = e.target.value;
        setInputValue(value);

        if (!value.trim()) {
            setSuggestions([]);
            return;
        }

        try {
            let data;
            if (searchType === "ingredient") {
                data = await ingredientService.getIngredientsByName(value.trim());
                data = data.map(i => i.name);
            } else if (searchType === "name") {
                data = await getRecipesByName(value.trim());
                data = data.map(r => r.name);
            }

            const lowerValue = value.toLowerCase();
            const sorted = data.sort((a, b) => {
                const aLower = a.toLowerCase();
                const bLower = b.toLowerCase();

                const indexA = aLower.indexOf(lowerValue);
                const indexB = bLower.indexOf(lowerValue);

                if (indexA !== indexB) return indexA - indexB;

                return aLower.length - bLower.length;
            });

            setSuggestions(sorted);
        } catch (err) {
            console.error(err);
            setSuggestions([]);
        }
    };


    const handleKeyDown = (e) => {
        if (e.key === "Tab" && suggestions.length > 0) {
            e.preventDefault();
            const first = suggestions[0];

            setInputValue(first);

            if (searchType === "name") {
                setSuggestions([]);
                performSearch();
            }

            if (searchType === "ingredient") {
                addTag(first);
            }

            return;
        }

        if (searchType === "ingredient" && e.key === "," && inputValue.trim()) {
            addTag(inputValue.trim());
            e.preventDefault();
        }
    };

    const addTag = (tag) => {
        if (!tags.includes(tag)) {
            const newTags = [...tags, tag];
            setTags(newTags);
            setInputValue("");
            setSuggestions([]);
            if (searchType === "ingredient") performSearch(newTags);
        }
    };

    const removeTag = (tag) => {
        const newTags = tags.filter(t => t !== tag);
        setTags(newTags);
        if (searchType === "ingredient") performSearch(newTags);
    };

    const performSearch = async (searchData = null) => {
        try {
            let recipes;

            if (searchType === "name") {
                recipes = inputValue.trim()
                    ? await getRecipesByName(inputValue.trim())
                    : await getAllRecipes();
            } else if (searchType === "ingredient") {
                const ingredientsList = searchData || tags;
                recipes = ingredientsList.length > 0
                    ? await getRecipesByIngredients(ingredientsList)
                    : await getAllRecipes();
            }

            setRecipes(recipes);
            setCurrentPage(0);
        } catch (err) {
            console.error(err);
        }
    };  

    const handleSubmit = (e) => {
        e.preventDefault();

        if (searchType === "ingredient" && inputValue.trim()) {
            addTag(inputValue.trim());
        } else {
            performSearch();
        }
    };

    const toggleSearchType = () => {
        setSearchType(prev => prev === "name" ? "ingredient" : "name");
        setInputValue("");
        setTags([]);
        setSuggestions([]);

        getAllRecipes().then(setRecipes);
        setCurrentPage(0);
    };

    return (
        <div className="search-component">
            <div className="search-header">
                <button type="button" className="toggle-btn" onClick={toggleSearchType}>
                    Search by {searchType === "name" ? "Name" : "Ingredient"}
                </button>
            </div>

            <form onSubmit={handleSubmit} className="search-form">
                <input
                    type="text"
                    placeholder={
                        searchType === "name"
                            ? "Search by recipe name..."
                            : "Add ingredient..."
                    }
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                />
                <button type="submit">Search</button>
            </form>

            {suggestions.length > 0 && (
                <div className="suggestions-list">
                    {suggestions.map(s => (
                        <div
                            key={s}
                            className="suggestion-item"
                            onClick={() => {
                                if (searchType === "ingredient") addTag(s);
                                else {
                                    setInputValue(s);
                                    setSuggestions([]);
                                    performSearch();
                                }
                            }}
                        >
                            {s}
                        </div>
                    ))}
                </div>
            )}

            {searchType === "ingredient" && tags.length > 0 && (
                <div className="tags-container">
                    {tags.map(tag => (
                        <div key={tag} className="tag">
                            {tag}
                            <span className="remove-tag" onClick={() => removeTag(tag)}>
                                x
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
