import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';

function AuthPage() {
  const [view, setView] = useState('login');
  const [emailToReset, setEmailToReset] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const resetFields = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || name[0] !== name[0].toUpperCase()) {
      alert("Le nom doit commencer par une majuscule.");
      return;
    }
    if (!isValidEmail(email)) {
      alert("Veuillez saisir une adresse e-mail valide.");
      return;
    }
    if (password.length < 8 || password.length > 14) {
      alert("Le mot de passe doit contenir entre 8 et 14 caractères.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }

    try {
      const res = await fetch('http://localhost/gestion-appartement-api/auth/Register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Inscription réussie !");
        resetFields();
        setView('login');
      } else {
        alert(data.message || "Erreur lors de l'inscription.");
      }
    } catch {
      alert("Impossible d'atteindre le serveur.");
    }
  };

  const handleLogin = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    alert("Veuillez saisir votre email et mot de passe.");
    return;
  }

  try {
    const res = await fetch('http://localhost/gestion-appartement-api/auth/Login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      alert("Connexion réussie, bienvenue " + (data.user?.name || email));
      // Ici tu peux stocker token/session etc. selon ta réponse API
      // Exemple : localStorage.setItem('token', data.token);
      // Puis redirection si besoin
    } else {
      alert(data.message || "Erreur d'authentification.");
    }
  } catch (error) {
    alert("Erreur réseau ou serveur.");
    console.error("Login error:", error);
  }
};


  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      alert("Veuillez saisir une adresse e-mail valide.");
      return;
    }

    try {
      const res = await fetch('http://localhost/gestion-appartement-api/auth/Forgot_password.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok && data.exists) {
        alert("Email vérifié. Réinitialisation possible.");
        setEmailToReset(email);
        resetFields();
        setView('reset');
      } else {
        alert("Email incorrect ou non inscrit.");
      }
    } catch {
      alert("Erreur serveur.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password.length < 8 || password.length > 14) {
      alert("Le mot de passe doit contenir entre 8 et 14 caractères.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }

    try {
      const res = await fetch('http://localhost/gestion-appartement-api/auth/Reset_password.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToReset, newPassword: password }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Mot de passe réinitialisé !");
        resetFields();
        setView('login');
      } else {
        alert(data.message || "Échec de la réinitialisation.");
      }
    } catch {
      alert("Impossible d'accéder au serveur.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card style={{ width: '100%', maxWidth: '400px' }} className="p-4 shadow">
        <Card.Body>
          {view === 'login' && (
            <>
              <h3 className="text-center mb-3">Connexion</h3>
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" required value={email} onChange={e => setEmail(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Mot de passe</Form.Label>
                  <Form.Control type="password" required value={password} onChange={e => setPassword(e.target.value)} />
                </Form.Group>
                <Button type="submit" className="w-100 mb-2">Se connecter</Button>
              </Form>
              <div className="text-center">
                <Button variant="link" onClick={() => setView('forgot')}>Mot de passe oublié ?</Button><br />
                <Button variant="link" onClick={() => { resetFields(); setView('register'); }}>Créer un compte</Button>
              </div>
            </>
          )}

          {view === 'register' && (
            <>
              <h3 className="text-center mb-3">Inscription</h3>
              <Form onSubmit={handleRegister}>
                <Form.Group className="mb-3">
                  <Form.Label>Nom</Form.Label>
                  <Form.Control type="text" required value={name} onChange={e => setName(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" required value={email} onChange={e => setEmail(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Mot de passe</Form.Label>
                  <Form.Control type="password" required value={password} onChange={e => setPassword(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Confirmer mot de passe</Form.Label>
                  <Form.Control type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                </Form.Group>
                <Button type="submit" className="w-100 mb-2">S'inscrire</Button>
              </Form>
              <div className="text-center">
                <Button variant="link" onClick={() => { resetFields(); setView('login'); }}>Déjà inscrit ? Connexion</Button>
              </div>
            </>
          )}

          {view === 'forgot' && (
            <>
              <h3 className="text-center mb-3">Mot de passe oublié</h3>
              <Form onSubmit={handleForgotPassword}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" required value={email} onChange={e => setEmail(e.target.value)} />
                </Form.Group>
                <Button type="submit" className="w-100 mb-2">Vérifier</Button>
              </Form>
              <div className="text-center">
                <Button variant="link" onClick={() => setView('login')}>Retour</Button>
              </div>
            </>
          )}

          {view === 'reset' && (
            <>
              <h3 className="text-center mb-3">Réinitialisation</h3>
              <Form onSubmit={handleResetPassword}>
                <Form.Group className="mb-3">
                  <Form.Label>Nouveau mot de passe</Form.Label>
                  <Form.Control type="password" required value={password} onChange={e => setPassword(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Confirmer mot de passe</Form.Label>
                  <Form.Control type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                </Form.Group>
                <Button type="submit" className="w-100 mb-2">Réinitialiser</Button>
              </Form>
              <div className="text-center">
                <Button variant="link" onClick={() => setView('login')}>Retour à la connexion</Button>
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

export default AuthPage;
