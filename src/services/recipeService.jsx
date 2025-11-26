const API_URL = "https://lighthearted-sable-a6c328.netlify.app/api/recipes";

export const getAllRecipes = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Could not get the recipes");
    return response.json();
};
