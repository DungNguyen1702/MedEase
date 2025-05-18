"use client";

import { useEffect, useState } from "react";
import {
  List,
  Card,
  Button,
  Input,
  Avatar,
  Tag,
  Modal,
  Form,
  Tabs,
} from "antd";
import {
  UserOutlined,
  RobotOutlined,
  MedicineBoxOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "./index.scss";
import callAPIForm from "../../../../utils/callAPIForm";
import { questionAPI } from "../../../../api/questionAPI";
import { useAuth } from "../../../../context/AuthContext";
import { toast } from "react-toastify";

const { TextArea } = Input;
const { TabPane } = Tabs;

const AdminQuestions = () => {
  const { account } = useAuth();

  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");

  // Sample data using the provided JSON structure
  const [questionsData, setQuestionData] = useState([]);

  const callAPI = async () => {
    const response = await questionAPI.getAllQuestions();
    if (response && response.status === 200) {
      setQuestionData(response.data);
    } else {
      console.error("Failed to fetch questions data");
    }
  };

  useEffect(() => {
    callAPIForm(
      callAPI,
      "Lỗi khi truy vấn dữ liên bảng câu hỏi và câu trả lời"
    );
  }, []);

  // Check if a question has been answered by a doctor (not just a chatbot)
  const isAnsweredByDoctor = (question) => {
    if (!question.answers || question.answers.length === 0) return false;
    return question.answers.some(
      (answer) =>
        answer.account &&
        (answer.account.role === "doctor" || answer.account.role === "admin")
    );
  };

  // Filter questions based on active tab
  const getFilteredQuestions = () => {
    switch (activeTab) {
      case "answered":
        return questionsData.filter((q) => isAnsweredByDoctor(q));
      case "unanswered":
        return questionsData.filter((q) => !isAnsweredByDoctor(q));
      default:
        return questionsData;
    }
  };

  // Hàm lọc câu hỏi theo nội dung content
  const filteredQuestions = getFilteredQuestions().filter((question) => {
    const keyword = searchText.trim().toLowerCase();
    return question.content.toLowerCase().includes(keyword);
  });

  const showReplyModal = (question) => {
    setSelectedQuestion(question);
    setReplyModalVisible(true);
    form.resetFields();
  };

  const handleReplyCancel = () => {
    setReplyModalVisible(false);
  };

  const handleReplySubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!selectedQuestion) return;

      // Gọi API tạo câu trả lời
      const res = await questionAPI.createAnswer(
        selectedQuestion._id,
        values.reply
      );

      if (res && res.status === 201 && res.data) {
        toast.success("Trả lời câu hỏi thành công", { autoClose: 2000 });

        // Tạo object answer mới từ response
        const newAnswer = {
          ...res.data,
          account,
        };

        // Cập nhật lại danh sách câu trả lời cho câu hỏi tương ứng
        setQuestionData((prev) =>
          prev.map((q) =>
            q._id === selectedQuestion._id
              ? {
                  ...q,
                  answers: q.answers ? [...q.answers, newAnswer] : [newAnswer],
                }
              : q
          )
        );
      }

      setReplyModalVisible(false);
      form.resetFields();
    } catch (error) {
      // Xử lý lỗi nếu cần
    }
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  // Format date for display
  const formatDate = (dateString) => {
    return dayjs(dateString).format("DD/MM/YYYY HH:mm");
  };

  return (
    <div className="questions-page">
      <div className="page-header">
        <h1 className="page-title">Quản lý câu hỏi</h1>
        <div className="header-actions">
          <Input
            placeholder="Tìm kiếm câu hỏi"
            prefix={<SearchOutlined />}
            className="search-input"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>

      {/* Hiển thị kết quả tìm kiếm */}
      {searchText && (
        <div style={{ marginBottom: 12 }}>
          <span>
            Kết quả tìm kiếm cho: <b>{searchText}</b> (
            {filteredQuestions.length} kết quả)
          </span>
        </div>
      )}

      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        className="questions-tabs"
      >
        <TabPane tab="Tất cả câu hỏi" key="all" />
        <TabPane tab="Đã trả lời" key="answered" />
        <TabPane tab="Chưa trả lời" key="unanswered" />
      </Tabs>

      <List
        className="questions-list"
        itemLayout="vertical"
        pagination={{
          pageSize: 5,
        }}
        dataSource={filteredQuestions}
        renderItem={(item) => (
          <Card className="question-card" key={item._id}>
            <div className="question-header">
              <div className="question-info">
                <Avatar
                  src={item.account.avatar}
                  icon={<UserOutlined />}
                  className="avatar"
                />
                <div>
                  <div className="patient-name">{item.account.name}</div>
                  <div className="question-date">
                    {formatDate(item.createdAt)}
                  </div>
                </div>
              </div>
              <Tag color={isAnsweredByDoctor(item) ? "success" : "warning"}>
                {isAnsweredByDoctor(item) ? "Đã trả lời" : "Chưa trả lời"}
              </Tag>
            </div>

            <div className="question-content">
              <p>{item.content}</p>
            </div>

            {item.answers && item.answers.length > 0 && (
              <div className="answers-section">
                <h4 className="answers-title">Trả lời</h4>
                {item.answers.map((answer) => (
                  <div className="answer-item" key={answer._id}>
                    <div className="answer-header">
                      <Avatar
                        src={answer.account.avatar}
                        icon={
                          answer.account.role === "chatbot" ? (
                            <RobotOutlined />
                          ) : (
                            <MedicineBoxOutlined />
                          )
                        }
                        className={`avatar ${
                          answer.account.role === "chatbot"
                            ? "chatbot-avatar"
                            : "doctor-avatar"
                        }`}
                      />
                      <div>
                        <div className="responder-name">
                          {answer.account.name}
                          {answer.account.role === "chatbot" && (
                            <Tag color="blue" className="role-tag">
                              Bot
                            </Tag>
                          )}
                          {answer.account.role === "doctor" && (
                            <Tag color="green" className="role-tag">
                              Bác sĩ
                            </Tag>
                          )}
                        </div>
                        <div className="answer-date">
                          {formatDate(answer.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className="answer-content">
                      <p>{answer.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="question-actions">
              {!isAnsweredByDoctor(item) && (
                <Button
                  type="primary"
                  onClick={() => showReplyModal(item)}
                  className="reply-button"
                >
                  Trả lời
                </Button>
              )}
              {isAnsweredByDoctor(item) && (
                <Button
                  type="default"
                  onClick={() => showReplyModal(item)}
                  className="add-reply-button"
                >
                  Thêm trả lời
                </Button>
              )}
            </div>
          </Card>
        )}
      />

      <Modal
        title="Trả lời câu hỏi"
        open={replyModalVisible}
        onCancel={handleReplyCancel}
        footer={[
          <Button key="back" onClick={handleReplyCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleReplySubmit}>
            Gửi trả lời
          </Button>,
        ]}
        width={700}
      >
        {selectedQuestion && (
          <div className="reply-modal-content">
            <div className="original-question">
              <div className="question-meta">
                <div className="patient-info">
                  <Avatar
                    src={selectedQuestion.account.avatar}
                    icon={<UserOutlined />}
                    className="avatar"
                  />
                  <span className="patient-name">
                    {selectedQuestion.account.name}
                  </span>
                </div>
                <span className="question-date">
                  {formatDate(selectedQuestion.createdAt)}
                </span>
              </div>
              <p className="question-text">{selectedQuestion.content}</p>
            </div>

            {selectedQuestion.answers &&
              selectedQuestion.answers.length > 0 && (
                <div className="previous-answers">
                  <h4>Các câu trả lời trước đó</h4>
                  {selectedQuestion.answers.map((answer) => (
                    <div className="previous-answer" key={answer._id}>
                      <div className="answer-meta">
                        <div className="responder-info">
                          <Avatar
                            src={answer.account.avatar}
                            icon={
                              answer.account.role === "chatbot" ? (
                                <RobotOutlined />
                              ) : (
                                <MedicineBoxOutlined />
                              )
                            }
                            className={`avatar ${
                              answer.account.role === "chatbot"
                                ? "chatbot-avatar"
                                : "doctor-avatar"
                            }`}
                          />
                          <span className="responder-name">
                            {answer.account.name}
                            {answer.account.role === "chatbot" && (
                              <Tag color="blue" className="role-tag">
                                Bot
                              </Tag>
                            )}
                            {answer.account.role === "doctor" && (
                              <Tag color="green" className="role-tag">
                                Bác sĩ
                              </Tag>
                            )}
                          </span>
                        </div>
                        <span className="answer-date">
                          {formatDate(answer.createdAt)}
                        </span>
                      </div>
                      <p className="answer-text">{answer.answer}</p>
                    </div>
                  ))}
                </div>
              )}

            <Form form={form} layout="vertical">
              <Form.Item
                name="reply"
                label="Nội dung trả lời"
                rules={[
                  { required: true, message: "Vui lòng nhập nội dung trả lời" },
                ]}
              >
                <TextArea rows={6} placeholder="Nhập nội dung trả lời..." />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminQuestions;
