# api/app.py
from flask import Flask, request, jsonify, send_from_directory
import joblib
from flask_cors import CORS
import os

app = Flask(__name__, static_folder='static', static_url_path='/')
CORS(app)

# Chargement du modèle et du vecteur TF-IDF
fake_news_model = joblib.load("models/fake_news_model.pkl")
tfidf_vectorizer = joblib.load("models/tfidf_vectorizer.pkl")

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    text = data.get("content")

    if not text:
        return jsonify({"error": "Aucun texte fourni"}), 400

    vectorized_text = tfidf_vectorizer.transform([text])
    prediction = fake_news_model.predict(vectorized_text)[0]

    return jsonify({"prediction": prediction})

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    if path != "" and os.path.exists(f"api/static/{path}"):
        return send_from_directory("static", path)
    else:
        return send_from_directory("static", "index.html")

if __name__ == '__main__':
    app.run(debug=True, port=5000)
