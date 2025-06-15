from flask import Flask, request, jsonify
from deep_translator import GoogleTranslator
import joblib
import numpy as np
from keras.models import load_model
from keras.preprocessing.sequence import pad_sequences
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# --- Load model và preprocessor ---
current_dir = os.path.dirname(os.path.abspath(__file__))
model_dir = os.path.join(current_dir, "model")

tokenizer = joblib.load(os.path.join(model_dir, "tokenizer.pkl"))
label_encoder_disease = joblib.load(os.path.join(model_dir, "label_encoder_disease.pkl"))
label_encoder_specialization = joblib.load(os.path.join(model_dir, "label_encoder_specialization.pkl"))
max_length = joblib.load(os.path.join(model_dir, "max_length.pkl"))
model = load_model(os.path.join(model_dir, "medical_model.h5"))

# --- Bản đồ chuyên khoa Anh → Việt ---
specialization_mapping = {
    "Emergency Medicine": "Khoa Cấp cứu",
    "General Internal Medicine": "Khoa Nội tổng quát",
    "General Surgery": "Khoa Ngoại tổng quát",
    "Obstetrics": "Khoa Sản",
    "Pediatrics": "Khoa Nhi",
    "Cardiology": "Khoa Tim mạch",
    "Pulmonology": "Khoa Hô hấp",
    "Gastroenterology": "Khoa Tiêu hóa",
    "Nephrology - Urology": "Khoa Thận - Tiết niệu",
    "Endocrinology": "Khoa Nội tiết",
    "Dermatology": "Khoa Da liễu",
    "Neurology": "Khoa Thần kinh",
    "Psychiatry": "Khoa Tâm thần",
    "Orthopedics": "Khoa Chấn thương chỉnh hình",
    "Ophthalmology": "Khoa Mắt",
    "Otorhinolaryngology (ENT)": "Khoa Tai mũi họng",
    "Dentistry": "Khoa Răng hàm mặt",
    "Oncology": "Khoa Ung bướu",
    "Laboratory Medicine": "Khoa Xét nghiệm",
    "Radiology": "Khoa Chẩn đoán hình ảnh",
    "Physical Medicine and Rehabilitation": "Khoa Vật lý trị liệu - Phục hồi chức năng",
    "Nutrition": "Khoa Dinh dưỡng",
    "Pharmacy": "Khoa Dược",
    "Infection Control": "Khoa Kiểm soát nhiễm khuẩn",
    "Intensive Care Unit (ICU)": "Khoa Hồi sức cấp cứu (ICU)"
}

# --- Hàm dự đoán ---
def predict_disease(vietnamese_input, top_k=10):
    try:
        # Dịch tiếng Việt sang tiếng Anh
        english_input = GoogleTranslator(source='vi', target='en').translate(vietnamese_input)

        # Tiền xử lý văn bản
        sequence = tokenizer.texts_to_sequences([english_input])
        padded = pad_sequences(sequence, maxlen=max_length, padding='post')

        # Dự đoán
        predictions = model.predict(padded, verbose=0)
        disease_probs = predictions[0][0]
        specialization_probs = predictions[1][0]

        # Top-K bệnh
        top_indices = np.argsort(disease_probs)[::-1][:top_k]
        results = []

        # Chuyên khoa có xác suất cao nhất
        spec_index = np.argmax(specialization_probs)
        spec_en = label_encoder_specialization.inverse_transform([spec_index])[0]
        spec_vi = specialization_mapping.get(spec_en, spec_en)

        for i in top_indices:
            disease_en = label_encoder_disease.inverse_transform([i])[0]
            disease_vi = GoogleTranslator(source='en', target='vi').translate(disease_en)
            prob = float(round(disease_probs[i] * 100, 2))

            # Lấy chuỗi chuyên khoa từ mô hình (có thể là nhiều chuyên khoa ngăn cách bởi dấu phẩy)
            raw_specialization = label_encoder_specialization.inverse_transform([spec_index])[0]

            # Tách chuyên khoa tiếng Anh thành danh sách
            spec_list_en = [s.strip() for s in raw_specialization.split(',')]

            # Dịch từng chuyên khoa sang tiếng Việt
            spec_list_vi = [specialization_mapping.get(s, s) for s in spec_list_en]

            # Ghép lại thành chuỗi
            spec_vi = ", ".join(spec_list_vi)

            results.append({
                "name": disease_vi,
                "percent": prob,
                "specialization": spec_vi
            })

        return results

    except Exception as e:
        print(f"Prediction error: {str(e)}")
        raise

# --- Flask endpoint ---
@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    if 'Patient_Problem' not in data:
        return jsonify({"error": "Missing 'Patient_Problem' field"}), 400

    try:
        input_text = data['Patient_Problem']
        results = predict_disease(input_text)
        return jsonify({
            "original_input": input_text,
            "results": results
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- Run Flask ---
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
