import React, { useState } from "react";
import authService from "../../services/authService";
import "../../styles/authForms.css";

export default function SignUpComponent({ closeModal, openSignIn, refreshUser }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            await authService.register(username, password);
            refreshUser();   // osvježi navbar
            closeModal();
            openSignIn();    // otvori Sign In nakon registracije
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-modal" onClick={closeModal}>
            <div className="auth-container" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={closeModal}>×</button>
                <h2>Sign Up</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                    <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                    <button type="submit">Create Account</button>
                </form>
            </div>
        </div>
    );

}
