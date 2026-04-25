// C:/Users/dell/gestion-appartement/src/auth/LoginPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../AuthStyles.css'; // Chemin relatif au fichier CSS

// Le composant LoginPage DOIT accepter 'onLoginSuccess' comme prop
// pour pouvoir communiquer le succès de la connexion à son parent (App.js).
const LoginPage = ({ onLoginSuccess }) => { // <--- MODIFICATION ICI: Ajout de onLoginSuccess
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' ou 'error'
    const navigate = useNavigate();

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Réinitialise le message
        setMessageType('');

        // 1. Validation de l'email côté client
        if (!validateEmail(email)) {
            setMessage('Veuillez entrer une adresse email valide.');
            setMessageType('error');
            return;
        }

        // 2. Validation du mot de passe côté client
        if (password.length < 8) {
            setMessage('Le mot de passe doit contenir au moins 8 caractères.');
            setMessageType('error');
            return;
        }
        if (password.length > 14) {
            setMessage('Le mot de passe ne peut pas dépasser 14 caractères.');
            setMessageType('error');
            return;
        }

        try {
            const response = await axios.post('http://localhost/gestion-appartement-api/auth/login.php', {
                email,
                password
            });

            if (response.data.success) {
                setMessage('Connexion réussie ! Redirection...');
                setMessageType('success');
                
                // --- DÉBUT DES MODIFICATIONS POUR LA REDIRECTION ---
                // 1. Appeler la fonction fournie par App.js
                // C'est cette ligne qui met à jour l'état `isAuthenticated` dans `App.js`
                if (onLoginSuccess) { // Vérifiez toujours que la prop existe avant d'appeler
                    onLoginSuccess();
                }
                
                // 2. Déclencher la navigation après un court délai
                // La route doit correspondre à celle définie dans App.js pour le tableau de bord
                setTimeout(() => {
                    navigate('/tableau-de-bord'); // <--- MODIFICATION ICI: Changement de /dashboard à /tableau-de-bord
                }, 1500);
                // --- FIN DES MODIFICATIONS POUR LA REDIRECTION ---

            } else {
                setMessage(response.data.message || 'Échec de la connexion.');
                setMessageType('error');
            }
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            setMessage('Une erreur est survenue lors de la connexion. Veuillez réessayer.');
            setMessageType('error');
        }
    };

    return (
        <div className="auth-container">
            <nav className="navbar navbar-dark fixed-top">
                <div className="container-fluid">
                    <h3 className="text-center w-100">GESTION D'APPARTEMENTS</h3>
                </div>
            </nav>
            <div className="container-auth position-relative">
                <Link to="/" className="btn btn-outline-secondary btn-quit">
                    <i className="bi bi-door-open"></i> Quitter
                </Link>
                <div className="row">
                    <div className="col-md-12 form-section">
                        <h4 className="mb-4 text-primary">Connexion</h4>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Adresse Email :</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    placeholder="Entrez votre email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Mot de passe :</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    placeholder="Entrez votre mot de passe"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-success btn-custom">
                                <i className="bi bi-box-arrow-in-right"></i> Se connecter
                            </button>
                            {message && (
                                <p className={`message ${messageType === 'error' ? 'error-message' : 'success-message'}`}>
                                    {message}
                                </p>
                            )}
                            <div className="mt-3 text-center">
                                <Link to="/forgot-password">Mot de passe oublié ?</Link>
                            </div>
                            <div className="mt-2 text-center">
                                Pas encore de compte ? <Link to="/register">S'inscrire ici</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" />
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
        </div>
    );
};

export default LoginPage;