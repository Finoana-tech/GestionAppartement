// C:/Users/dell/gestion-appartement/src/auth/RegisterPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../AuthStyles.css'; // Chemin relatif au fichier CSS

const RegisterPage = () => {
    const [name, setName] = useState(''); // Correspond à 'username' dans la DB PHP
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const navigate = useNavigate();

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validateName = (name) => {
        // Le nom (username) doit commencer par une majuscule (y compris les caractères accentués)
        return /^[A-ZÀ-Ÿ]/.test(name);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setMessageType('');

        // 1. Validation du nom (username) côté client
        if (!validateName(name)) {
            setMessage('Le nom doit commencer par une majuscule.');
            setMessageType('error');
            return;
        }

        // 2. Validation de l'email côté client
        if (!validateEmail(email)) {
            setMessage('Veuillez entrer une adresse email valide.');
            setMessageType('error');
            return;
        }

        // 3. Validation du mot de passe côté client
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
            const response = await axios.post('http://localhost/gestion-appartement-api/auth/Register.php', {
                name, // Envoye 'name' qui sera mappé à 'username' côté PHP
                email,
                password
            });

            if (response.data.success) {
                setMessage('Inscription réussie ! Vous pouvez maintenant vous connecter ! Redirection...');
                setMessageType('success');
                setTimeout(() => {
                    navigate('/login'); 
                }, 2000);
            } else {
                setMessage(response.data.message || 'Échec de l\'inscription.');
                setMessageType('error');
            }
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            setMessage('Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
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
                <div className="row">
                    <div className="col-md-12 form-section">
                        <h4 className="mb-4 text-success">Inscription</h4>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Nom d'utilisateur :</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    placeholder="Entrez votre nom d'utilisateur"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
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
                            <button type="submit" className="btn btn-primary btn-custom">
                                <i className="bi bi-pencil-square"></i> S'inscrire
                            </button>
                            {message && (
                                <p className={`message ${messageType === 'error' ? 'error-message' : 'success-message'}`}>
                                    {message}
                                </p>
                            )}
                            <div className="mt-3 text-center">
                                Déjà un compte ? <Link to="/login">Se connecter ici</Link>
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

export default RegisterPage;