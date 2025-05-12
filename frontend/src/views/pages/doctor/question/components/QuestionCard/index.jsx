import React, { useState } from "react";
import "./index.scss";
import MessageComponent from "../MessageComponent";
import InputComponent from "../../../../../../components/InputComponent";
import { Button } from "antd";
import { SendOutlined } from "@ant-design/icons";
function QuestionCard({ value }) {
  const [answer, setAnswer] = useState("");

  return (
    <div className="question-card-component-container">
      <MessageComponent
        content={value?.content}
        sender={value?.account}
        style="left"
        createdAt={value?.createdAt}
      />
      {value?.answers &&
        value?.answers.length > 0 &&
        value?.answers.map((answer, index) => (
          <MessageComponent
            key={index}
            content={answer?.answer}
            sender={answer?.account}
            style="right"
            createdAt={answer?.createdAt}
          />
        ))}
      <div className="d-flex justify-content-between align-items-center question-card-component-answer-container">
        <InputComponent
          placeholder="Nhập câu trả lời"
          value={answer}
          setValue={setAnswer}
          type="text"
          className="question-card-send-input"
        />
        <Button icon={<SendOutlined />} className="question-card-send-button" />
      </div>
    </div>
  );
}

export default QuestionCard;
