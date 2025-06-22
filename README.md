# MedEase

MedEase – A smart healthcare solution for booking appointments, storing medical records, and providing AI-powered health consultations

## 📌 Overview

**MedEase** is a smart healthcare backend system that enables:

-   📅 Online medical appointment booking
-   📁 Secure storage of medical records
-   💬 AI-powered health consultations (Gemini, Transformers)
-   💳 Payment integration with ZaloPay and Momo
-   ☁️ Image storage via Cloudinary
-   📄 Logging AI conversations to Google Sheets

---

## 🚀 Key Features

-   Role-based authentication (Patient, Doctor, Admin)
-   Manage medical records, profiles, and appointments
-   AI assistant for basic diagnosis and question-answering
-   Cloud image upload support (e.g., prescription, reports)
-   Integrated payment APIs (ZaloPay, Momo)
-   Google Sheets logging for chatbot conversation tracking

---

# Backend - NestJS

![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)
![NestJS](https://img.shields.io/badge/NestJS-10.x-red.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen.svg)
![JWT](https://img.shields.io/badge/JWT-9.x-lightgrey.svg)

## 🧰 Technologies Used

| Technology                                                    | Purpose              |
| ------------------------------------------------------------- | -------------------- |
| [NestJS](https://nestjs.com)                                  | Core framework       |
| [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)          | Cloud database       |
| [Mongoose](https://mongoosejs.com)                            | ODM                  |
| [JWT](https://jwt.io)                                         | Authentication       |
| [Cloudinary](https://cloudinary.com/)                         | Image storage        |
| [Google Sheets API](https://developers.google.com/sheets/api) | Conversation logging |
| [Gemini API](https://ai.google.dev/gemini-api)                | AI Health Assistant  |
| [ZaloPay / Momo](https://momo.vn)                             | Payment gateways     |

## ⚙️ Requirements

-   Node.js >= 18.x
-   npm >= 9.x
-   MongoDB Atlas account

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/medease-backend.git
cd medease-backend
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

## 🌐 Setup MongoDB Atlas

1. Visit: https://www.mongodb.com/cloud/atlas
2. Create a **free cluster**
3. Create a **database user** with username/password
4. Whitelist your IP (or use `0.0.0.0/0` to allow all)
5. Copy your connection string and replace in `.env`:

```env
MONGO_URI=mongodb+srv://admin:admin123@cluster0.mongodb.net/medease?retryWrites=true&w=majority
```

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

## 🧪 Run Tests

```bash
npm run test
```

---

# Frontend - ReactJS

![React version](https://img.shields.io/badge/React-19.x-blue.svg)
![Ant Design](https://img.shields.io/badge/Ant%20Design-5.x-orange.svg)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.x-purple.svg)
![Vite](https://img.shields.io/badge/Vite-6.x-yellow.svg)

## 🧰 Technologies Used

| Tech Stack                                                  | Purpose                            |
| ----------------------------------------------------------- | ---------------------------------- |
| [React 19](https://react.dev)                               | UI development                     |
| [Vite 6](https://vitejs.dev)                                | Fast dev server and build tool     |
| [Ant Design 5](https://ant.design/)                         | UI components                      |
| [Bootstrap 5](https://getbootstrap.com/)                    | Responsive layout and styling      |
| [Axios](https://axios-http.com/)                            | API communication                  |
| [React Router 7](https://reactrouter.com/)                  | Routing/navigation                 |
| [React Toastify](https://fkhadra.github.io/react-toastify/) | Notifications                      |
| [Chart.js](https://www.chartjs.org/)                        | Data visualization                 |
| [Swiper](https://swiperjs.com/)                             | Carousel/sliders                   |
| [Sass](https://sass-lang.com/)                              | Styling with variables and nesting |

## ⚙️ Requirements

-   **Node.js** >= 18.x
-   **npm** >= 9.x
-   **Git** (optional)

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/medease-frontend.git
cd medease-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

```bash
cp .env.example .env
```

Then fill out `.env`:

```env
VITE_API_URL=http://localhost:8000       # Your backend API URL
VITE_REDIRECT_URL=http://localhost:5173  # Frontend host (for OAuth or redirects)
```

> You can add other environment variables as needed for deployment.

## ▶️ Running the App

### Development mode (with hot-reload)

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── assets/           # Images and static files
├── components/       # Reusable UI components
├── constants/        # constants
├── context/          # redifined in reactjs
├── data/             # fake data using when developing
├── utils/            # Helpers/validators
├── views/            # Page-level components (routes)
└── App.jsx           # Main app entry
```

## 🔒 Authentication

-   Token-based (JWT)
-   Role-based access (Patient, Doctor, Admin)
-   Handled via `axios` interceptors and route guards

## 📑 Features Implemented

-   Patient/doctor profile management
-   Avatar upload using `FormData`
-   Responsive layout (mobile-first)
-   Charts for health data
-   AI assistant popup with chat log

---

# Mobile app - React native

![React Native](https://img.shields.io/badge/React%20Native-0.79.2-blue.svg)
![Expo](https://img.shields.io/badge/Expo-53.0.0-green.svg)
![Expo Router](https://img.shields.io/badge/Expo%20Router-5.x-purple.svg)

## 🧰 Technologies Used

| Tech/Library                                                                            | Purpose                                 |
| --------------------------------------------------------------------------------------- | --------------------------------------- |
| [React Native 0.79](https://reactnative.dev/)                                           | Mobile UI framework                     |
| [Expo 53](https://expo.dev/)                                                            | Toolchain for faster mobile development |
| [Expo Router 5](https://expo.github.io/router)                                          | File-based routing for mobile apps      |
| [Axios](https://axios-http.com/)                                                        | HTTP client                             |
| [React Redux](https://redux-toolkit.js.org/)                                            | State management                        |
| [Socket.IO](https://socket.io/)                                                         | Real-time messaging                     |
| [Expo Image Picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)             | Upload avatars and documents            |
| [React Native Picker Select](https://github.com/lawnstarter/react-native-picker-select) | Custom dropdowns                        |

## ⚙️ Requirements

-   **Node.js** >= 18.x
-   **npm** >= 9.x
-   **Expo CLI** installed globally:
    ```bash
    npm install -g expo-cli
    ```
-   Android Studio / Xcode (for physical or emulator testing)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/DungNguyen1702/MedEase.git

cd mobile
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root folder based on `.env.example`:

```env
EXPO_PUBLIC_API_URL=
EXPO_PUBLIC_WEB_URL=
EXPO_PUBLIC_API_ROOT_REDIRECT_URL=
EXPO_PUBLIC_API_AI_URL=
```

> ⚠️ Make sure to restart Expo after changing `.env`.

## 📱 Running the App

### Start in development mode:

```bash
npm run start
```

Then:

-   Press `a` to open on Android emulator
-   Press `i` to open on iOS simulator (macOS only)
-   Scan QR code using the Expo Go app (iOS/Android)

## 🧪 Running Tests

```bash
npm run test
```

> Uses `jest-expo` preset for unit and snapshot testing.

## 📁 Folder Structure

```
mobile/
├── api/                 # Calling api from backend
├── app/                 # Screens and routes (Expo Router)
├── assets/              # Containing images, fonts, icons
├── components/          # Shared UI components
├── constants/           # Global constants
├── data/                # Containing fake data using when developing
├── hooks/               # Redefined function in react native
├── redux/               # Redux
├── utils/               # Validators, formatters, etc.
└── app.json             # Expo config
```

## 🔐 Authentication

-   Token-based authentication with Bearer tokens
-   Token stored in secure local storage
-   Role-based routing via guards

## 🔄 API Integration

-   RESTful endpoints using Axios
-   Supports image upload with `FormData`
-   Real-time chat using Socket.IO

---

# 🐳 Docker Compose – MedEase System

This guide explains how to run the full **MedEase** system using Docker Compose, including:

-   `backend` (NestJS + MongoDB or MySQL)
-   `frontend` (React + Vite)
-   `flask-api` (AI service using Flask)

## 📦 Prerequisites

Make sure you have the following installed:

-   [Docker](https://docs.docker.com/get-docker/)
-   [Docker Compose](https://docs.docker.com/compose/install/) (usually included with Docker)

## 📁 Project Structure

Your folder layout should look like this:

```
MedEase/
├── backend/
│   └── Dockerfile
├── frontend/
│   └── Dockerfile
├── AI/                 ← Flask API service
│   └── Dockerfile
├── docker-compose.yml
└── .env                ← optional
```

## 🛠️ `docker-compose.yml`

```yaml
version: "3"

services:
    backend:
        container_name: medease-backend
        build: ./backend
        ports:
            - "8001:8001"
        networks:
            - medease-net

    frontend:
        container_name: medease-frontend
        build: ./frontend
        ports:
            - "3000:5173"
        environment:
            - HOST=0.0.0.0
        networks:
            - medease-net

    flask-api:
        container_name: flask-api
        build: ./AI
        ports:
            - "5000:5000"
        networks:
            - medease-net

networks:
    medease-net:
```

> ✅ Make sure all `Dockerfile` paths exist and are correctly set up (especially `EXPOSE`, `CMD`, and working directory).

## 🚀 How to Run

From the root directory, run:

```bash
docker compose up --build
```

This will:

-   Build and start all services (`backend`, `frontend`, `flask-api`)
-   Expose the following ports:
    -   Frontend (React): `http://localhost:3000`
    -   Backend (NestJS): `http://localhost:8001`
    -   Flask API (AI): `http://localhost:5000`

## 🛑 How to Stop

```bash
docker compose down
```

To rebuild from scratch:

```bash
docker compose down -v --remove-orphans
docker compose up --build
```

## 📝 Notes

-   Your services can communicate with each other via internal Docker DNS:
    -   `backend` → `http://flask-api:5000`
    -   `frontend` → `http://backend:8001`
-   Be sure to **match your frontend `.env`** API URLs to the container name (`http://backend:8001`, not `localhost`).

---

# 🖼️ UI Demo

## 🌐 Website Screenshots

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">

  <div style="display: flex; justify-content: center; align-items: center; overflow: hidden; height: 200px; border: 1px solid #ccc; border-radius: 8px;">
    <img src="/demo/website/1.png" alt="Website Demo 1" style="max-width: 100%; max-height: 100%;">
  </div>
  <div style="display: flex; justify-content: center; align-items: center; overflow: hidden; height: 200px; border: 1px solid #ccc; border-radius: 8px;">
    <img src="/demo/website/2.png" alt="Website Demo 2" style="max-width: 100%; max-height: 100%;">
  </div>
  <div style="display: flex; justify-content: center; align-items: center; overflow: hidden; height: 200px; border: 1px solid #ccc; border-radius: 8px;">
    <img src="/demo/website/3.png" alt="Website Demo 3" style="max-width: 100%; max-height: 100%;">
  </div>
  <div style="display: flex; justify-content: center; align-items: center; overflow: hidden; height: 200px; border: 1px solid #ccc; border-radius: 8px;">
    <img src="/demo/website/4.png" alt="Website Demo 4" style="max-width: 100%; max-height: 100%;">
  </div>
  <div style="display: flex; justify-content: center; align-items: center; overflow: hidden; height: 200px; border: 1px solid #ccc; border-radius: 8px;">
    <img src="/demo/website/5.png" alt="Website Demo 5" style="max-width: 100%; max-height: 100%;">
  </div>
  <div style="display: flex; justify-content: center; align-items: center; overflow: hidden; height: 200px; border: 1px solid #ccc; border-radius: 8px;">
    <img src="/demo/website/6.png" alt="Website Demo 6" style="max-width: 100%; max-height: 100%;">
  </div>
  <div style="display: flex; justify-content: center; align-items: center; overflow: hidden; height: 200px; border: 1px solid #ccc; border-radius: 8px;">
    <img src="/demo/website/7.png" alt="Website Demo 7" style="max-width: 100%; max-height: 100%;">
  </div>
  <div style="display: flex; justify-content: center; align-items: center; overflow: hidden; height: 200px; border: 1px solid #ccc; border-radius: 8px;">
    <img src="/demo/website/8.png" alt="Website Demo 8" style="max-width: 100%; max-height: 100%;">
  </div>
  <div style="display: flex; justify-content: center; align-items: center; overflow: hidden; height: 200px; border: 1px solid #ccc; border-radius: 8px;">
    <img src="/demo/website/9.png" alt="Website Demo 9" style="max-width: 100%; max-height: 100%;">
  </div>
  <div style="display: flex; justify-content: center; align-items: center; overflow: hidden; height: 200px; border: 1px solid #ccc; border-radius: 8px;">
    <img src="/demo/website/10.png" alt="Website Demo 10" style="max-width: 100%; max-height: 100%;">
  </div>
  <div style="display: flex; justify-content: center; align-items: center; overflow: hidden; height: 200px; border: 1px solid #ccc; border-radius: 8px;">
    <img src="/demo/website/11.png" alt="Website Demo 11" style="max-width: 100%; max-height: 100%;">
  </div>
  <div style="display: flex; justify-content: center; align-items: center; overflow: hidden; height: 200px; border: 1px solid #ccc; border-radius: 8px;">
    <img src="/demo/website/12.png" alt="Website Demo 12" style="max-width: 100%; max-height: 100%;">
  </div>

</div>

---

## 📱 Mobile Screenshots

<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">

  <div style="display: flex; justify-content: center; align-items: center; overflow: hidden; height: 200px; border: 1px solid #ccc; border-radius: 8px;">
    <img src="/demo/mobile/1.jpg" alt="Mobile Demo 1" style="width=200">
  </div>
  <div style="display: flex; justify-content: center; align-items: center; overflow: hidden; height: 200px; border: 1px solid #ccc; border-radius: 8px;">
    <img src="/demo/mobile/2.jpg" alt="Mobile Demo 2" style="width=200">
  </div>
  <div style="display: flex; justify-content: center; align-items: center; overflow: hidden; height: 200px; border: 1px solid #ccc; border-radius: 8px;">
    <img src="/demo/mobile/3.jpg" alt="Mobile Demo 3" style="width=200">
  </div>
  <div style="display: flex; justify-content: center; align-items: center; overflow: hidden; height: 200px; border: 1px solid #ccc; border-radius: 8px;">
    <img src="/demo/mobile/4.jpg" alt="Mobile Demo 4" style="width=200">
  </div>
  <div style="display: flex; justify-content: center; align-items: center; overflow: hidden; height: 200px; border: 1px solid #ccc; border-radius: 8px;">
    <img src="/demo/mobile/5.jpg" alt="Mobile Demo 5" style="width=200">
  </div>
  <div style="display: flex; justify-content: center; align-items: center; overflow: hidden; height: 200px; border: 1px solid #ccc; border-radius: 8px;">
    <img src="/demo/mobile/6.jpg" alt="Mobile Demo 6" style="width=200">
  </div>
  <div style="display: flex; justify-content: center; align-items: center; overflow: hidden; height: 200px; border: 1px solid #ccc; border-radius: 8px;">
    <img src="/demo/mobile/7.jpg" alt="Mobile Demo 7" style="width=200">
  </div>
  <div style="display: flex; justify-content: center; align-items: center; overflow: hidden; height: 200px; border: 1px solid #ccc; border-radius: 8px;">
    <img src="/demo/mobile/8.jpg" alt="Mobile Demo 8" style="width=200">
  </div>
  <div style="display: flex; justify-content: center; align-items: center; overflow: hidden; height: 200px; border: 1px solid #ccc; border-radius: 8px;">
    <img src="/demo/mobile/9.jpg" alt="Mobile Demo 9" style="width=200">
  </div>
  <div style="display: flex; justify-content: center; align-items: center; overflow: hidden; height: 200px; border: 1px solid #ccc; border-radius: 8px;">
    <img src="/demo/mobile/10.jpg" alt="Mobile Demo 10" style="width=200">
  </div>
  <div style="display: flex; justify-content: center; align-items: center; overflow: hidden; height: 200px; border: 1px solid #ccc; border-radius: 8px;">
    <img src="/demo/mobile/11.jpg" alt="Mobile Demo 11" style="width=200">
  </div>
  <div style="display: flex; justify-content: center; align-items: center; overflow: hidden; height: 200px; border: 1px solid #ccc; border-radius: 8px;">
    <img src="/demo/mobile/12.jpg" alt="Mobile Demo 12" style="width=200">
  </div>
  <div style="display: flex; justify-content: center; align-items: center; overflow: hidden; height: 200px; border: 1px solid #ccc; border-radius: 8px;">
    <img src="/demo/mobile/13.jpg" alt="Mobile Demo 13" style="width=200">
  </div>
  <div style="display: flex; justify-content: center; align-items: center; overflow: hidden; height: 200px; border: 1px solid #ccc; border-radius: 8px;">
    <img src="/demo/mobile/14.jpg" alt="Mobile Demo 14" style="width=200">
  </div>
  <div style="display: flex; justify-content: center; align-items: center; overflow: hidden; height: 200px; border: 1px solid #ccc; border-radius: 8px;">
    <img src="/demo/mobile/15.jpg" alt="Mobile Demo 15" style="width=200">
  </div>

</div>
