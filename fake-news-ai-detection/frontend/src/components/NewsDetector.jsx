import React, { useState } from 'react';
import axios from 'axios';
import './NewsDetector.css';

const NewsDetector = () => {
  const [content, setContent] = useState('');
  const [result, setResult] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleSubmit = async () => {
    if (!content) return;

    try {
      const res = await axios.post(`${API_URL}/predict`, { content });
      setResult(res.data.prediction);
    } catch (error) {
      console.error("Erreur lors de la prédiction :", error);
    }
  };

  return (
    <div className="detector-container">
      <h1>Détection de Fake News</h1>
      <p className="subtitle">Ce modèle a été entraîné sur des actualités en anglais 🇬🇧</p>
      <textarea
        placeholder="Collez ici le texte d'un article de presse..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
      <button onClick={handleSubmit}>Soumettre</button>

      {result && (
        <div className={`result ${result === 'fake' ? 'fake' : 'real'}`}>
          {result === 'fake' ? 'Faux (Fake)' : 'Réel (True)'}
        </div>
      )}
    </div>
  );
};

export default NewsDetector;
