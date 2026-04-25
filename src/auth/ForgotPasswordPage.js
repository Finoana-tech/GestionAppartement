// C:/Users/dell/gestion-appartement/src/auth/ForgotPasswordPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../AuthStyles.css'; // Chemin relatif au fichier CSS

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const navigate = useNavigate();

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setMessageType('');

        if (!validateEmail(email)) {
            setMessage('Veuillez entrer une adresse email valide.');
            setMessageType('error');
            return;
        }

        try {
            const response = await axios.post('http://localhost/gestion-appartement-api/auth/Forgot_password.php', {
                email
            });

            if (response.data.success) {
                setMessage(response.data.message + ' Redirection...');
                setMessageType('success');
                // Si l'email est vérifié, naviguer vers la page de réinitialisation du mot de passe
                setTimeout(() => {
                    navigate('/reset-password', { state: { email: email } }); // Passe l'email à la page suivante
                }, 2000);
            } else {
                setMessage(response.data.message || 'Une erreur est survenue lors de la vérification de l\'email.');
                setMessageType('error');
            }
        } catch (error) {
            console.error('Erreur lors de la vérification de l\'email:', error);
            setMessage('Une erreur est survenue. Veuillez réessayer.');
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
                        <h4 className="mb-4 text-warning">Mot de passe oublié</h4>
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
                            <button type="submit" className="btn btn-warning btn-custom">
                                Vérifier l'email
                            </button>
                            {message && (
                                <p className={`message ${messageType === 'error' ? 'error-message' : 'success-message'}`}>
                                    {message}
                                </p>
                            )}
                            <div className="mt-3 text-center">
                                <Link to="/login">Retour à la connexion</Link>
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

export default ForgotPasswordPage;