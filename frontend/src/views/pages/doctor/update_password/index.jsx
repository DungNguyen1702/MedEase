import { useState } from "react"
import { EyeInvisibleOutlined, EyeOutlined, LockOutlined } from "@ant-design/icons"
import "./index.scss";
import { toast } from "react-toastify";
import { accountAPI } from "../../../../api/accountAPI";

export default function ChangePassword() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { currentPassword, newPassword, confirmPassword } = formData;

    console.log(currentPassword, newPassword, confirmPassword);
    
    if (!currentPassword || !newPassword || !confirmPassword) {
        toast.error("Vui lòng điền đầy đủ thông tin.");
        return;
    }

    if (newPassword !== confirmPassword) {
        toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp.");
        return;
    }

    try {
        await accountAPI.updatePassword({
        oldPassword : currentPassword,
        newPassword,
        confirmPassword,
        });

        toast.success("Đã đổi mật khẩu thành công.");
        window.history.back();
    } catch (error) {
        toast.error(
        error.response?.data?.message ||
            "Có lỗi xảy ra trong quá trình thay đổi mật khẩu."
        );
    }
  };


  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <>
      <div className="change-password__container">
        <div className="change-password__card">
          <div className="change-password__header">
            <div className="change-password__header-icon">
              <LockOutlined />
            </div>
            <h1 className="change-password__header-title">Thay đổi mật khẩu</h1>
            <p className="change-password__header-description">Nhập mật khẩu hiện tại và mật khẩu mới để thay đổi</p>
          </div>

          <form onSubmit={handleSubmit} className="change-password__form">
            <div className="change-password__field">
              <label htmlFor="current-password" className="change-password__field-label">
                Mật khẩu hiện tại
              </label>
              <div className="change-password__field-input-wrapper">
                <input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                  className="change-password__field-input"
                  required
                />
                <button
                  type="button"
                  className="change-password__field-toggle"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                </button>
              </div>
            </div>

            <div className="change-password__field">
              <label htmlFor="new-password" className="change-password__field-label">
                Mật khẩu mới
              </label>
              <div className="change-password__field-input-wrapper">
                <input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange("newPassword", e.target.value)}
                  className="change-password__field-input"
                  required
                />
                <button
                  type="button"
                  className="change-password__field-toggle"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                </button>
              </div>
            </div>

            <div className="change-password__field">
              <label htmlFor="confirm-password" className="change-password__field-label">
                Xác nhận mật khẩu mới
              </label>
              <div className="change-password__field-input-wrapper">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className="change-password__field-input"
                  required
                />
                <button
                  type="button"
                  className="change-password__field-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                </button>
              </div>
            </div>

            <div className="change-password__actions">
              <button type="button" className="change-password__actions-cancel">
                Hủy
              </button>
              <button type="submit" className="change-password__actions-submit">
                Cập nhật
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
