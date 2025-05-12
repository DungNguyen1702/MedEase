const Slide = ({ backgroundImage }: any) => {
  console.log("backgroundImage", backgroundImage);

  return (
    <div className="swiper-slide">
      <div
        className="background"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>
    </div>
  );
};

export default Slide;
