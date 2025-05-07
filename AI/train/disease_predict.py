import requests
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline

# API WHO ICD-11
BASE_URL = "https://id.who.int/icd/release/11/2023-01/mms/search"
API_TOKEN = ""  # Thay bằng token thật
HEADERS = {
    "Accept": "application/json",
    "API-Version": "v2",
    "Accept-Language": "en",
    "Authorization": f"Bearer {API_TOKEN}"
}

def fetch_icd11_data(symptoms):
    """Tìm kiếm bệnh liên quan đến triệu chứng trên ICD-11"""
    results = []
    for symptom in symptoms:
        params = {"q": symptom}
        response = requests.get(BASE_URL, headers=HEADERS, params=params)
        if response.status_code == 200:
            data = response.json()
            # print(data)
            for item in data.get("destinationEntities", []):
                title = item.get("title", "N/A")
                if isinstance(title, dict):
                    title = title.get("@value", "N/A")
                results.append({
                    "Triệu chứng": symptom,
                    "Mã ICD-11": item.get("theCode", "N/A"),
                    "Tên bệnh": title,
                    "Mô tả": item.get("definition", {}).get("@value", "")
                })
        else:
            print(f"Lỗi {response.status_code}: {response.text}")
    return pd.DataFrame(results)

def train_model(data):
    """Huấn luyện mô hình dự đoán bệnh từ dữ liệu"""
    vectorizer = CountVectorizer()
    model = MultinomialNB()
    pipeline = make_pipeline(vectorizer, model)
    
    X_train = data["Triệu chứng"]
    y_train = data["Tên bệnh"]
    pipeline.fit(X_train, y_train)
    return pipeline

def predict_disease(model, user_input):
    """Dự đoán bệnh dựa trên triệu chứng nhập vào và trả về danh sách bệnh cùng % mắc phải"""
    probabilities = model.predict_proba([user_input])[0]
    disease_list = model.classes_
    result = sorted(zip(disease_list, probabilities), key=lambda x: x[1], reverse=True)
    return result

# Bước 1: Nhập triệu chứng từ người dùng
user_input = input("Nhập triệu chứng của bạn (cách nhau bởi dấu phẩy): ")
symptoms = [s.strip() for s in user_input.split(",")]

# Bước 2: Lấy dữ liệu từ ICD-11
icd_data = fetch_icd11_data(symptoms)

# Kiểm tra dữ liệu
if icd_data.empty:
    print("Không tìm thấy bệnh liên quan.")
else:
    # Bước 3: Huấn luyện mô hình
    model = train_model(icd_data)
    
    # Bước 4: Dự đoán bệnh
    predicted_diseases = predict_disease(model, user_input)
    print("Danh sách bệnh có thể mắc phải:")
    for disease, prob in predicted_diseases:
        print(f"- {disease}: {prob * 100:.2f}%")
