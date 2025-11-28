const API_URL = "https://lighthearted-sable-a6c328.netlify.app/api/reviews";

export async function getReviews(recipeId) {
    const response = await fetch(`${API_URL}/${recipeId}`);
    return response.json();
}

export async function createReview(recipeId, rating, comment) {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_URL}/${recipeId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment })
    });
    return response.json();
}

export async function editReview(reviewId, rating, comment) {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_URL}/${reviewId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment })
    });
    return response.json();
}

export async function deleteReview(reviewId) {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_URL}/${reviewId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    return response.json();
}

export default { getReviews, createReview, editReview, deleteReview };
