import { useEffect, useState } from "react";
import InputComponent from "../../../../components/InputComponent";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import FakeData from "../../../../data/FakeData.json";
import { paginateData } from "../../../../utils/stringUtil";
import QuestionCard from "./components/QuestionCard";
import PaginationComponent from "../../../../components/Pagination";
import NoData from "../../../../components/NoData";
import "./index.scss";

function DoctorQuestion() {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState(null); // Sử dụng dayjs thay vì new Date()

  const [questions, setQuestions] = useState(FakeData.questions);
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
          <p className="font-italic " style={{width: "12%"}}>
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
          <p className="font-italic" style={{width: "25%"}}>
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
                <QuestionCard value={question} />
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
