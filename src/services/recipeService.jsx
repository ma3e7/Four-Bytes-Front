const API_URL = "https://lighthearted-sable-a6c328.netlify.app/api";

export async function getAllRecipes() {
    const response = await fetch(`${API_URL}/recipes`);
    return response.json();
}

export async function getRecipeById(recipeId) {
    const response = await fetch(`${API_URL}/recipes/${recipeId}`);

    if (!response.ok) {
        throw new Error(`Recipe with id ${recipeId} not found`);
    }

    return response.json();
}


export async function toggleBookmark(recipeId) {
    const token = localStorage.getItem("authToken");

    const response = await fetch(`${API_URL}/recipes/bookmark/${recipeId}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
    });

    return response.json();
}

export default { getAllRecipes, getRecipeById, toggleBookmark };
