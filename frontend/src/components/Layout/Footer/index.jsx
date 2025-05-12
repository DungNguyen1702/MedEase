import "./index.scss";
import { IMAGES } from "../../../constants/images";
import "bootstrap/dist/css/bootstrap.min.css";
import { ICONS } from "../../../constants/icons";

function Footer() {
  const logo = [];

  return (
    <footer className="footer">
      <div className="footerContent">
        <div className="footerBrand">
          <img src={IMAGES.lightLogo} alt="Logo" className="footerLogo" />
          <div className="d-flex flex-column align-items-center m-3">
            <h3>MedEase</h3>
            <p>"Smart health - Easy access"</p>
          </div>
          <p>
            Sức khỏe thông minh - Chăm sóc dễ dàng! Hãy trao niềm tin cho
            MedEase, vì ngày mai của bạn xứng đáng được bảo vệ tốt nhất!
          </p>
        </div>

        <div className="footerConnect d-flex flex-column align-items-center">
          <h3 className="text-center">Liên hệ với chúng tôi thông qua</h3>
          <div className="socialLinks">
            <img
              key={1}
              src={ICONS.TiktokLogo}
              alt="Social"
              className="socialIcon"
            />
            <img
              key={2}
              src={ICONS.YoutubeLogo}
              alt="Social"
              className="socialIcon"
            />
            <img
              key={3}
              src={ICONS.InsLogo}
              alt="Social"
              className="socialIcon"
            />
            <img
              key={4}
              src={ICONS.FacebookLogo}
              alt="Social"
              className="socialIcon"
            />
          </div>

          <h3 className="text-center mt-5">Tải ứng dụng điện thoại</h3>
          <div className="appStoreButtons">
            <button className="appStoreButton">
              <img src={ICONS.AppleStore} alt="Apple Store" />
              <div>
                <span>tải ngay tại</span>
                <span>Apple store</span>
              </div>
            </button>
            <button className="appStoreButton">
              <img src={ICONS.GooglePlay} alt="Google Play" />
              <div>
                <span>tải ngay tại</span>
                <span className="googlePlay">Google play</span>
              </div>
            </button>
          </div>
        </div>

        <div className="footerContact">
          <div className="contactInfo">
            <img
              src={ICONS.PhoneBlue}
              alt="Phone"
              className="contactInfoIcon"
            />
            <p>
              <span className="font-weight-bold">Số điện thoại :</span>{" "}
              <span>1900 1234 (Miễn phí 24/7)</span>
            </p>
          </div>
          <div className="contactInfo">
            <img
              src={ICONS.HouseBlue}
              alt="Address"
              className="contactInfoIcon"
            />
            <div>
              <p className="">
                <span className="font-weight-bold">Địa chỉ : </span>
                <span>
                  Tòa nhà Innovate, Số 123 Đường Y Tế, Thạc Gián, Thanh Khê, Đà
                  Nẵng
                </span>
              </p>
            </div>
          </div>
          <div className="contactInfo">
            <img src={ICONS.MailBlue} alt="Email" className="contactInfoIcon" />
            <p>
              <span className="font-weight-bold">Email : </span>{" "}
              <span>support@medease.vn</span>
            </p>
          </div>
          {/* <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/d2352a9dd52b1f49e9b97ec01183effa6a7605ce?placeholderIfAbsent=true&apiKey=9bbc0d0940f940ec858c72cb2898fc2c"
            alt="Certificate"
            className="certificate"
          /> */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1734.7138936085928!2d108.14748719839477!3d16.0736606!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314218d68dff9545%3A0x714561e9f3a7292c!2sDa%20Nang%20University%20of%20Science%20and%20Technology!5e1!3m2!1sen!2s!4v1746839670220!5m2!1sen!2s"
            // width="600"
            // height="450"
            className="certificate"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
