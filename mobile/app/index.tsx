import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  Image,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import ButtonComponent from "@/components/ButtonComponent";

const { width } = Dimensions.get("window"); // Lấy chiều rộng màn hình

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={Colors.primary.main}
        barStyle="light-content"
      />
      <View style={styles.logoContainer}>
        <Image
          source={require("@/assets/images/logo/logo_light.png")}
          style={styles.logo}
          resizeMode="cover"
        />
        <Text style={styles.applicationName}>MedEase</Text>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.welcomeText}>Chào mừng bạn đến với MedEase</Text>
        <Text style={styles.introText}>
          "Ứng dụng giúp bạn kết nối với bác sĩ và chăm sóc sức khỏe của bạn"
        </Text>
      </View>

      <Image
        source={require("@/assets/images/doctor_sample.png")}
        style={styles.doctorSample}
        resizeMode="contain"
      />

      <View
        style={[
          styles.whiteCircle,
          { height: width * 1.25, width: width * 1.75 },
        ]}
      ></View>

      <View style={styles.startButton}>
        <ButtonComponent
          title={"Bắt đầu ngay"}
          backgroundColor={Colors.primary.main}
          textColor={Colors.light.main}
          borderColor={Colors.primary.darkText}
          onPress={() => router.replace("/login")}
          fontSize={20}
        />
      </View>
      {/* <Link href="/login" style={styles.button}>
        Go to About screen
      </Link>
      <Link href="/(tabs)" style={styles.button}>
        Go to Tabs screen
      </Link> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.main,
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    padding: 20,
    position: "absolute",
    top: 30,
  },
  logo: {
    height: 100,
    width: 100,
    borderRadius: 10,
  },
  applicationName: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.main,
    marginTop: 10,
    textAlign: "center",
  },
  textContainer: {
    position: "absolute",
    top: 280,
    paddingHorizontal: 20,
    zIndex: 3,
  },
  welcomeText: {
    color: Colors.light.main,
    fontWeight: "bold",
    fontSize: 30,
    textAlign: "center",
  },
  introText: {
    color: Colors.light.main,
    fontSize: 18,
    marginTop: 10,
    textAlign: "center",
  },
  startButton: {
    position: "absolute",
    bottom: 100,
    paddingHorizontal: 20,

    zIndex: 3,
  },
  whiteCircle: {
    position: "absolute",
    bottom: -width * 0.125 - 120,
    left: -width * 0.375,
    zIndex: 1,
    borderTopLeftRadius: "50%",
    borderTopRightRadius: "50%",
    backgroundColor: Colors.light.main,
  },
  doctorSample: {
    zIndex: 2,
    height: 600,
    position: "absolute",
    bottom: -100,
    left: -200,
  },
});
