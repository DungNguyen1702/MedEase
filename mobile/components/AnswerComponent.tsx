import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";

export default function AnswerComponent(props: any) {
  const { answer } = props;

  const account = answer.account;

  console.log(answer);

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Image
          source={{ uri: account.avatar }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
          }}
          resizeMode="cover"
        />
      </View>
      <View style={styles.answerInfo}>
        <View style={styles.headerContainer}>
          <Text style={styles.accountName}>{account.name}</Text>
        </View>
        <Text style={styles.answerContent}>{answer.answer}</Text>
        <Text style={styles.answerDate}>{answer.createdAt}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 5,
    paddingVertical: 10,
    flexDirection: "row",
  },
  avatar: {
    marginRight: 10,
  },
  answerInfo: {
    flex: 1,
    borderColor: Colors.primary.main,
    borderWidth: 1,
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 10,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  accountName: {
    fontSize: 15,
    fontWeight: "bold",
    color: Colors.primary.main,
  },
  answerContent: {
    fontSize: 14,
    color: "#666",
    marginVertical: 5,
  },
  answerDate: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
    marginTop: 5, 
  },
});
