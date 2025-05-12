import "./index.scss";
import SwiperContainer from "../../../components/swiper-container";
import DoctorCard from "./components/DoctorCard";
import FakeData from "../../../data/FakeData.json";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  A11y,
  EffectFade,
  Mousewheel,
  Navigation,
  Pagination,
  Scrollbar,
} from "swiper/modules";
import "swiper/swiper-bundle.css";
import SpecCard from "./components/SpecCard";
import { IMAGES } from "../../../constants/images";
import "bootstrap/dist/css/bootstrap.min.css";

const HomePage = () => {
  const doctors = FakeData.doctors;
  const specs = FakeData.specializations;

  return (
    <div className="homePage">
      <section className="hero" id="home">
        <SwiperContainer />
      </section>

      <section className="doctors">
        <h2 className="sectionTitle">Các bác sĩ hàng đầu trong bệnh viện</h2>
        <div className="doctorGrid">
          <Swiper
            modules={[Scrollbar, A11y, Mousewheel]}
            spaceBetween={100}
            slidesPerView={4}
            mousewheel={{ forceToAxis: true }}
            style={{ padding: "20px" }}
          >
            {doctors &&
              doctors.length > 0 &&
              doctors.map((doctor) => (
                <SwiperSlide key={doctor._id}>
                  <DoctorCard value={doctor} />
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </section>

      <section className="departments">
        <h2 className="sectionTitle">Các chuyên khoa có trong bệnh viện</h2>
        <div className="departmentGrid">
          <Swiper
            modules={[Scrollbar, A11y, Mousewheel]}
            spaceBetween={100}
            slidesPerView={4} // số lượng hiển thị trên 1 màn hình
            mousewheel={{ forceToAxis: true }}
            style={{ padding: "20px" }}
          >
            {specs &&
              specs.length > 0 &&
              specs.map((spec) => (
                <SwiperSlide key={spec._id}>
                  <SpecCard value={spec} />
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </section>

      <section className="about" id="about">
        <div className="aboutContent">
          <img src={IMAGES.About} alt="About" className="aboutImage" />
          <div className="aboutText">
            <h2 className="aboutTitle">Giới thiệu</h2>
            <h4 className="aboutSubTitle">
              "MedEase - Sức Khỏe Thông Minh, Tiện Ích Mọi Lúc!"
            </h4>
            <p className="font-italic text-align-center">
              Chúng tôi tin rằng tiếp cận y tế chất lượng không phải là đặc
              quyền, mà là nhu cầu thiết yếu của mọi người. MedEase ra đời với
              sứ mệnh kết nối bạn đến các dịch vụ chăm sóc sức khỏe nhanh chóng,
              minh bạch và cá nhân hóa. Từ đặt lịch khám trực tuyến, theo dõi
              sức khỏe đến tư vấn y tế 24/7, tất cả chỉ cách một chạm. Hãy để
              MedEase đồng hành cùng bạn trên hành trình bảo vệ sức khỏe toàn
              diện!
            </p>
          </div>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="contactContent">
          <div className="contactText">
            <h2 className="aboutTitle">Liên lạc</h2>
            <h4 className="aboutSubTitle">
              "Kết Nối Với MedEase - Chúng Tôi Luôn Lắng Nghe!"
            </h4>
            <p className="text-align-center">
              Dù bạn cần hỗ trợ kỹ thuật, góp ý về dịch vụ hay hợp tác cùng
              chúng tôi, đội ngũ MedEase sẵn sàng phản hồi bạn trong thời gian
              sớm nhất. Liên hệ ngay qua:
            </p>
            <ul className="font-italic">
              <li>
                <span className="font-weight-bold">Số điện thoại :</span>{" "}
                <span>1900 1234 (Miễn phí 24/7)</span>
              </li>
              <li>
                <span className="font-weight-bold">Địa chỉ : </span>
                <span>
                  Tòa nhà Innovate, Số 123 Đường Y Tế, Thạc Gián, Thanh Khê, Đà
                  Nẵng
                </span>
              </li>
              <li>
                <span className="font-weight-bold">Email : </span>{" "}
                <span>support@medease.vn</span>
              </li>
            </ul>
            <p className="font-weight-bold">
              Sức khỏe của bạn là ưu tiên của chúng tôi!
            </p>
          </div>
          <img src={IMAGES.Contact} alt="Contact" className="contactImage" />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
