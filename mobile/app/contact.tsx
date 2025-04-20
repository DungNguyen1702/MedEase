import {
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import FakeData from "@/data/fake_data.json";
import InputComponent from "@/components/InputComponent";
import QuestionComponent from "@/components/QuestionComponent";
import { Colors } from "@/constants/Colors";

export default function ChatBox() {
  const questions = FakeData.questions;
  const [question, setQuestion] = useState("");

  const onPressSend = () => {
    console.log("Question sent:", question);
    setQuestion(""); // Clear the input after sending
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 70 : 0}
      >
        <ScrollView
          style={styles.questionList}
          contentContainerStyle={{ paddingBottom: 100 }} // Đảm bảo nội dung không bị che
          keyboardShouldPersistTaps="handled" // Cho phép ẩn bàn phím khi chạm vào ScrollView
        >
          {questions.map((item, index) => (
            <QuestionComponent
              key={index}
              question={item}
              answer={item.answer}
            />
          ))}
        </ScrollView>
        <View style={styles.questionCreateBox}>
          <InputComponent
            placeholder="Nhập câu hỏi của bạn"
            value={question}
            onChangeText={setQuestion}
            style={styles.questionInput}
            numberOfLines={4}
            multiline={true}
          />
          <TouchableOpacity onPress={onPressSend} style={styles.sendContainer}>
            <Image
              source={require("../assets/icons/send_message.png")}
              style={styles.sendIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  questionList: {
    flex: 1,
  },
  questionCreateBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.primary.main,
    borderRadius: 8,
    padding: 10,
    paddingBottom: 25,
  },
  questionInput: {
    flex: 1,
    marginRight: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  sendIcon: {
    width: 24,
    height: 24,
  },
  sendContainer: {
    backgroundColor: Colors.light.main,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
