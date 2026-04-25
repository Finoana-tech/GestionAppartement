// C:/Users/dell/gestion-appartement/src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

// Importez vos composants principaux de l'application
import Navbar from "./components/Navbar";
import FormAjout from "./components/AjouterAppartement";
import ListeAppartements from "./components/ListeAppartements";
import BilanAppartement from "./components/BilanAppartements";

// Importez vos composants d'authentification depuis le dossier 'auth'
import LoginPage from "./auth/LoginPage";         // Le composant de connexion
import RegisterPage from "./auth/RegisterPage";   // Le composant d'inscription
import ForgotPasswordPage from "./auth/ForgotPasswordPage"; // Le composant mot de passe oublié
import ResetPasswordPage from "./auth/ResetPasswordPage"; // Le composant réinitialiser mot de passe

import "./App.css"; //  fichier CSS global
import "./AuthStyles.css"; //  AuthStyles.css dans src/ pour les styles d'authentification

function AppWrapper() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Test de connexion au backend au chargement de l'application (pour le débogage)
  useEffect(() => {
    fetch("http://localhost/gestion-appartement-api/appartement/read.php")
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Erreur réseau ou réponse non OK');
      })
      .then((data) => console.log("Connexion backend réussie :", data))
      .catch((err) => console.error("Erreur de connexion au backend ou de lecture :", err));
  }, []);

  // Fonction passée aux composants d'authentification pour gérer la connexion réussie
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    // Redirige vers une route de l'application principale après connexion
    // C'est la redirection principale qui change l'URL et affiche le contenu de l'application
    navigate("/tableau-de-bord");
  };

  // Fonction de déconnexion
  const handleLogout = () => {
    // Ici, vous devrez implémenter la logique de déconnexion réelle,
    // comme la suppression d'un token d'authentification du stockage local ou des cookies.
    console.log('Déconnexion...');
    setIsAuthenticated(false);
    navigate("/"); // Redirige vers la page d'authentification après déconnexion
  };

  return (
    <>
      {!isAuthenticated ? (
        // Si l'utilisateur n'est PAS authentifié, afficher les routes d'authentification
        <Routes>
          {/* Route par défaut pour l'authentification (LoginPage) */}
          <Route path="/" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          {/* Toute autre route non définie redirige vers la page de connexion */}
          <Route path="*" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
        </Routes>
      ) : (
        // Si l'utilisateur EST authentifié, afficher la barre de navigation et les routes de l'application principale
        <>
          <Navbar onLogout={handleLogout} />
          <div className="container mt-4">
            <Routes>
              <Route path="/ajout" element={<FormAjout />} />
              <Route path="/liste" element={<ListeAppartements />} />
              <Route path="/bilan" element={<BilanAppartement />} />
              {/* Route par défaut après connexion, votre "tableau de bord" */}
              <Route
                path="/tableau-de-bord" // Nouvelle route pour le tableau de bord post-connexion
                element={
                  <div className="d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
                    <div className="card shadow p-4 w-75 bg-light">
                      <h2 className="text-center text-primary mb-3">
                        Bienvenue dans l'application de gestion d'appartements
                      </h2>
                      <p className="text-center text-secondary">
                        Utilisez le menu pour ajouter, consulter ou analyser les appartements.
                      </p>
                    </div>
                  </div>
                }
              />
              {/* Redirection si l'utilisateur est connecté mais essaie d'accéder à la racine, on le dirige vers le tableau de bord */}
              <Route path="/" element={<p>Redirection vers le tableau de bord...</p>} />
              {/* Toute autre route non définie redirige vers le tableau de bord si authentifié */}
              <Route path="*" element={
                  <div className="d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
                      <div className="card shadow p-4 w-75 bg-light">
                          <h2 className="text-center text-danger mb-3">Page introuvable</h2>
                          <p className="text-center text-secondary">La page que vous cherchez n'existe pas ou n'est pas accessible.</p>
                      </div>
                  </div>
              } />
            </Routes>
          </div>
        </>
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;