import { Link, useLocation, useNavigate } from "react-router-dom";
import "./index.scss";
import { IMAGES } from "../../../constants/images";
import { useEffect, useState } from "react";
import ButtonComponent from "../../ButtonComponent";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../context/AuthContext";
import { Dropdown, Menu, Avatar } from "antd";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { account, logout } = useAuth();

  const [activeSection, setActiveSection] = useState("");

  const doctorLinks = [
    { link: "/doctor/dashboard", title: "Trang chủ" },
    { link: "/doctor/room", title: "Khám bệnh" },
    { link: "/doctor/patient", title: "Bệnh nhân" },
    { link: "/doctor/question", title: "Câu hỏi" },
  ];

  const guestLinks = [
    { link: "/homepage#home", title: "Trang chủ", section: "home" },
    { link: "/homepage#about", title: "Giới thiệu", section: "about" },
    { link: "/homepage#contact", title: "Liên hệ", section: "contact" },
  ];

  const onClickLogin = () => {
    navigate("/auth/login");
  };

  const onClickRegister = () => {
    navigate("/auth/register");
  };

  useEffect(() => {
    const sections = document.querySelectorAll("section");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.6 }
    );

    sections.forEach((section) => observer.observe(section));

    const handleScroll = () => {
      if (window.scrollY === 0) {
        setActiveSection("home");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Menu cho dropdown
  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={() => navigate("/profile")}>
        Thay đổi thông tin
      </Menu.Item>
      <Menu.Item key="2" onClick={() => navigate("/change-password")}>
        Thay đổi mật khẩu
      </Menu.Item>
      <Menu.Item key="3" onClick={logout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
        progress={undefined}
        theme="colored"
      />
      <header className="header">
        <div className="header-background-color"></div>
        <img src={IMAGES.darkLogo} alt="Logo" className="logo" />
        <div className="d-flex justify-content-between align-items-center">
          <nav className="nav">
            {account && account.role === "doctor"
              ? doctorLinks.map(({ link, title }) => (
                  <a
                    key={link}
                    href={link}
                    className={`header-menu-item ${
                      location.pathname === link
                        ? "header-menu-item-selected"
                        : ""
                    }`}
                  >
                    {title}
                  </a>
                ))
              : guestLinks.map(({ link, title, section }) => (
                  <a
                    key={link}
                    href={link}
                    className={`header-menu-item ${
                      activeSection === section
                        ? "header-menu-item-selected"
                        : ""
                    }`}
                  >
                    {title}
                  </a>
                ))}
          </nav>
          <div className="divider" />
          <div className="authButtons">
            {account ? (
              <Dropdown overlay={menu} trigger={["hover"]}>
                <div className="user-info d-flex align-items-center">
                  <Avatar
                    src={account.avatar || IMAGES.defaultAvatar}
                    alt="Avatar"
                  />
                  <span className="user-name">{account.name}</span>
                </div>
              </Dropdown>
            ) : (
              <>
                <ButtonComponent
                  onClick={onClickLogin}
                  className={""}
                  content={<p className="button-content-text">Đăng nhập</p>}
                />
                <ButtonComponent
                  onClick={onClickRegister}
                  className={""}
                  content={<p className="button-content-text">Đăng kí</p>}
                />
              </>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
