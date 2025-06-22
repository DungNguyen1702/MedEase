import { useState } from "react";
import {
    CalendarOutlined,
    CameraOutlined,
    CompassOutlined,
    MailOutlined,
    PhoneOutlined,
    UserOutlined,
} from "@ant-design/icons";
import "./index.scss";
import { useAuth } from "../../../../context/AuthContext";
import { formatDateToYYYYMMDD } from "../../../../utils/stringUtil";
import validator from "validator";
import { toast } from "react-toastify";
import { accountAPI } from "../../../../api/accountAPI";
import axios from "axios";
import axiosClient from "../../../../utils/axiosCustomize";

export default function ProfileInfo() {
    const { account, setAccount } = useAuth();

    const [formData, setFormData] = useState({
        name: account?.name || "",
        email: account?.email || "",
        tel: account?.tel || "",
        address: account?.address || "",
        gender: account?.gender || "male",
        dateOfBirth: formatDateToYYYYMMDD(account?.date_of_birth),
        avatar: account?.avatar || "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, tel, address, gender, dateOfBirth, avatar } =
            formData;

        // Validate input fields
        if (!name || !email || !tel || !address || !gender || !dateOfBirth) {
            toast.error("Vui lòng điền đầy đủ thông tin!");
            return;
        }
        if (tel.length > 10) {
            toast.error("Số điện thoại không hợp lệ!");
            return;
        }
        if (!validator.isEmail(email)) {
            toast.error("Địa chỉ email không hợp lệ!");
            return;
        }
        if (address.length > 100) {
            toast.error("Địa chỉ không hợp lệ!");
            return;
        }
        if (name.length > 100) {
            toast.error("Tên không hợp lệ!");
            return;
        }

        try {
            const submitData = new FormData();
            submitData.append("id", account._id);
            submitData.append("name", name);
            submitData.append("email", email);
            submitData.append("tel", tel);
            submitData.append("address", address);
            submitData.append("gender", gender);
            submitData.append("role", account.role);
            submitData.append("date_of_birth", dateOfBirth);
            console.log("submitData", submitData);

            console.log("avatar", avatar);

            if (avatar && avatar != account?.avatar) {
                // Nếu bạn upload file, cần chuyển đổi lại cho đúng backend
                submitData.append("avatar", avatar);
            }

            console.log("submitData", submitData);

            // Gọi API cập nhật thông tin
            axiosClient.formData.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${localStorage.getItem("access_token")}`;
            const response = await accountAPI.updateAccount(submitData);
            // dispatch(setAccount(response));
            console.log("Account updated successfully:", response.data);
            setAccount({...account, ...response.data});
            localStorage.setItem("user_info", JSON.stringify({...account, ...response.data}));

            toast.success("Thông tin cá nhân đã được cập nhật!");
        } catch (error) {
            toast.error(
                error?.response?.data?.message[0]?.message ||
                    "Đã xảy ra lỗi, vui lòng thử lại sau!"
            );
            console.error(
                "Error updating account:", error ||
                error?.response?.data?.message
            );
        }
    };

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFormData((prev) => ({ ...prev, avatar: e.target?.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCancel = () => {
        // Reset form data to original account data
        setFormData({
            name: account?.name || "",
            email: account?.email || "",
            tel: account?.tel || "",
            address: account?.address || "",
            gender: account?.gender || "male",
            dateOfBirth: formatDateToYYYYMMDD(account?.date_of_birth),
            avatar: account?.avatar || "",
        });
    };

    return (
        <>
            <div className="profile-info__container">
                <div className="profile-info__wrapper">
                    <div className="profile-info__card">
                        <div className="profile-info__header">
                            <div className="profile-info__header-avatar">
                                <div className="profile-info__header-avatar-image">
                                    <img
                                        src={
                                            formData.avatar ||
                                            "/placeholder.svg"
                                        }
                                        alt="Avatar"
                                    />
                                </div>
                                <label className="profile-info__header-avatar-upload">
                                    <CameraOutlined />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                    />
                                </label>
                            </div>
                            <h1 className="profile-info__header-title">
                                Thông tin cá nhân
                            </h1>
                            <p className="profile-info__header-description">
                                Cập nhật thông tin cá nhân của bạn
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="profile-info__form"
                        >
                            <div className="profile-info__grid">
                                <div className="profile-info__field">
                                    <label
                                        htmlFor="name"
                                        className="profile-info__field-label"
                                    >
                                        <UserOutlined />
                                        Họ và tên
                                    </label>
                                    <input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "name",
                                                e.target.value
                                            )
                                        }
                                        className="profile-info__field-input"
                                        required
                                    />
                                </div>

                                <div className="profile-info__field">
                                    <label
                                        htmlFor="email"
                                        className="profile-info__field-label"
                                    >
                                        <MailOutlined />
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "email",
                                                e.target.value
                                            )
                                        }
                                        className="profile-info__field-input"
                                        required
                                    />
                                </div>

                                <div className="profile-info__field">
                                    <label
                                        htmlFor="tel"
                                        className="profile-info__field-label"
                                    >
                                        <PhoneOutlined />
                                        Số điện thoại
                                    </label>
                                    <input
                                        id="tel"
                                        value={formData.tel}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "tel",
                                                e.target.value
                                            )
                                        }
                                        className="profile-info__field-input"
                                    />
                                </div>

                                <div className="profile-info__field">
                                    <label
                                        htmlFor="gender"
                                        className="profile-info__field-label"
                                    >
                                        <UserOutlined />
                                        Giới tính
                                    </label>
                                    <select
                                        id="gender"
                                        value={formData.gender}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "gender",
                                                e.target.value
                                            )
                                        }
                                        className="profile-info__field-select"
                                    >
                                        <option value="male">Nam</option>
                                        <option value="female">Nữ</option>
                                    </select>
                                </div>

                                <div className="profile-info__field profile-info__grid--full">
                                    <label
                                        htmlFor="dateOfBirth"
                                        className="profile-info__field-label"
                                    >
                                        <CalendarOutlined />
                                        Ngày sinh
                                    </label>
                                    <input
                                        id="dateOfBirth"
                                        type="date"
                                        value={formData.dateOfBirth}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "dateOfBirth",
                                                e.target.value
                                            )
                                        }
                                        className="profile-info__field-input"
                                    />
                                </div>

                                <div className="profile-info__field profile-info__grid--full">
                                    <label
                                        htmlFor="address"
                                        className="profile-info__field-label"
                                    >
                                        <CompassOutlined />
                                        Địa chỉ
                                    </label>
                                    <textarea
                                        id="address"
                                        value={formData.address}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "address",
                                                e.target.value
                                            )
                                        }
                                        className="profile-info__field-textarea"
                                    />
                                </div>
                            </div>

                            <div className="profile-info__actions">
                                <button
                                    type="button"
                                    className="profile-info__actions-cancel"
                                    onClick={handleCancel}
                                >
                                    Hủy thay đổi
                                </button>
                                <button
                                    type="submit"
                                    className="profile-info__actions-submit"
                                >
                                    Lưu thay đổi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
