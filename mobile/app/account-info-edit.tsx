import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Colors } from "@/constants/Colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { formatDateToYYYYMMDD } from "@/utils/string.utils";
import validator from "validator";
import { AccountAPI } from "@/api/account";
import { setAccount } from "@/redux/slices/authSlice";
import { useRouter } from "expo-router";

export default function AccountInfoEdit() {
  const account = useSelector((state: RootState) => state.auth.account);
  const dispatch = useDispatch();
  const router = useRouter();

  const [showDate, setShowDate] = useState(false);

  const [name, setName] = useState(account.name);
  const [email, setEmail] = useState(account.email);
  const [tel, setTel] = useState(account.tel);
  const [address, setAddress] = useState(account.address);
  const [gender, setGender] = useState(account.gender);
  const [dateOfBirth, setDateOfBirth] = useState(
    new Date(formatDateToYYYYMMDD(account.date_of_birth))
  );
  const [avatar, setAvatar] = useState(account.avatar);
  const [initialAvatar, setInitialAvatar] = useState(account.avatar); // Avatar ban đầu

  const handleChooseImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri); // Cập nhật avatar hiện tại
    }
  };

  const handleSave = async () => {
    // Validate input fields
    if (!name || !email || !tel || !address || !gender || !dateOfBirth) {
      Alert.alert("Thông báo", "Vui lòng điền đầy đủ thông tin!");
      return;
    }
    if (tel.length > 10) {
      Alert.alert("Thông báo", "Số điện thoại không hợp lệ!");
      return;
    }
    if (!validator.isEmail(email)) {
      Alert.alert("Thông báo", "Địa chỉ email không hợp lệ!");
      return;
    }
    if (address.length > 100) {
      Alert.alert("Thông báo", "Địa chỉ không hợp lệ!");
      return;
    }
    if (name.length > 100) {
      Alert.alert("Thông báo", "Tên không hợp lệ!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("id", account._id);
      formData.append("name", name);
      formData.append("tel", tel);
      formData.append("address", address);
      formData.append("gender", gender);
      formData.append("date_of_birth", dateOfBirth.toISOString());

      // Chỉ thêm avatar nếu nó đã thay đổi
      if (avatar !== initialAvatar) {
        const response = await fetch(avatar);
        console.log("fetch res", response.ok);
        const blob = await response.blob();
        console.log(blob.size);
        formData.append("avatar", {
          uri: avatar,
          type: "image/jpeg",
          name: "avatar.jpg",
        } as any);
      }

      console.log(formData);

      const responseUpdate = await AccountAPI.updateInfo(formData);
      dispatch(setAccount(responseUpdate));

      Alert.alert("Thông báo", "Thông tin cá nhân đã được cập nhật!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      console.log(error.response.data.message);
      Alert.alert("Thông báo", error?.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.");
    }
  };

  const onChangeDate = (event: any, selectedDate: Date | undefined) => {
    setShowDate(false);
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 70 : 0}
      >
        <ScrollView>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
            <TouchableOpacity
              style={styles.editAvatarButton}
              onPress={handleChooseImage}
            >
              <Text style={styles.editAvatarText}>Chỉnh sửa ảnh</Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Name */}
            <Text style={styles.label}>Họ và tên</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Nhập họ và tên"
            />

            {/* Email */}
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Nhập email"
              keyboardType="email-address"
            />

            {/* Phone */}
            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput
              style={styles.input}
              value={tel}
              onChangeText={setTel}
              placeholder="Nhập số điện thoại"
              keyboardType="phone-pad"
            />

            {/* Address */}
            <Text style={styles.label}>Địa chỉ</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="Nhập địa chỉ"
            />

            {/* Gender */}
            <Text style={styles.label}>Giới tính</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === "male" && styles.genderButtonSelected,
                ]}
                onPress={() => setGender("male")}
              >
                <Text
                  style={[
                    styles.genderText,
                    gender === "male"
                      ? { color: Colors.light.main }
                      : { color: Colors.primary.main },
                  ]}
                >
                  Nam
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === "female" && styles.genderButtonSelected,
                ]}
                onPress={() => setGender("female")}
              >
                <Text
                  style={[
                    styles.genderText,
                    gender === "female"
                      ? { color: Colors.light.main }
                      : { color: Colors.primary.main },
                  ]}
                >
                  Nữ
                </Text>
              </TouchableOpacity>
            </View>

            {/* Date of Birth */}
            <Text style={styles.label}>Ngày sinh</Text>
            <TouchableOpacity
              onPress={() => setShowDate(true)}
              style={styles.textInputContainer}
            >
              <TextInput
                style={[styles.input, { marginBottom: 0 }]}
                value={dateOfBirth.toLocaleDateString()} // Hiển thị ngày đã chọn
                placeholder="Chọn ngày"
                editable={false}
              />
              <Image
                source={require("@/assets/icons/select_calendar.png")}
                resizeMode="contain"
                style={styles.selectIcon}
              />
            </TouchableOpacity>
            {showDate && (
              <Modal transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                  <DateTimePicker
                    value={dateOfBirth}
                    mode="date"
                    display="spinner"
                    onChange={onChangeDate}
                  />
                  <TouchableOpacity
                    style={styles.modalCloseButton}
                    onPress={() => setShowDate(false)}
                  >
                    <Text style={styles.modalCloseText}>Đóng</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            )}
          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Lưu thông tin</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  editAvatarButton: {
    backgroundColor: Colors.primary.main,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  editAvatarText: {
    color: "#fff",
    fontWeight: "bold",
  },
  form: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: Colors.primary.main,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    width: "100%",
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  genderButtonSelected: {
    backgroundColor: Colors.primary.main,
    borderColor: Colors.primary.main,
  },
  genderText: {
    color: Colors.light.main,
  },
  saveButton: {
    backgroundColor: Colors.primary.main,
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  textInputContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  selectIcon: {
    width: 20,
    height: 20,
    marginLeft: 10,
    tintColor: Colors.primary.main,
    position: "absolute",
    right: 10,
    bottom: 7,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: Colors.primary.main,
    borderRadius: 10,
  },
  modalCloseText: {
    color: Colors.light.main,
    fontSize: 16,
    fontWeight: "bold",
  },
});
