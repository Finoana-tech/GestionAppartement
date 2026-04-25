import React, { useEffect, useState } from "react";
import axios from "axios";

const ListAppartement = () => {
  const [appartements, setAppartements] = useState([]);
  const [message, setMessage] = useState("");
  const [edit, setEdit] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchAppartements = () => {
    axios
      .get("http://localhost/gestion-appartement-api/appartement/read.php")
      .then((res) => setAppartements(res.data));
  };

  useEffect(() => {
    fetchAppartements();
  }, []);

  const deleteAppartement = (numApp) => {
    axios
      .post("http://localhost/gestion-appartement-api/appartement/delete.php", { numApp })
      .then((res) => {
        setMessage(res.data.success ? "Suppression réussie" : "Échec de suppression");
        fetchAppartements(); // Re-fetch les données après suppression pour mettre à jour la liste
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression:", error);
        setMessage("Erreur lors de la suppression.");
      });
  };

  const startEdit = (app) => setEdit(app);

  const handleUpdate = () => {
    axios
      .post("http://localhost/gestion-appartement-api/appartement/update.php", edit)
      .then((res) => {
        setMessage(res.data.success ? "Modification réussie" : "Modification échouée");
        setEdit(null); // Quitte le mode édition
        fetchAppartements(); // Re-fetch les données après modification
      })
      .catch((error) => {
        console.error("Erreur lors de la modification:", error);
        setMessage("Erreur lors de la modification.");
      });
  };

  const obs = (loyer) => {
    if (loyer < 1000) return "Bas";
    if (loyer <= 5000) return "Moyen";
    return "Élevé";
  };

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = appartements.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(appartements.length / itemsPerPage);

  const changePage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-body">
          <h2 className="text-center mb-4">Liste des Appartements</h2>

          {message && <div className="alert alert-info text-center">{message}</div>}

          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Numéro</th> {/* Colonne pour le numéro d'affichage */}
                  <th>Désignation</th>
                  <th>Loyer</th>
                  <th>Observation</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* MODIFICATION PRINCIPALE ICI */}
                {/* On utilise 'index' fourni par map pour la numérotation d'affichage */}
                {currentItems.map((app, index) => ( 
                  <tr key={app.numApp}>
                    <td>{indexOfFirst + index + 1}</td> {/* Calcule le numéro séquentiel CORRECT pour la page actuelle */}
                    <td>
                      {edit && edit.numApp === app.numApp ? (
                        <input
                          className="form-control"
                          value={edit.design}
                          onChange={(e) => setEdit({ ...edit, design: e.target.value })}
                        />
                      ) : (
                        app.design
                      )}
                    </td>
                    <td>
                      {edit && edit.numApp === app.numApp ? (
                        <input
                          type="number"
                          className="form-control"
                          value={edit.loyer}
                          onChange={(e) => setEdit({ ...edit, loyer: e.target.value })}
                        />
                      ) : (
                        app.loyer
                      )}
                    </td>
                    <td>{obs(app.loyer)}</td>
                    <td>
                      {edit && edit.numApp === app.numApp ? (
                        <>
                          <button className="btn btn-success btn-sm me-2 mb-1" onClick={handleUpdate}>
                            Valider
                          </button>
                          <button className="btn btn-secondary btn-sm mb-1" onClick={() => setEdit(null)}>
                            Annuler
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn btn-primary btn-sm me-2 mb-1"
                            onClick={() => startEdit(app)}
                          >
                            Modifier
                          </button>
                          <button
                            className="btn btn-danger btn-sm mb-1"
                            onClick={() => deleteAppartement(app.numApp)}
                          >
                            Supprimer
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          <div className="d-flex justify-content-center mt-4">
            <button
              className="btn btn-outline-secondary me-2"
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Précédent
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`btn me-2 ${currentPage === i + 1 ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => changePage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              className="btn btn-outline-secondary"
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListAppartement;