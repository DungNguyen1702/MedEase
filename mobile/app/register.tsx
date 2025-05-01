import { AuthAPI } from "@/api/auth";
import ButtonComponent from "@/components/ButtonComponent";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("vandung17022003@gmail.com");
  const [password, setPassword] = useState("dung1702");
  const [confirmPassword, setConfirmPassword] = useState("dung1702");
  const [name, setName] = useState("Nguyen Van Dung");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const onChangeEmail = (text: string) => {
    setEmail(text);
  };
  const onChangePassword = (text: string) => {
    setPassword(text);
  };
  const onChangeConfirmPassword = (text: string) => {
    setConfirmPassword(text);
  };
  const onChangeName = (text: string) => {
    setName(text);
  };

  const onLogin = () => {
    router.replace("/login");
  };

  const onRegister = async () => {
    if (!email || !password || !confirmPassword || !name) {
      Alert.alert("Đăng kí thất bại", "Vui lòng điền đầy đủ thông tin!");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Đăng kí thất bại", "Mật khẩu xác nhận không khớp!");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Đăng kí thất bại", "Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }
    if (!email.includes("@")) {
      Alert.alert("Đăng kí thất bại", "Email không hợp lệ!");
      return;
    }
    if (!email.includes(".com")) {
      Alert.alert("Đăng kí thất bại", "Email không hợp lệ!");
      return;
    }

    try {
      const response = await AuthAPI.Register({
        email: email,
        password: password,
        confirmPassword: confirmPassword,
        name: name,
      });
      if (response) {
        Alert.alert(
          "Đăng ký thành công!",
          "Vui lòng kiểm tra email để xác nhận"
        );
      }
    } catch (error: any) {
      Alert.alert(
        "Đăng kí thất bại",
        error.response.data.message ||
          "Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại sau."
      );
    }

    router.replace("/login");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Điều chỉnh hành vi trên iOS và Android
    >
      <StatusBar
        backgroundColor={Colors.primary.mainDark}
        barStyle="light-content"
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerCircle}></View>
          <Image
            source={require("@/assets/images/register-page.jpg")}
            style={styles.headerImage}
            resizeMode="cover"
          />
          <View style={styles.headerTitleContainer}>
            <View style={styles.logoContainer}>
              <Image
                source={require("@/assets/images/logo/logo_light.png")}
                style={styles.logo}
                resizeMode="cover"
              />
              <Text style={styles.logoText}>MedEase</Text>
            </View>
            <Text style={styles.headerTitle}>Đăng ký</Text>
            <Text style={styles.headerText}>
              “ Chỉ mất 1 phút để đăng ký, giúp bạn dễ dàng theo dõi tình trạng
              sức khỏe mọi lúc, mọi nơi Tạo tài khoản để đặt lịch khám, lưu hồ
              sơ sức khỏe và nhận tư vấn từ bác sĩ ”
            </Text>
          </View>
        </View>

        {/* Body */}
        <View style={styles.inputContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputTitle}>Email</Text>
            <TextInput
              value={email}
              onChangeText={onChangeEmail}
              placeholder="Nhập email của bạn"
              placeholderTextColor={Colors.primary.mainLight}
              style={styles.inputText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputTitle}>Tên</Text>
            <TextInput
              value={name}
              onChangeText={onChangeName}
              placeholder="Nhập tên của bạn"
              placeholderTextColor={Colors.primary.mainLight}
              style={styles.inputText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputTitle}>Mật khẩu</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                value={password}
                onChangeText={onChangePassword}
                placeholder="Nhập mật khẩu của bạn"
                placeholderTextColor={Colors.primary.mainLight}
                style={[styles.inputText, { flex: 1, borderWidth: 0 }]}
                secureTextEntry={!isPasswordVisible}
              />
              <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                style={styles.eyeIcon}
              >
                {isPasswordVisible ? (
                  <Image
                    source={require("@/assets/icons/view.png")}
                    style={{
                      width: 25,
                      height: 25,
                      tintColor: Colors.primary.main,
                    }}
                    resizeMode="contain"
                  />
                ) : (
                  <Image
                    source={require("@/assets/icons/hide.png")}
                    style={{
                      width: 25,
                      height: 25,
                      tintColor: Colors.primary.main,
                    }}
                    resizeMode="contain"
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputTitle}>Xác nhận lại mật khẩu</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                value={confirmPassword}
                onChangeText={onChangeConfirmPassword}
                placeholder="Nhập mật khẩu của bạn"
                placeholderTextColor={Colors.primary.mainLight}
                style={[styles.inputText, { flex: 1, borderWidth: 0 }]}
                secureTextEntry={!isConfirmPasswordVisible}
              />
              <TouchableOpacity
                onPress={() =>
                  setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                }
                style={styles.eyeIcon}
              >
                {isConfirmPasswordVisible ? (
                  <Image
                    source={require("@/assets/icons/view.png")}
                    style={{
                      width: 25,
                      height: 25,
                      tintColor: Colors.primary.main,
                    }}
                    resizeMode="contain"
                  />
                ) : (
                  <Image
                    source={require("@/assets/icons/hide.png")}
                    style={{
                      width: 25,
                      height: 25,
                      tintColor: Colors.primary.main,
                    }}
                    resizeMode="contain"
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <ButtonComponent
            title="Đăng ký"
            onPress={onRegister}
            backgroundColor={Colors.primary.main}
            fontSize={18}
            textColor={Colors.light.main}
          />
        </View>

        {/* Footer */}
        <View style={styles.footerContainer}>
          <View style={styles.footerItem}>
            <Text style={{ color: Colors.primary.main, fontSize: 14 }}>
              Bạn đã tài khoản?{" "}
              <TouchableOpacity
                onPress={onLogin}
                style={{ padding: 0, margin: 0 }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    color: Colors.primary.main,
                    fontSize: 14,
                    textDecorationLine: "underline",
                    fontStyle: "italic",
                  }}
                >
                  Đăng nhập ngay
                </Text>
              </TouchableOpacity>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.main,
  },
  text: {
    color: "#fff",
  },
  headerContainer: {
    width: "100%",
    height: height * 0.45,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  headerCircle: {
    position: "absolute",
    color: Colors.primary.mainDark,
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    backgroundColor: Colors.primary.mainDark,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    opacity: 0.7,
    zIndex: 1,
  },
  headerImage: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 0,
    height: "100%",
    width: "100%",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    overflow: "hidden",
    borderColor: Colors.primary.mainLight,
  },
  headerTitleContainer: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 40,
    fontWeight: "bold",
    color: Colors.light.main,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    color: Colors.light.main,
    textAlign: "center",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logo: {
    height: 100,
    width: 100,
    borderRadius: 10,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.main,
    marginTop: 10,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputGroup: {
    width: "100%",
    marginBottom: 20,
  },
  inputText: {
    height: 50,
    width: "100%",
    borderRadius: 10,
    backgroundColor: Colors.light.main,
    paddingHorizontal: 20,
    color: Colors.primary.main,
    fontSize: 16,
    borderColor: Colors.primary.main,
    borderWidth: 1,
  },
  inputTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary.main,
    marginBottom: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.primary.main,
    borderRadius: 10,
    backgroundColor: Colors.light.main,
    paddingHorizontal: 10,
  },
  eyeIcon: {
    marginLeft: 10,
  },
  footerContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  footerItem: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    paddingHorizontal: 20,
    marginBottom: 50,
  },
  lines: {
    width: "100%",
    height: 1,
    backgroundColor: Colors.primary.main,
    marginVertical: 10,
  },
  button: {
    backgroundColor: Colors.primary.main,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.light.main,
    fontSize: 18,
    fontWeight: "bold",
  },
  logoTextButton: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary.main,
    marginLeft: 10,
  },
  logoButtonContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 20,
    display: "flex",
    flexDirection: "row",
    borderColor: Colors.primary.main,
    borderWidth: 1,
    borderRadius: 10,
    width: "45%",
    padding: 10,
  },
  logoButton: {
    height: 50,
    width: 50,
    borderRadius: 10,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
    fontStyle: "italic",
  },
});
