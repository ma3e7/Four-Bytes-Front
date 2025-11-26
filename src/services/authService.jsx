const API_URL = "https://lighthearted-sable-a6c328.netlify.app/api";

export async function register(username, password) {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    let data = null;
    try {
        data = await response.json();
    } catch (e) {
        throw new Error("Server returned invalid JSON.");
    }

    if (!response.ok) {
        throw new Error(data.message || "Registration failed");
    }

    return data;
}

export async function login(username, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    let data = null;
    try {
        data = await response.json();
    } catch (e) {
        throw new Error("Server returned invalid JSON.");
    }

    if (!response.ok) {
        throw new Error(data.message || "Login failed");
    }

    localStorage.setItem("authToken", data.token);
    localStorage.setItem("authUser", JSON.stringify(data.user));

    return data;
}

export function getCurrentUser() {
    const user = localStorage.getItem("authUser");
    return user ? JSON.parse(user) : null;
}

export function logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
}

export default {
    register,
    login,
    getCurrentUser,
    logout,
};
