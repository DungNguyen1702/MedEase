import { useState } from "react";
import axios from "axios"; // Import axios
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axiosClient from "@/utils/axios-custome";

function App() {
  const [count, setCount] = useState(0);

  const onClick = async () => {
    try {
      // Gọi API login
      const response = await axiosClient.application.post("/auth/login", {
        email: "patient1@medease.com",
        password: "12345678",
      });

      // Xử lý kết quả trả về
      console.log("Login successful:", response.data);
      alert("Login successful!");
    } catch (error) {
      // Xử lý lỗi
      console.error("Login failed:", error);
      alert(
        "Login failed: " + (error.response?.data?.message || error.message)
      );
    }

    setCount(count + 1);
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={onClick}>count is {count}</button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
