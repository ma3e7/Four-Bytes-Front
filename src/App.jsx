import { Routes, Route } from "react-router-dom";
import NavbarComponent from "./components/NavBar/NavBarComponent";
import HomePage from "./pages/HomePage";
import SignInComponent from "./components/SignIn/SignInComponent";
import SignUpComponent from "./components/SignUp/SignUpComponent";
import { useState, useEffect } from "react";
import authService from "./services/authService";
import "./App.css";

function App() {
  const [authModal, setAuthModal] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // učitavanje stanja usera pri reloadu stranice
  useEffect(() => {
    const user = authService.getCurrentUser();
    setIsLoggedIn(!!user);
  }, []);

  // poziva se nakon login/sign up/log out
  const refreshUser = () => {
    const user = authService.getCurrentUser();
    setIsLoggedIn(!!user);
  };

  const openSignIn = () => setAuthModal("signin");
  const openSignUp = () => setAuthModal("signup");
  const closeModal = () => setAuthModal(null);

  return (
    <>
      <NavbarComponent
        openSignIn={openSignIn}
        openSignUp={openSignUp}
        isLoggedIn={isLoggedIn}
        refreshUser={refreshUser}  // da bi logout odmah osvježio stanje
      />

      <div style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>

      {authModal === "signin" && (
        <SignInComponent closeModal={closeModal} refreshUser={refreshUser} />
      )}

      {authModal === "signup" && (
        <SignUpComponent closeModal={closeModal} openSignIn={openSignIn} refreshUser={refreshUser} />
      )}
    </>
  );
}

export default App;
