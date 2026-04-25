import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const BilanAppartement = () => {
  const [bilan, setBilan] = useState(null);

  useEffect(() => {
    axios.get("http://localhost/gestion-appartement-api/appartement/bilan.php")
      .then(res => setBilan(res.data));
  }, []);

  const chartData = {
    labels: ['Loyer Total', 'Loyer Minimum', 'Loyer Maximum'],
    datasets: [{
      label: 'Montants en Ariary MGA',
      backgroundColor: ['#ff6384', '#36ae2b', '#ffce56'],
      data: bilan ? [bilan.total, bilan.min, bilan.max] : []
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Bilan des loyers des appartements' }
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm p-4">
        <h2 className="text-center mb-4">Bilan des Appartements</h2>
        {bilan ? (
          <>
            <ul className="list-group list-group-flush mb-4">
              <li className="list-group-item d-flex justify-content-between">
                <span>Loyer total :</span> <strong>{bilan.total} Ar</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Loyer minimum :</span> <strong>{bilan.min} Ar</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Loyer maximum :</span> <strong>{bilan.max} Ar</strong>
              </li>
            </ul>
            <div className="d-flex justify-content-center">
              <div style={{ width: "100%", maxWidth: "600px" }}>
                <Bar data={chartData} options={options} />
              </div>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-3">Chargement des données...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BilanAppartement;
