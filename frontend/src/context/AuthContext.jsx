import { createContext, useState, useEffect, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../utils/axiosCustomize";
const AccountContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("access_token"));
  const [account, setAccount] = useState(
    JSON.parse(localStorage.getItem("user_info"))
  );
  const navigate = useNavigate();

  const login = (userData, accessToken) => {
    setToken(accessToken);
    setAccount(userData);

    // Lưu thông tin vào localStorage
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("user_info", JSON.stringify(userData));

    // Điều hướng đến trang chính (ví dụ: dashboard)
    navigate("/");
  };

  // Hàm logout
  const logout = () => {
    setToken(null);
    setAccount(null);

    // Xóa thông tin khỏi localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_info");

    // Điều hướng đến trang đăng nhập
    navigate("/auth/login");
  };

  const providerValue = useMemo(
    () => ({ token, setToken, account, setAccount }),
    [token, setToken, account, setAccount]
  );

  useEffect(() => {
    if (token !== "null") {
      axiosClient.application.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
      axiosClient.formData.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
    } else {
      delete axiosClient.application.defaults.headers.common["Authorization"];
      delete axiosClient.formData.defaults.headers.common["Authorization"];

      setAccount(null);
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_info");
    }
  }, [token]);

  return (
    <AccountContext.Provider value={{ ...providerValue, login, logout }}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AccountContext);
};

export default AccountContext;
