import React, { useContext, useState } from "react";
import "./index.scss";
import {
  AppstoreOutlined,
  CalendarOutlined,
  CommentOutlined,
  FileSearchOutlined,
  LogoutOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router";
import AuthContext from "../../../context/AuthContext";
import Header from "../Header";
import { IMAGES } from "../../../constants/images";

const { Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem("Trang chủ", "/admin/dashboard", <AppstoreOutlined />),
  getItem("Bệnh nhân", "/admin/patient", <FileSearchOutlined />),
  getItem("Bác sĩ", "/admin/doctor", <StarOutlined />),
  getItem("Cuộc hẹn", "/admin/appointment", <CalendarOutlined />),
  getItem("Câu hỏi", "/admin/question", <CommentOutlined />),
];

function AdminLayout(props) {
  const { children, currentPage = "Trang chủ" } = props;

  const [collapsed, setCollapsed] = useState(false);

  const { logout } = useContext(AuthContext);

  const pages_url = {
    "Trang chủ": "/admin/dashboard",
    "Bệnh nhân": "/admin/patient",
    "Bác sĩ": "/admin/doctor",
    "Cuộc hẹn": "/admin/appointment",
    "Câu hỏi": "/admin/question",
  };

  const navigate = useNavigate();

  const onMenuClick = (menuItem) => {
    navigate(menuItem.key);
    // console.log(menuItem.key);
  };
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <Layout
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        className="slider-container"
      >
        <div className="sticky-siderbar-container">
          <div className={`sidebar-title-container`}>
            <div className="d-flex align-items-center justify-content-center">
              <img
                className="admin-layout-logo"
                src={IMAGES.darkLogo}
                alt="system logo"
              />
            </div>
          </div>
          <Menu
            className="slider-container"
            defaultSelectedKeys={[pages_url[currentPage]]}
            mode="inline"
            theme="light"
            items={items}
            onClick={onMenuClick}
          />
          <div className="d-flex justify-content-center">
            <Button
              className="logout-button"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              {!collapsed && "Đăng xuất"}
            </Button>
          </div>
        </div>
      </Sider>
      <Layout>
        <div
          className={`admin-layout-header-container-${
            collapsed ? "80" : "200"
          }`}
        >
          <Header />
        </div>
        <div className="admin-layout-content-container">{children}</div>
      </Layout>
    </Layout>
  );
}

export default AdminLayout;
