import "./index.scss";
import { useNavigate } from "react-router-dom";

function AppointmentCard({ value }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/doctor/appointment-detail/${value?.appointment?._id}`);
  }

  return (
    <div className="appointment-card-container" onClick={handleClick}>
      <div className="appointment-card-number">
        {value?.appointment?.number}
      </div>
      <div className="appointment-card-content">
        <p className="appointment-card-title">{value?.appointment?.title}</p>
        <p className="appointment-card-patient-name">
          <strong>Bệnh nhân : </strong>
          {value?.appointment?.patient?.name}
        </p>
        <p className="appointment-card-time">
          <strong>Thời gian : </strong>
          {value?.time}
        </p>
      </div>
      <img
        alt="Patient avatar"
        className="appointment-card-patient-avatar"
        src={value?.appointment?.patient?.avatar}
      />
    </div>
  );
}

export default AppointmentCard;
