import React, { useState } from "react";
import authService from "../../services/authService";
import "../../styles/authForms.css";

export default function SignInComponent({ closeModal, refreshUser }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await authService.login(username, password);
            refreshUser();   // osvježi navbar
            closeModal();    // zatvori modal
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-modal" onClick={closeModal}>
            <div className="auth-container" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={closeModal}>×</button>
                <h2>Sign In</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                    <button type="submit">Sign In</button>
                </form>
            </div>
        </div>
    );

}
