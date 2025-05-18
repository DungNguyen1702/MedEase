import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { IMAGES } from "../../../constants/images";
import "./index.scss";
import { ICONS } from "../../../constants/icons";
import ButtonComponent from "../../../components/ButtonComponent";
import InputComponent from "../../../components/InputComponent";
import { AuthAPI } from "../../../api/authAPI";
import { toast } from "react-toastify";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("doctor1@medease.com");
  const [password, setPassword] = useState("12345678");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const repsponse = await AuthAPI.login(username, password);

      const { access_token, message, ...userData } = repsponse.data;

      if (repsponse.status === 201) {
        await login(userData, access_token);

        if (repsponse.data.role === "doctor") {
          navigate("/doctor/dashboard");
        } else if (repsponse.data.role === "admin") {
          navigate("/admin/dashboard");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message[0].message || "Đăng nhập thất bại"
      );
    }
  };

  const handleForgotPassword = () => {
    navigate("/auth/forgot-password");
  };

  const handleRegister = () => {
    navigate("/auth/register");
  };

  const handleGoogleLogin = () => {
    // Implement Google login
    console.log("Google login clicked");
  };

  const handleFacebookLogin = () => {
    console.log("Facebook login clicked");
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-left-column">
          <div className="login-banner">
            <img
              src={IMAGES.LoginBanner}
              alt="Login Banner"
              className="login-banner-image"
            />
            <div className="login-banner-overlay">
              <div className="login-logo-container">
                <img
                  src={IMAGES.lightLogo}
                  alt="MedEase Logo"
                  className="login-logo"
                />
                <div className="login-brand">MedEase</div>
              </div>
              <div className="login-welcome">Chào mừng bạn trở lại!</div>
              <div className="login-divider" />
              <div className="login-subtitle">
                " Đăng nhập để tiếp tục hành trình chăm sóc sức khỏe "
              </div>
            </div>
          </div>
        </div>

        <div className="login-form-container">
          <form className="login-form">
            <div className="login-form-title">Đăng nhập</div>
            <div className="login-form-subtitle font-italic">
              Vui lòng nhập thông tin đăng nhập để tiếp tục
            </div>

            <label className="login-input-label font-weight-bold">Email</label>
            <InputComponent
              placeholder="Nhập email"
              value={username}
              setValue={setUsername}
              type="text"
              className="login-input"
            />

            <label className="login-input-label font-weight-bold">
              Mật khẩu
            </label>
            <InputComponent
              placeholder="Nhập mật khẩu"
              value={password}
              setValue={setPassword}
              type="password"
              className="login-input"
            />

            <div
              className="login-forgot-password"
              onClick={handleForgotPassword}
            >
              Quên mật khẩu
            </div>

            <div className="d-flex justify-content-center align-items-center">
              <ButtonComponent
                className="login-submit-btn"
                content={
                  <p
                    className="button-content-text"
                    style={{ fontSize: "20px" }}
                  >
                    Đăng nhập
                  </p>
                }
                onClick={handleLogin}
                styleButton="dark"
              />
            </div>

            <div className="login-register-text">
              <span>Không có tài khoản ? </span>
              <span className="register-link" onClick={handleRegister}>
                Đăng ký
              </span>
            </div>

            <div className="login-divider-container">
              <div className="login-divider-line" />
              <div>Hoặc</div>
              <div className="login-divider-line" />
            </div>

            <div className="login-social-btn" onClick={handleGoogleLogin}>
              <img src={ICONS.Google} alt="Google Icon" />
              <div className="login-social-btn-text">Tiếp tục với Google</div>
            </div>

            <div className="login-social-btn" onClick={handleFacebookLogin}>
              <img src={ICONS.FacebookLogo} alt="Facebook Icon" />
              <div className="login-social-btn-text">Tiếp tục với Facebook</div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
