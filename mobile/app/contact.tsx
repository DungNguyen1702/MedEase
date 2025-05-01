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
import React, { useEffect, useState } from "react";
import InputComponent from "@/components/InputComponent";
import QuestionComponent from "@/components/QuestionComponent";
import { Colors } from "@/constants/Colors";
import { questionAPI } from "@/api/question";

export default function ChatBox() {
  const [questions, setQuestions] = useState<
    { question: string; answers: string }[]
  >([]);
  const [question, setQuestion] = useState("");

  const callAPI = async () => {
    try {
      const response = await questionAPI.getAll();
      setQuestions(response);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    callAPI();
  }, []);

  const onPressSend = async () => {
    try {
      const response = await questionAPI.createQuestion(question);
      setQuestions((prev) => [...prev, response]);
      setQuestion("");
    } catch (error) {
      console.log("Error sending question:", error);
    }
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
          keyboardShouldPersistTaps="always" // Cho phép ẩn bàn phím khi chạm vào ScrollView
        >
          {questions.map((item, index) => {
            return (
              <QuestionComponent
                key={index}
                question={item}
                answer={item.answers}
              />
            );
          })}
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
