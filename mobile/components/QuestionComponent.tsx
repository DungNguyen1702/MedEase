import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Colors } from "@/constants/Colors";
import AnswerComponent from "./AnswerComponent";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { formatDateToYYYYMMDDHHmm } from "@/utils/string.utils";

export default function QuestionComponent(props: any) {
  const account = useSelector((state: RootState) => state.auth.account);

  const { question, answer } = props;
  const [viewAnswer, setViewAnswer] = useState(false);

  const onPressViewAnswer = () => {
    console.log("View answer pressed");
    setViewAnswer(!viewAnswer);
  };

  return (
    <View style={styles.container}>
      <View style={styles.questionContainer}>
        <View style={styles.accountInfo}>
          <Text style={styles.accountName}>{account.name}</Text>
          <Text style={styles.QuestionContent}>{question.content}</Text>
          <Text style={styles.createdDate}>
            {formatDateToYYYYMMDDHHmm(question.createdAt)}
          </Text>
          <View style={styles.answerContainer}>
            {viewAnswer &&
              answer &&
              answer.length > 0 &&
              answer.map((item: any, index: number) => (
                <AnswerComponent key={index} answer={item} />
              ))}
          </View>
          <Text
            style={[
              styles.answerText,
              !answer || answer.length === 0
                ? { color: "#888" }
                : { color: "#007BFF" },
            ]}
            onPress={
              answer && answer.length > 0 ? onPressViewAnswer : undefined
            } // Chỉ cho phép nhấn nếu có câu trả lời
          >
            {!viewAnswer
              ? answer && answer.length > 0
                ? "Xem câu trả lời"
                : "Không có câu trả lời"
              : "Thu gọn câu trả lời"}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  questionContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  accountInfo: {
    flexDirection: "column",
    width: "100%",
    paddingHorizontal: 20,
  },
  accountName: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary.main,
  },
  QuestionContent: {
    fontSize: 14,
    marginVertical: 5,
  },
  createdDate: {
    fontSize: 12,
    color: "#888",
    width: "100%",
    textAlign: "right",
    marginRight: 10,
  },
  answerContainer: {},
  answerText: {
    fontSize: 14,
    color: "#007BFF",
    marginTop: 5,
  },
});
