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
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorPassword, setErrorPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState("");

  const onChangeEmail = (text: string) => {
    setEmail(text);
  };
  const onChangePassword = (text: string) => {
    setPassword(text);
  };

  const onLogin = () => {
    router.replace("/(tabs)");
  };

  const onForgotPassword = () => {
    console.log("Quên mật khẩu");
  };
  const onRegister = () => {
    router.replace("/register");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Điều chỉnh hành vi trên iOS và Android
    >
      <StatusBar
        backgroundColor={Colors.primary.mainLight}
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
            source={require("@/assets/images/login-page.jpg")}
            style={styles.headerImage}
            resizeMode="cover"
          />
          <View style={styles.headerTitleContainer}>
            <View style={styles.logoContainer}>
              <Image
                source={require("@/assets/images/logo/logo_dark.png")}
                style={styles.logo}
                resizeMode="cover"
              />
              <Text style={styles.logoText}>MedEase</Text>
            </View>
            <Text style={styles.headerTitle}>Đăng nhập</Text>
            <Text style={styles.headerText}>
              “ Đăng nhập để tiếp tục hành trình chăm sóc sức khỏe ”
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
            {errorEmail ? (
              <Text style={styles.errorText}>{errorEmail}</Text>
            ) : null}
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
                    source={require("@/assets/icons/hide.png")}
                    style={{
                      width: 25,
                      height: 25,
                      tintColor: Colors.primary.main,
                    }}
                    resizeMode="contain"
                  />
                ) : (
                  <Image
                    source={require("@/assets/icons/view.png")}
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
            {errorPassword ? (
              <Text style={styles.errorText}>{errorPassword}</Text>
            ) : null}
          </View>

          <View
            style={[
              styles.inputGroup,
              { alignItems: "flex-end", marginBottom: 0 },
            ]}
          >
            <TouchableOpacity onPress={onForgotPassword}>
              <Text
                style={[
                  styles.inputTitle,
                  { textDecorationLine: "underline", fontStyle: "italic" },
                ]}
              >
                Quên mật khẩu?
              </Text>
            </TouchableOpacity>
          </View>

          <ButtonComponent
            title="Đăng nhập"
            onPress={onLogin}
            backgroundColor={Colors.primary.main}
            fontSize={18}
            textColor={Colors.light.main}
          />
        </View>

        {/* Footer */}
        <View style={styles.footerContainer}>
          {/* Title */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 20,
            }}
          >
            <View style={[styles.lines, { flex: 1 }]} />
            <Text
              style={{
                color: Colors.primary.main,
                fontSize: 14,
                marginHorizontal: 10,
              }}
            >
              Hoặc đăng nhập bằng
            </Text>
            <View style={[styles.lines, { flex: 1 }]} />
          </View>

          {/* Gooogle Facebook button */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <TouchableOpacity style={styles.logoButtonContainer}>
              <Image
                source={require("@/assets/icons/google.png")}
                style={styles.logoButton}
                resizeMode="cover"
              />
              <Text style={styles.logoTextButton}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoButtonContainer}>
              <Image
                source={require("@/assets/icons/facebook.png")}
                style={styles.logoButton}
                resizeMode="cover"
              />
              <Text style={styles.logoTextButton}>Facebook</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footerItem}>
            <Text style={{ color: Colors.primary.main, fontSize: 14 }}>
              Bạn chưa có tài khoản?{" "}
              <TouchableOpacity
                onPress={onRegister}
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
                  Đăng ký ngay
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
    color: Colors.primary.mainLight,
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    backgroundColor: Colors.primary.mainLight,
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
    color: Colors.primary.mainDark,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    color: Colors.primary.mainDark,
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
    color: Colors.primary.mainDark,
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
