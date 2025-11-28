const API_URL = "https://lighthearted-sable-a6c328.netlify.app/api";

function getAuthHeader() {
    const token = localStorage.getItem("authToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getNotes(recipeId) {
    const response = await fetch(`${API_URL}/note/${recipeId}`, {
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeader()
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch notes: ${response.status}`);
    }

    return response.json();
}

export async function createNote(recipeId, text) {
    const response = await fetch(`${API_URL}/note/${recipeId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeader()
        },
        body: JSON.stringify({ text })
    });

    if (!response.ok) {
        throw new Error(`Failed to create note: ${response.status}`);
    }

    return response.json();
}

export async function editNote(noteId, text) {
    const response = await fetch(`${API_URL}/note/${noteId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeader()
        },
        body: JSON.stringify({ text })
    });

    if (!response.ok) {
        throw new Error(`Failed to edit note: ${response.status}`);
    }

    return response.json();
}

export async function deleteNote(noteId) {
    const response = await fetch(`${API_URL}/note/${noteId}`, {
        method: "DELETE",
        headers: {
            ...getAuthHeader()
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to delete note: ${response.status}`);
    }

    return response.json();
}

export default { getNotes, createNote, editNote, deleteNote };
