import { useEffect, useState } from "react";
import InputComponent from "../../../../components/InputComponent";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { paginateData } from "../../../../utils/stringUtil";
import QuestionCard from "./components/QuestionCard";
import PaginationComponent from "../../../../components/Pagination";
import NoData from "../../../../components/NoData";
import "./index.scss";
import { questionAPI } from "../../../../api/questionAPI";
import { toast } from "react-toastify";
import axiosClient from "../../../../utils/axiosCustomize";

function DoctorQuestion() {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState(null); // Sử dụng dayjs thay vì new Date()

  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState(questions);

  // pagination
  const [total, setTotal] = useState(filteredQuestions.length);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(3);

  const [paginatedQuestions, setPaginatedQuestions] = useState(
    paginateData(filteredQuestions, page, limit)
  );

  const onChange = (date, dateString) => {
    console.log(date, dateString);
    setDate(date); // Lưu giá trị date dưới dạng đối tượng dayjs
  };

  useEffect(() => {
    const filtered = questions.filter((question) => {
      const patientName = question?.account?.name || "";
      const AppTitle = question?.content || "";
      const createdAt = dayjs(question?.createdAt);

      // Kiểm tra điều kiện lọc theo search và date
      const matchesSearch =
        search.length === 0 ||
        patientName.toLowerCase().includes(search.toLowerCase()) ||
        AppTitle.toLowerCase().includes(search.toLowerCase());

      const matchesDate = !date || createdAt.isSame(date, "day");

      // Chỉ giữ lại các câu hỏi thỏa mãn cả hai điều kiện
      return matchesSearch && matchesDate;
    });

    setFilteredQuestions(filtered);
    setTotal(filtered.length); // Cập nhật tổng số câu hỏi sau khi lọc
    setPage(1); // Đặt lại trang về 1 khi có thay đổi trong câu hỏi
  }, [search, date, questions]);

  useEffect(() => {
    setPaginatedQuestions(paginateData(filteredQuestions, page, limit));
  }, [page, limit, filteredQuestions]);

  const callAPI = async () => {
    try {
      const res = await questionAPI.getAllQuestions();
      if (res && res.data) {
        setQuestions(res.data);
        setFilteredQuestions(res.data);
        setTotal(res.data.length);
        setPaginatedQuestions(paginateData(res.data, page, limit));
      }
    } catch (error) {
      console.log("Error fetching questions:", error);
    }
  };

  const handleSendAnswer = async (questionId, content, setAnswer) => {
    try {
      if (content.length === 0) return;
      axiosClient.application.defaults.headers.common["Authorization"] =
        `Bearer ${localStorage.getItem("accessToken")}`;
      const res = await questionAPI.createAnswer(questionId, content);
      if (res && res.data) {
        console.log("res", res.data);
        setAnswer("");
        setQuestions((prevQuestions) =>
          prevQuestions.map((q) =>
            q._id === questionId
              ? { ...q, answers: [...(q.answers || []), res.data] }
              : q
          )
        );
        setFilteredQuestions((prevQuestions) =>
          prevQuestions.map((q) =>
            q._id === questionId
              ? { ...q, answers: [...(q.answers || []), res.data] }
              : q
          )
        );
        toast.success("Trả lời câu hỏi thành công");
      }
    } catch (error) {
      console.log("Error sending answer:", error);
      toast.error("Trả lời câu hỏi thất bại");
    }
  };

  useEffect(() => {
    callAPI();
  }, []);

  return (
    <div className="doctor-question-container">
      <div className="doctor-question-header">
        <h2 className="doctor-question-header-title1">
          Giải đáp thắc mắc của bệnh nhân
        </h2>
        <p className="doctor-question-header-title2 font-italic">
          Bệnh nhân đang mong chờ sự tư vấn từ bạn để có thể an tâm hơn về tình
          trạng sức khỏe của họ. Hãy dành chút thời gian để hỗ trợ ngay!
        </p>
      </div>
      <div className="doctor-question-search-container row">
        <div className="d-flex align-items-center justify-content-between col-8">
          <p className="font-italic " style={{ width: "12%" }}>
            <strong>Tìm kiếm : </strong>
          </p>
          <InputComponent
            placeholder="Nhập tên bệnh nhân hoặc nội dung câu hỏi"
            value={search}
            setValue={setSearch}
            type="text"
            className="doctor-question-search-input"
          />
        </div>
        <div className="d-flex align-items-center justify-content-between col-4">
          <p className="font-italic" style={{ width: "25%" }}>
            <strong>Ngày tạo : </strong>
          </p>
          <DatePicker
            onChange={onChange}
            value={date} // Đảm bảo giá trị là đối tượng dayjs
            className="doctor-question-date-picker"
            format={"DD/MM/YYYY"}
            style={{ width: "100%" }}
            placeholder="Chọn ngày"
          />
        </div>
      </div>
      <div className="doctor-question-content">
        {paginatedQuestions && paginatedQuestions.length !== 0 ? (
          <>
            {paginatedQuestions.map((question) => (
              <div
                className="w-100 d-flex justify-content-center align-items-center"
                key={question._id}
              >
                <QuestionCard
                  value={question}
                  handleSendAnswer={handleSendAnswer}
                />
              </div>
            ))}

            <PaginationComponent
              page={page}
              limit={limit}
              total={total}
              setPage={setPage}
              setLimit={setLimit}
            />
          </>
        ) : (
          <NoData />
        )}
      </div>
    </div>
  );
}

export default DoctorQuestion;
