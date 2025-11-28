const API_URL = "https://lighthearted-sable-a6c328.netlify.app/api";

export async function getReviews(recipeId) {
    const response = await fetch(`${API_URL}/reviews/${recipeId}`);
    return response.json();
}

export async function createReview(recipeId, rating, comment) {
    const token = localStorage.getItem("authToken");

    const response = await fetch(`${API_URL}/reviews/${recipeId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment })
    });

    return response.json();
}

export default { getReviews, createReview };
