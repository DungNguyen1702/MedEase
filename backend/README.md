# 💻 MedEase – Backend

![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)
![NestJS](https://img.shields.io/badge/NestJS-10.x-red.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen.svg)
![JWT](https://img.shields.io/badge/JWT-9.x-lightgrey.svg)

## 📌 Overview

**MedEase** is a smart healthcare backend system that enables:

- 📅 Online medical appointment booking
- 📁 Secure storage of medical records
- 💬 AI-powered health consultations (Gemini, Transformers)
- 💳 Payment integration with ZaloPay and Momo
- ☁️ Image storage via Cloudinary
- 📄 Logging AI conversations to Google Sheets

---

## 🚀 Key Features

- Role-based authentication (Patient, Doctor, Admin)
- Manage medical records, profiles, and appointments
- AI assistant for basic diagnosis and question-answering
- Cloud image upload support (e.g., prescription, reports)
- Integrated payment APIs (ZaloPay, Momo)
- Google Sheets logging for chatbot conversation tracking

---

## 🧰 Technologies Used

| Technology | Purpose |
|-----------|---------|
| [NestJS](https://nestjs.com) | Core framework |
| [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) | Cloud database |
| [Mongoose](https://mongoosejs.com) | ODM |
| [JWT](https://jwt.io) | Authentication |
| [Cloudinary](https://cloudinary.com/) | Image storage |
| [Google Sheets API](https://developers.google.com/sheets/api) | Conversation logging |
| [Gemini API](https://ai.google.dev/gemini-api) | AI Health Assistant |
| [ZaloPay / Momo](https://momo.vn) | Payment gateways |

---

## ⚙️ Requirements

- Node.js >= 18.x
- npm >= 9.x
- MongoDB Atlas account

---

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/DungNguyen1702/MedEase.git
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Then update `.env` with your settings:

```env
PORT=8000

MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/medease?retryWrites=true&w=majority
DB_NAME=medease

JWT_SECRET=your-secret
JWT_EXPIRES_IN=7d

ZALOPAY_APP_ID=
ZALOPAY_KEY1=
ZALOPAY_KEY2=
ZALOPAY_ENDPOINT_CREATE=
ZALOPAY_ENDPOINT_QUERY=
ZALOPAY_REDIRC_URL=

MOMO_ACCESS_KEY=
MOMO_SECRET_KEY=
MOMO_REDIRC_URL=
MOMO_ENDPOINT_CREATE=
MOMO_ENDPOINT_QUERY=

MAIL_PORT=
MAIL_HOST=
MAIL_USER=
MAIL_PASSWORD=
_AI
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

GEMINI_API_URL=

GOOGLE_CREDENTIALS_BASE64=
SPREADSHEET_ID=
AI_SPREADSHEET_ID=

```

---

## 🌐 Setup MongoDB Atlas

1. Visit: https://www.mongodb.com/cloud/atlas  
2. Create a **free cluster**
3. Create a **database user** with username/password
4. Whitelist your IP (or use `0.0.0.0/0` to allow all)
5. Copy your connection string and replace in `.env`:

```env
MONGO_URI=mongodb+srv://admin:admin123@cluster0.mongodb.net/medease?retryWrites=true&w=majority
```

---

## ▶️ Run the Server

### Development mode:

```bash
npm run start:dev
```

### Production mode:

```bash
npm run build
npm run start:prod
```

---

## 🧪 Run Tests

```bash
npm run test
```

---

## 🤖 AI & Chat Logging

- Integrated with Gemini and local transformers for medical Q&A
- Automatically logs question/answer pairs to Google Sheets

---

## 👨‍💻 Author

- **Nguyễn Văn Dũng**  
- GitHub: [@DungNguyen1702](https://github.com/DungNguyen1702)

---

## 📄 License

This project is **UNLICENSED** and intended for educational or internal use only.
