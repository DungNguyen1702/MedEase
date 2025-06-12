import { useState } from "react";
import "./VerifyRegister.css";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthAPI } from "../../../api/authAPI";

const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
  </svg>
);

const LockIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

const CloseCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
  </svg>
);

const CheckCircleLargeIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

function ResetPasswordForm() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Password validation criteria - simplified
  const hasMinLength = password.length >= 6;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const passwordsMatch = password === confirmPassword && password !== "";

  const isPasswordValid = hasMinLength && hasLetter && hasNumber;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isPasswordValid && passwordsMatch) {
      try {
        const response = await AuthAPI.verifyResetPassword(
          token,
          password,
          confirmPassword
        );
        console.log("Reset Password Response:", response);

        if (response.status === 200) {
          setSubmitted(true);
          toast.success("Đặt lại mật khẩu thành công!");
        } else {
          toast.error("Đặt lại mật khẩu không thành công, vui lòng thử lại.");
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Đặt lại mật khẩu thất bại"
        );
        console.error("Error resetting password:", error);
      }
    }
  };

  const ValidationItem = ({ isValid, text }) => (
    <div className={`validation-item ${isValid ? "valid" : "invalid"}`}>
      {isValid ? (
        <CheckCircleIcon className="validation-icon" />
      ) : (
        <CloseCircleIcon className="validation-icon" />
      )}
      <span>{text}</span>
    </div>
  );

  const navigate = useNavigate();

  const handleBackToLogin = () => {
    // Navigate back to login page
    navigate("/auth/login");
  };

  if (submitted) {
    return (
      <div className="verify-container">
        <div className="verify-card">
          <div className="icon-container">
            <CheckCircleLargeIcon className="success-icon" />
          </div>
          <h1 className="title">Đặt lại mật khẩu thành công!</h1>
          <div className="message-container">
            <p className="main-message">
              Mật khẩu của bạn đã được cập nhật. Bây giờ bạn có thể đăng nhập
              bằng mật khẩu mới.
            </p>
          </div>
          <div className="action-container">
            <button className="primary-btn" onClick={handleBackToLogin}>
              Đăng nhập ngay
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="verify-container">
      <div className="verify-card">
        <div className="icon-container">
          <LockIcon className="primary-icon" />
        </div>

        <h1 className="title">Đặt lại mật khẩu</h1>

        <div className="message-container">
          <p className="main-message">Vui lòng nhập mật khẩu mới của bạn</p>
        </div>

        <form onSubmit={handleSubmit} className="password-form">
          <div className="form-group">
            <label htmlFor="password">Mật khẩu mới</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="password-input"
                placeholder="Nhập mật khẩu mới"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="password-input"
                placeholder="Nhập lại mật khẩu mới"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {password && (
            <div className="password-validation">
              <h3>Mật khẩu phải có:</h3>
              <div className="validation-list">
                <ValidationItem isValid={hasMinLength} text="Ít nhất 6 ký tự" />
                <ValidationItem isValid={hasLetter} text="Có chứa chữ cái" />
                <ValidationItem isValid={hasNumber} text="Có chứa số" />
                {confirmPassword && (
                  <ValidationItem
                    isValid={passwordsMatch}
                    text="Mật khẩu trùng khớp"
                  />
                )}
              </div>
            </div>
          )}

          <button
            type="submit"
            className={`primary-btn ${
              !(isPasswordValid && passwordsMatch) ? "disabled" : ""
            }`}
            disabled={!(isPasswordValid && passwordsMatch)}
          >
            Xác nhận
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordForm;
