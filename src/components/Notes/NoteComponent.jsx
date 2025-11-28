import { useEffect, useState } from "react";
import noteService from "../../services/noteService";
import './note.css'

export default function NotesSection({ recipeId, user }) {
    const [note, setNote] = useState(null);
    const [noteText, setNoteText] = useState("");
    const [isEditing, setIsEditing] = useState(false);

useEffect(() => {
    async function fetchNote() {
        if (!user) return;
        const notes = await noteService.getNotes(recipeId);
        const userNote = notes.find(n => n.user?.id === user._id);
        setNote(userNote || null);
        if (userNote) setNoteText(userNote.text);
    }
    fetchNote();
}, [recipeId, user]);


    async function handleAddOrEditNote(e) {
        e.preventDefault();
        if (!noteText.trim()) return;

        if (note) {
            const updated = await noteService.editNote(note._id, noteText);
            setNote(updated);
        } else {
            const created = await noteService.createNote(recipeId, noteText);
            created.user = { username: user.username, id: user._id };
            setNote(created);
        }
        setIsEditing(false);
    }

    async function handleDeleteNote() {
        if (!note) return;
        await noteService.deleteNote(note._id);
        setNote(null);
        setNoteText("");
        setIsEditing(false);
    }

    return (
        <div className="notes-section">
            <h2>Notes</h2>
            {user ? (
                note ? (
                    !isEditing ? (
                        <div className="note-item">
                            <p>{note.text}</p>
                            <div className="note-actions">
                                <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
                                <button className="delete-btn" onClick={handleDeleteNote}>Delete</button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleAddOrEditNote} className="note-form">
                            <textarea value={noteText} onChange={e => setNoteText(e.target.value)} />
                            <button type="submit">Save Note</button>
                            <button type="button" onClick={() => { setIsEditing(false); setNoteText(note.text); }}>Cancel</button>
                        </form>
                    )
                ) : (
                    <form onSubmit={handleAddOrEditNote} className="note-form">
                        <textarea placeholder="Write a note..." value={noteText} onChange={e => setNoteText(e.target.value)} />
                        <button type="submit">Add Note</button>
                    </form>
                )
            ) : (
                <div className="login-prompt">Log in to create notes for this recipe.</div>
            )}
        </div>
    );
}
