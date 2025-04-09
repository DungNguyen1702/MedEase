import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import { Colors } from "@/constants/Colors";

type Slide = {
  key: string;
  title: string;
  text: string;
  img: any;
};

export default function Slider() {
  const slides: Slide[] = [
    {
      key: "slide1",
      title: "Slide 1",
      text: "Description for slide 1",
      img: require("@/assets/images/slide/first_slide.png"),
    },
    {
      key: "slide2",
      title: "Slide 2",
      text: "Description for slide 2",
      img: require("@/assets/images/slide/second_slide.png"),
    },
    {
      key: "slide3",
      title: "Slide 3",
      text: "Description for slide 3",
      img: require("@/assets/images/slide/third_slide.png"),
    },
  ];

  const [showRealApp, setShowRealApp] = useState(false);

  const handleDone = () => {
    setShowRealApp(true);
  };

  useEffect(() => {
    if (showRealApp) {
      const timer = setTimeout(() => {
        setShowRealApp(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showRealApp]);

  const renderSlides = ({ item }: { item: Slide }) => {
    return (
      <View style={styles.slideContainer}>
        <Image source={item.img} style={styles.img} resizeMode="cover" />
      </View>
    );
  };

  return (
    <AppIntroSlider
      data={slides}
      renderItem={renderSlides}
      onDone={handleDone}
      showNextButton={false}
      showDoneButton={false}
      dotStyle={styles.dotStyle}
      activeDotStyle={styles.activeDotStyle}
    />
  );
}

const styles = StyleSheet.create({
  slideContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    width: "100%",
    height: 200,
  },
  dotStyle: {
    backgroundColor: Colors.light.main,
    width: 4,
    height: 4,
    borderRadius: 5,
    marginHorizontal: 4,
    marginTop: 20,
  },
  activeDotStyle: {
    backgroundColor: Colors.primary.main,
    width: 6,
    height: 6,
    borderRadius: 7,
    marginHorizontal: 4,
    marginTop: 20,
  },
});
