import Header from "../Header";
import Footer from "../Footer";
import "./index.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "swiper/swiper-bundle.css";

function MainLayout({ children, isFooter = true }) {
  return (
    <div className="main-content-container">
      <Header />
      <div className="main-content">{children}</div>
      {isFooter && <Footer />}
    </div>
  );
}

export default MainLayout;
