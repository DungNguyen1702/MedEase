import React from "react";
import "./VerifyRegister.css";
import { useNavigate } from "react-router-dom";

// Using simple icon components instead of @ant-design/icons to avoid dependency issues
const CheckCircleIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
  </svg>
);

const SmartphoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H7V6h10v10z" />
  </svg>
);

function VerifyRegister() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/auth/login");
  };

  // This component is used to display a success message after registration
  return (
    <div className="verify-container">
      <div className="verify-card">
        <div className="icon-container">
          <CheckCircleIcon className="success-icon" />
        </div>

        <h1 className="title">Đăng ký thành công!</h1>

        <div className="message-container">
          <p className="main-message">
            Cảm ơn bạn đã tin tưởng sử dụng dịch vụ của chúng tôi. Vui lòng tải
            app về và đăng nhập vào sử dụng.
          </p>
        </div>

        <div className="action-container">
          <button className="download-btn" onClick={handleLoginClick}>
            Đăng nhập bằng tài khoản bác sĩ và quản trị viên
          </button>
          <button className="download-btn">
            <DownloadIcon />
            Tải ứng dụng
          </button>

          <div className="app-links">
            <div className="app-link">
              <SmartphoneIcon />
              <span>iOS App Store</span>
            </div>
            <div className="app-link">
              <SmartphoneIcon />
              <span>Google Play Store</span>
            </div>
          </div>
        </div>

        <div className="footer-text">
          <p>Bạn sẽ nhận được email xác nhận trong vài phút tới.</p>
        </div>
      </div>
    </div>
  );
}

export default VerifyRegister;
