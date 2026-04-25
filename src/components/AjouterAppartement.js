import { useState } from 'react';
import axios from 'axios';

export default function AjouterAppartement() {
  const [design, setDesign] = useState('');
  const [loyer, setLoyer] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false); // New state to track if it's an error message

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages
    setIsError(false); // Reset error state

    try {
      const res = await axios.post(
        'http://localhost/gestion-appartement-api/appartement/create.php',
        {
          design,
          loyer: Number(loyer) // Ensure loyer is sent as a number
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      // Check if the API response indicates success or failure
      if (res.data.success) {
        setMessage(res.data.message);
        setDesign('');
        setLoyer('');
      } else {
        setMessage(res.data.message || "Échec de l'insertion côté serveur.");
        setIsError(true);
      }
    } catch (error) {
      console.error("Erreur Axios :", error);
      let errorMessage = "Erreur lors de l'insertion";

      // Attempt to get a more specific error message from the Axios error
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage = error.response.data.message || error.response.statusText || errorMessage;
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = "Pas de réponse du serveur. Vérifiez que le serveur PHP est en cours d'exécution et accessible.";
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = "Erreur lors de la configuration de la requête : " + error.message;
      }
      setMessage(errorMessage);
      setIsError(true);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Ajouter un appartement</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Désignation"
                    value={design}
                    onChange={e => setDesign(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="number"
                    placeholder="Loyer"
                    value={loyer}
                    onChange={e => setLoyer(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-success"> Enregistrer</button>
                </div>
              </form>
              {message && (
                <div className={`alert mt-3 text-center ${isError ? 'alert-danger' : 'alert-info'}`}>
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
