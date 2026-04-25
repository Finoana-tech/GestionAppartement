
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../AuthStyles.css'; 

const ResetPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const navigate = useNavigate();
    const location = useLocation(); // Pour récupérer l'état passé depuis ForgotPasswordPage

    useEffect(() => {
        // Pré-remplir l'email si passé depuis la page "mot de passe oublié"
        if (location.state && location.state.email) {
            setEmail(location.state.email);
        }
    }, [location.state]);

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

        if (newPassword !== confirmPassword) {
            setMessage('Les mots de passe ne correspondent pas.');
            setMessageType('error');
            return;
        }

        if (newPassword.length < 8) {
            setMessage('Le nouveau mot de passe doit contenir au moins 8 caractères.');
            setMessageType('error');
            return;
        }
        if (newPassword.length > 14) {
            setMessage('Le nouveau mot de passe ne peut pas dépasser 14 caractères.');
            setMessageType('error');
            return;
        }

        try {
            const response = await axios.post('http://localhost/gestion-appartement-api/auth/Reset_password.php', {
                email,
                newPassword
            });

            if (response.data.success) {
                setMessage(response.data.message + ' Redirection...');
                setMessageType('success');
                setTimeout(() => {
                    navigate('/login'); 
                }, 2000);
            } else {
                setMessage(response.data.message || 'Échec de la réinitialisation du mot de passe.');
                setMessageType('error');
            }
        } catch (error) {
            console.error('Erreur lors de la réinitialisation du mot de passe:', error);
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
                        <h4 className="mb-4 text-info">Réinitialiser le mot de passe</h4>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Adresse Email :</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    placeholder="Votre email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={!!location.state?.email} // Désactiver si l'email a été pré-rempli
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="newPassword" className="form-label">Nouveau mot de passe :</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="newPassword"
                                    placeholder="Nouveau mot de passe"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="confirmPassword" className="form-label">Confirmer le nouveau mot de passe :</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="confirmPassword"
                                    placeholder="Confirmer le nouveau mot de passe"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-info btn-custom">
                                Réinitialiser le mot de passe
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

export default ResetPasswordPage;