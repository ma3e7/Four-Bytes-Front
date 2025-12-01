import { Link } from "react-router-dom";
import authService from "../../services/authService";
import "./navbar.css";

export default function NavbarComponent({ openSignIn, openSignUp, isLoggedIn, refreshUser }) {

    const user = authService.getCurrentUser();

    const handleLogout = () => {
        authService.logout();
        refreshUser();
    };

    return (
        <nav className="navbar">
            <div className="left">
                {!isLoggedIn && (
                    <Link to="/" className="logo-left">Four Bytes</Link>
                )}
                {isLoggedIn && <Link to="/bookmarks">Bookmarks</Link>}
            </div>

            <div className="center">
                {isLoggedIn && (
                    <Link to="/">Four Bytes</Link>
                )}
            </div>

            <div className="right">
                {!isLoggedIn && (
                    <>
                        <button className="btn" onClick={openSignIn}>Sign In</button>
                        <button className="btn primary" onClick={openSignUp}>Sign Up</button>
                    </>
                )}

                {isLoggedIn && user && (
                    <>
                        <span>{user.username}</span>

                        {user.role === "admin" && (
                            <button className="btn admin">Add Recipe</button>
                        )}

                        <button onClick={handleLogout} className="btn logout">
                            Sign Out
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}