import React from "react";
import "./index.scss";
import { formatDateToYYYYMMDD } from "../../../../../../utils/stringUtil";
import InputComponent from "../../../../../../components/InputComponent";
import { Button } from "antd";
import { ICONS } from "../../../../../../constants/icons";
import { questionAPI } from "../../../../../../api/questionAPI";
import { toast } from "react-toastify";
import axiosClient from "../../../../../../utils/axiosCustomize";

function QuestionCard({ value }) {
  const [answer, setAnswer] = React.useState("");

  const onClickSend = () => {
    if (answer.length === 0) return;
    axiosClient.application.defaults.headers.common["Authorization"] =
      `Bearer ${localStorage.getItem("accessToken")}`;
    questionAPI
      .createAnswer(value._id, answer)
      .then((res) => {
        console.log(res.data);
        setAnswer("");
        toast.success("Gửi câu trả lời thành công");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="question-card-container">
      <img
        className="question-card-patient-avatar"
        alt="Patient avatar"
        src={value?.account?.avatar}
      />
      <div className="question-card-answer-container">
        <div className="question-card-answer-header">
          <p className="font-weight-bold">{value?.account?.name}</p>
          <p className="question-card-answer-header-date font-italic">
            {formatDateToYYYYMMDD(value?.createdAt)}
          </p>
        </div>
        <p className="question-card-answer-content">{value?.content}</p>
        <div className="d-flex justify-content-between align-items-center">
          <InputComponent
            placeholder="Nhập câu trả lời"
            value={answer}
            setValue={setAnswer}
            type="text"
            className="question-card-send-input"
          />
          <Button className="question-card-send-button" onClick={onClickSend}>
            <img
              alt="Send icon"
              className="question-card-send-icon"
              src={ICONS.SendMessage}
            />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default QuestionCard;
