import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { IMAGES } from "../../../constants/images";
import "./index.scss";
import { ICONS } from "../../../constants/icons";
import ButtonComponent from "../../../components/ButtonComponent";
import InputComponent from "../../../components/InputComponent";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
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
    <div className="register-container">
      <div className="register-content">
        <div className="register-form-container">
          <form className="register-form">
            <div className="register-form-title">Đăng kí</div>
            <div className="register-form-subtitle font-italic">
              Vui lòng nhập thông tin đăng kí để tiếp tục
            </div>

            <label className="register-input-label font-weight-bold">
              Email
            </label>
            <InputComponent
              placeholder="Nhập email"
              value={username}
              setValue={setUsername}
              type="text"
              className="register-input"
            />

            <label className="register-input-label font-weight-bold">Tên</label>
            <InputComponent
              placeholder="Nhập tên của bạn"
              value={name}
              setValue={setName}
              type="text"
              className="register-input"
            />

            <label className="register-input-label font-weight-bold">
              Mật khẩu
            </label>
            <InputComponent
              placeholder="Nhập mật khẩu"
              value={password}
              setValue={setPassword}
              type="password"
              className="register-input"
            />

            <label className="register-input-label font-weight-bold">
              Xác nhận mật khẩu
            </label>
            <InputComponent
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              setValue={setConfirmPassword}
              type="password"
              className="register-input"
            />

            <div className="d-flex justify-content-center align-items-center">
              <ButtonComponent
                className="register-submit-btn"
                content={
                  <p
                    className="button-content-text"
                    style={{ fontSize: "20px" }}
                  >
                    Đăng kí
                  </p>
                }
                onClick={handleLogin}
                styleButton="dark"
              />
            </div>

            <div className="register-register-text">
              <span>Đã có tài khoản ? </span>
              <span className="register-link" onClick={handleRegister}>
                Đăng nhập
              </span>
            </div>

            <div className="register-divider-container">
              <div className="register-divider-line" />
              <div>Hoặc</div>
              <div className="register-divider-line" />
            </div>

            <div className="register-social-btn" onClick={handleGoogleLogin}>
              <img src={ICONS.Google} alt="Google Icon" />
              <div className="register-social-btn-text">
                Tiếp tục với Google
              </div>
            </div>

            <div className="register-social-btn" onClick={handleFacebookLogin}>
              <img src={ICONS.FacebookLogo} alt="Facebook Icon" />
              <div className="register-social-btn-text">
                Tiếp tục với Facebook
              </div>
            </div>
          </form>
        </div>
        <div className="register-right-column">
          <div className="register-banner">
            <img
              src={IMAGES.RegisterBanner}
              alt="register Banner"
              className="register-banner-image"
            />
            <div className="register-banner-overlay">
              <div className="register-logo-container">
                <img
                  src={IMAGES.darkLogo}
                  alt="MedEase Logo"
                  className="register-logo"
                />
                <div className="register-brand">MedEase</div>
              </div>
              <div className="register-welcome">Chào mừng bạn!</div>
              <div className="register-divider" />
              <div className="register-subtitle">
                " Chỉ mất 1 phút để đăng ký, giúp bạn dễ dàng theo dõi tình
                trạng sức khỏe mọi lúc, mọi nơi Tạo tài khoản để đặt lịch khám,
                lưu hồ sơ sức khỏe và nhận tư vấn từ bác sĩ "
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
