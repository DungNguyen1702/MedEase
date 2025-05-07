import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from tqdm import tqdm

# Bước 1: Đọc file CSV từ Kaggle
# Đảm bảo rằng bạn đã tải file CSV từ Kaggle và upload lên Google Colab
# Hoặc sử dụng Kaggle API để tải trực tiếp
file_path = "/kaggle/input/diseases-and-symptoms-dataset/Final_Augmented_dataset_Diseases_and_Symptoms.csv"  # Thay đổi đường dẫn tùy theo vị trí file của bạn
df = pd.read_csv(file_path)
# print(df.head())

# Bước 2: Chuẩn bị dữ liệu
# Tách features (triệu chứng) và labels (bệnh)
X = df.drop(columns=["diseases"])  # Features: tất cả các cột trừ "diseases"
y = df["diseases"]  # Labels: cột "diseases"
print(X.head())
print(y.head())

# Bước 3: Chia dữ liệu thành tập huấn luyện và tập kiểm tra
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Bước 4: Huấn luyện mô hình Random Forest
model = RandomForestClassifier(random_state=42, n_estimators=100, warm_start=True)

# Huấn luyện từng cây và hiển thị tiến trình
for i in tqdm(range(20)):  # Thay 10 bằng số lượng cây (n_estimators)
    model.n_estimators = i + 1
    model.fit(X_train, y_train)

# Bước 5: Dự đoán trên tập kiểm tra
y_pred = model.predict(X_test)

import joblib
model_filename = 'disease_classify.joblib'
joblib.dump(model, model_filename)

# Bước 6: Đánh giá mô hình
print("Độ chính xác (Accuracy):", accuracy_score(y_test, y_pred))
print("Báo cáo phân loại (Classification Report):\n", classification_report(y_test, y_pred))

# Bước 7: Dự đoán bệnh từ triệu chứng mới
# Danh sách các triệu chứng mới
new_symptoms = ["anxiety and nervousness", "shortness of breath", "sharp chest pain", "insomnia", "palpitations"]

# Tạo một dictionary với tất cả các triệu chứng trong X, giá trị mặc định là 0
new_symptoms_dict = {symptom: [0] for symptom in X.columns}

# Điền giá trị 1 cho các triệu chứng có trong new_symptoms
for symptom in new_symptoms:
    if symptom in new_symptoms_dict:
        new_symptoms_dict[symptom] = [1]

# Tạo DataFrame từ dictionary
new_df = pd.DataFrame(new_symptoms_dict)

# Dự đoán xác suất của các bệnh
predicted_proba = model.predict_proba(new_df)

# Lấy danh sách các bệnh (labels)
disease_labels = model.classes_

# Tạo DataFrame chứa xác suất của các bệnh
proba_df = pd.DataFrame(predicted_proba, columns=disease_labels)

# Lấy top 10 bệnh có xác suất cao nhất
top_10_diseases = proba_df.iloc[0].sort_values(ascending=False).head(10)

# Hiển thị kết quả
print("Top 10 bệnh dự đoán và xác suất tương ứng:")
for disease, proba in top_10_diseases.items():
    print(f"{disease}: {proba * 100:.2f}%")

