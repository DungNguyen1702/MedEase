import { AppointmentType } from "../../../../../constants/constants";
import "./index.scss";

function AppointmentCard({ value }) {
  return (
    <div className="appointment-card-container">
      <div className="appointment-card-number">{value?.number}</div>
      <div className="appointment-card-content">
        <p className="appointment-card-title">{value?.title}</p>
        <p className="appointment-card-patient-name">
          <strong>Bệnh nhân : </strong>
          {value?.patient?.name}
        </p>
        <p className="appointment-card-time">
          <strong>Thể loại : </strong>
          {AppointmentType[value?.type]}
        </p>
        <p className="appointment-card-time">
          <strong>Thời gian : </strong>
          {value?.time}
        </p>
        <p className="appointment-card-time">
          <strong>Các khoa khám : </strong>
          {value?.appointment_detail?.length > 0
            ? value.appointment_detail.reduce((acc, detail, index) => {
                // Thêm dấu phẩy giữa các khoa, trừ khoa cuối cùng
                return acc + (index > 0 ? ", " : "") + detail?.address;
              }, "")
            : "Không có khoa nào"}
        </p>
        <p className="appointment-card-time">
          <strong>Triệu chứng : </strong>
          {value?.symptoms}
        </p>
      </div>
    </div>
  );
}

export default AppointmentCard;
