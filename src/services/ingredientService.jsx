const API_URL = "https://lighthearted-sable-a6c328.netlify.app/api";

export async function getIngredientsByName(name) {
    const response = await fetch(`${API_URL}/ingredients?name=${name}`);
    if (!response.ok) throw new Error("Error fetching ingredients");
    return response.json();
}

export default { getIngredientsByName };
