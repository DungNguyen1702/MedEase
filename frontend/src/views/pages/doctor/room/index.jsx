import { useEffect, useState } from "react";
import {
  DoctorPosition,
  ExaminationStatusEnum,
} from "../../../../constants/constants";
import "./index.scss";
import { useAuth } from "../../../../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import ButtonComponent from "../../../../components/ButtonComponent";
import dayjs from "dayjs";
import { Calendar, Pagination } from "antd";
import InputComponent from "../../../../components/InputComponent";
import FakeData from "../../../../data/FakeData.json";
import AppointmentDetail from "./components/AppointmentDetail";
import { paginateData } from "../../../../utils/stringUtil";
import NoData from "../../../../components/NoData";

const filterAppointmentDetails = (data, search, status) => {
  return data.filter((item) => {
    const patientName = item?.appointment?.patient?.name || "";
    const AppTitle = item?.appointment?.title || "";
    // Nếu search.length < 0, chỉ lọc theo status
    if (search.length <= 0) {
      return status === "all" || item.examStatus === status;
    }

    // Lọc theo cả status và search
    return (
      (status === "all" || item.examStatus === status) &&
      (patientName.toLowerCase().includes(search.toLowerCase()) ||
        AppTitle.toLowerCase().includes(search.toLowerCase()))
    ); 
  });
};

function DoctorRoom() {
  const { account } = useAuth();
  const [appointmentNum, setAppointmentNum] = useState({
    total: 20,
    notFinished: 5,
  });
  const [currentNum, setCurrentNum] = useState(0);
  const [date, setDate] = useState(dayjs()); // Khởi tạo với đối tượng Dayjs
  const [search, setSearch] = useState("");
  const [appointmentStatus, setAppointmentStatus] = useState("all");

  const appointmentStatusList = Object.keys(ExaminationStatusEnum);

  const [appointmentDetails, setAppointmentDetails] = useState(
    FakeData.appointmentDetails
  );
  const [filteredAppointmentDetails, setFilteredAppointmentDetails] =
    useState(appointmentDetails);

  const [total, setTotal] = useState(filteredAppointmentDetails.length);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [paginatedAppointmentDetails, setPaginatedAppointmentDetails] =
    useState(paginateData(filteredAppointmentDetails, page, limit));

  const onClickNextNum = () => {
    console.log("next num");
  };

  const onPanelChange = (value, mode) => {
    console.log("Chế độ hiển thị:", mode);
  };

  const onSelectDate = (value) => {
    console.log("Ngày được chọn:", value.format("YYYY-MM-DD"));
    setDate(value);
  };

  const onChangeAppointmentStatus = (status) => {
    setAppointmentStatus(status);
  };

  useEffect(() => {
    setPaginatedAppointmentDetails(
      paginateData(filteredAppointmentDetails, page, limit)
    );
  }, [page, limit, filteredAppointmentDetails]);

  useEffect(() => {
    setFilteredAppointmentDetails(
      filterAppointmentDetails(appointmentDetails, search, appointmentStatus)
    );
  }, [search, appointmentStatus, appointmentDetails]);

  return (
    <div className="doctor-room-container">
      <div className="doctor-room-header">
        <h2 className="doctor-room-header-title">
          Chào bác sĩ {account.name} quay trở lại!
        </h2>
        <div className="d-flex justify-content-between align-items-center my-2">
          <p className="doctor-room-header-title">
            <strong>Khoa của bạn : </strong> {account.specialization_name}
          </p>
          <p className="doctor-room-header-title">
            <strong>Phòng khám của bạn : </strong> {account.room}
          </p>
          <p className="doctor-room-header-title">
            <strong>Chức vụ của bạn : </strong>{" "}
            {DoctorPosition[account.position]}
          </p>
        </div>
        <div className="row d-flex align-items-center justify-content-around">
          <div className="col-8 d-flex flex-column justify-content-center align-items-center">
            <div className="doctor-room-header-table">
              <div className="doctor-room-header-table-left-container col-8 d-flex flex-column justify-content-center align-items-center">
                <p className="doctor-room-header-table-title">
                  Số cuộc hẹn trong ngày
                </p>
                <p className="doctor-room-header-table-num">
                  {appointmentNum.total}
                </p>
                <div className="doctor-room-header-table-horizontal-divide"></div>
                <p className="doctor-room-header-table-title">
                  Số cuộc hẹn chưa hoàn thành
                </p>
                <p className="doctor-room-header-table-num">
                  {appointmentNum.notFinished}
                </p>
              </div>
              <div className="doctor-room-header-table-vertical-divide"></div>
              <div className=" doctor-room-header-table-right-container d-flex flex-column justify-content-center align-items-center">
                <p className="doctor-room-header-table-title">Số hiện tại</p>
                <p className="doctor-room-header-table-num">{currentNum}</p>
                <ButtonComponent
                  onClick={onClickNextNum}
                  content={
                    <p
                      className="button-content-text"
                      style={{ fontWeight: "normal" }}
                    >
                      Số tiếp theo
                    </p>
                  }
                  className=""
                  styleButton="light"
                />
              </div>
            </div>
          </div>
          <div className="col-4">
            <Calendar
              fullscreen={false}
              onPanelChange={onPanelChange}
              value={date} // Đảm bảo đây là đối tượng Dayjs
              onSelect={onSelectDate}
            />
          </div>
        </div>
      </div>
      <div className="doctor-room-content">
        <div className="doctor-room-content-header">
          <div className="d-flex justify-content-between align-items-center">
            <div className="doctor-room-content-header-title">
              <strong>Tìm kiếm : </strong>
            </div>
            <InputComponent
              placeholder="Nhập tên bệnh nhân hoặc tiêu đề cuộc hẹn"
              value={search}
              setValue={setSearch}
              type="text"
              className="doctor-room-content-header-search"
            />
          </div>

          <div className="doctor-room-content-header-select">
            <div className="doctor-room-content-header-title">
              <strong>Trạng thái cuộc hẹn : </strong>
            </div>
            <ButtonComponent
              onClick={() => onChangeAppointmentStatus("all")}
              content={<p className="button-content-text">Tất cả</p>}
              className="doctor-room-content-header-select-item"
              styleButton={appointmentStatus === "all" ? "dark" : "light"}
            />
            {appointmentStatusList.map((status) => (
              <ButtonComponent
                key={status}
                onClick={() => onChangeAppointmentStatus(status)}
                content={
                  <p className="button-content-text">
                    {ExaminationStatusEnum[status]}
                  </p>
                }
                className="doctor-room-content-header-select-item"
                styleButton={
                  appointmentStatus === status || appointmentStatus === "all"
                    ? "dark"
                    : "light"
                }
              />
            ))}
          </div>
        </div>
        <div className="doctor-room-content-main row">
          {paginatedAppointmentDetails &&
          paginatedAppointmentDetails.length > 0 ? (
            paginatedAppointmentDetails.map((item) => (
              <div
                key={item._id}
                className="col-4 d-flex justify-content-center align-items-center"
              >
                <AppointmentDetail value={item} />
              </div>
            ))
          ) : (
            <NoData />
          )}
        </div>
        {paginatedAppointmentDetails &&
          paginatedAppointmentDetails.length > 0 && (
            <div className="w-100 d-flex justify-content-center align-items-center my-2">
              <Pagination
                current={page}
                pageSize={limit}
                total={total}
                onChange={(pageA, pageSize) => {
                  setPage(pageA);
                  setLimit(pageSize);
                }}
                style={{ marginTop: 16, textAlign: "right" }}
              />
            </div>
          )}
      </div>
    </div>
  );
}

export default DoctorRoom;
