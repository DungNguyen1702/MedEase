from flask import Flask, request, jsonify
import joblib
import pandas as pd
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import requests
from googletrans import Translator
import os

app = Flask(__name__)
current_dir = os.path.dirname(os.path.abspath(__file__))

# Load mô hình và dữ liệu
model_path = os.path.join(current_dir, 'model', 'disease_classify.joblib')
# Load the pre-trained model
if not os.path.exists(model_path):
    print("Model file not found at", model_path)
model = joblib.load(model_path)

df_path = os.path.join(current_dir, 'dataset', 'Final_Augmented_dataset_Diseases_and_Symptoms.csv')
df = pd.read_csv(df_path)
symptoms = list(df.columns[df.columns != "diseases"])

# Load sentence embedding model
embed_model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')

# Google Translate
translator = Translator()


@app.route("/predict", methods=["POST"])
def predict_disease():
    data = request.json
    input_vi = data.get("input", "")

    # 1. Gửi request để dịch sang tiếng Anh
    try:
        response = requests.get(f"https://ggfn6s55-8000.asse.devtunnels.ms/chatbot/translate/{input_vi}")
        translated_input = response.json().get("translated", "")
    except Exception as e:
        return jsonify({"error": "Không thể gọi API dịch"}), 500

    # 2. Dùng sentence embedding để tìm các triệu chứng khớp
    user_embedding = embed_model.encode([translated_input])
    symptom_embeddings = embed_model.encode(symptoms)

    similarities = cosine_similarity(user_embedding, symptom_embeddings)[0]
    symptom_scores = list(zip(symptoms, similarities))

    matched_symptoms = [s for s, score in symptom_scores if score > 0.6]

    if not matched_symptoms:
        return jsonify({"message": "Không tìm thấy triệu chứng phù hợp"})

    # 3. Dự đoán bệnh
    input_dict = {symptom: [0] for symptom in symptoms}
    for symptom in matched_symptoms:
        input_dict[symptom] = [1]

    input_df = pd.DataFrame(input_dict)
    probabilities = model.predict_proba(input_df)[0]
    disease_labels = model.classes_

    # 4. Tạo danh sách bệnh với xác suất
    results = sorted(zip(disease_labels, probabilities), key=lambda x: x[1], reverse=True)[:10]

    # 5. Dịch tên bệnh sang tiếng Việt
    results_translated = []
    for disease, proba in results:
        print(disease)
        translated_disease = translator.translate(disease, src='en', dest='vi').text
        results_translated.append({
            "name": translated_disease,
            "percent": round(proba * 100, 2)
        })

    return jsonify({
        "detected_symptoms": matched_symptoms,
        "predicted_disease": results_translated
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
