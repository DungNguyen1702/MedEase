import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Pagination } from "swiper/modules"; // Xóa Mousewheel khỏi modules
import "swiper/swiper-bundle.css";
import Slide from "../slides";
import "./index.scss";
import { IMAGES } from "../../constants/images";

const SwiperContainer = () => {
  const swiperRef = useRef(null);

  const slidesData = [IMAGES.Slide1, IMAGES.Slide2, IMAGES.Slide3];

  return (
    <div className="swiper-container" ref={swiperRef}>
      <Swiper
        direction="horizontal"
        effect="fade"
        speed={1000}
        loop={true}
        pagination={{
          clickable: true,
        }}
        modules={[EffectFade, Pagination]}
        onSlideChange={(swiper) => {
          swiper.slides.forEach((slide) => {
            if (slide && slide.querySelector) {
              const background = slide.querySelector(".background");
              if (background) {
                background.classList.remove("animation");
              }
            }
          });

          const activeSlide = swiper.slides[swiper.activeIndex];
          if (activeSlide && activeSlide.querySelector) {
            const background = activeSlide.querySelector(".background");
            if (background) {
              background.classList.add("animation");
            }
          }
        }}
      >
        {slidesData.map((slide, index) => (
          <SwiperSlide key={index}>
            <Slide backgroundImage={slide} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SwiperContainer;
