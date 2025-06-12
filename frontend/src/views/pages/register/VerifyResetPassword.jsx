import { useNavigate, useParams } from "react-router-dom";
import "./VerifyRegister.css";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { AuthAPI } from "../../../api/authAPI";

const MailIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
  </svg>
);

const RefreshIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
  </svg>
);

function VerifyResetPassword() {
  const { email } = useParams();
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate("/auth/login");
  };

  const handleResendEmail = async () => {
    try {
      const response = await AuthAPI.forgotPassword(email);
      console.log("Resend email response:", response);
      if (response.status === 201) {
        toast.success(
          "Email đặt lại mật khẩu đã được gửi thành công, vui lòng kiểm tra hộp thư đến của bạn."
        );
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Gửi lại email thất bại");
      console.error("Error resending email:", error);
    }
  };

  useEffect(() => {
    handleResendEmail();
  }, []);

  return (
    <div className="verify-container">
      <div className="verify-card">
        <div className="icon-container">
          <MailIcon className="primary-icon" />
        </div>

        <h1 className="title">Kiểm tra email của bạn</h1>

        <div className="message-container">
          <p className="main-message">
            Chúng tôi đã gửi liên kết đặt lại mật khẩu đến email của bạn.
          </p>
          <p className="sub-message">
            Vui lòng kiểm tra hộp thư đến và làm theo hướng dẫn để đặt lại mật
            khẩu.
          </p>
        </div>

        <div className="action-container">
          <button className="primary-btn" onClick={handleResendEmail}>
            <RefreshIcon />
            Gửi lại email
          </button>

          <button className="secondary-btn" onClick={handleBackToLogin}>
            <ArrowLeftIcon />
            Quay lại đăng nhập
          </button>
        </div>

        <div className="footer-text">
          <p>
            Không nhận được email? Kiểm tra thư mục spam hoặc thử lại sau 5
            phút.
          </p>
        </div>
      </div>
    </div>
  );
}

export default VerifyResetPassword;
