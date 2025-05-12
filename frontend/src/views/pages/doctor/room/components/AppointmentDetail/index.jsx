import React from "react";
import "./index.scss";
import {
  ExaminationStatusColor,
  ExaminationStatusEnum,
} from "../../../../../../constants/constants";
import { formatDateToYYYYMMDD } from "../../../../../../utils/stringUtil";
import { useNavigate } from "react-router-dom";

function AppointmentDetail({ value }) {
  const navigate = useNavigate();

  const onClickAppointmentDetail = () => {
    navigate("/doctor/appointment-detail/" + value?._id);
  };

  return (
    <div
      className="doctor-room-appointmnet-detail-container"
      onClick={onClickAppointmentDetail}
    >
      <div className="doctor-room-appointmnet-detail-header">
        <h3 className="doctor-room-appointmnet-detail-title">
          {value?.appointment?.title}
        </h3>
        <div
          className="doctor-room-appointmnet-detail-status"
          style={{ backgroundColor: ExaminationStatusColor[value?.examStatus] }}
        >
          {ExaminationStatusEnum[value?.examStatus]}
        </div>
      </div>
      <div className="w-100 d-flex justify-content-center align-items-center">
        <img
          alt="user avatar"
          src={value?.appointment?.patient?.avatar}
          className="doctor-room-appointmnet-detail-avatar"
        />
      </div>
      <div className="doctor-room-appointmnet-detail-content">
        <p>
          <strong>Bệnh nhân : </strong>
          {value?.appointment?.patient?.name}
        </p>
        <p>
          <strong>Ngày sinh : </strong>
          {value?.appointment?.patient?.date_of_birth}
        </p>
        <div>
          <strong>Triệu chứng : </strong>
          <p>{value?.appointment?.symptoms}</p>
        </div>
      </div>
      <div className="doctor-room-appointmnet-detail-footer">
        <p className="doctor-room-appointmnet-detail-createdAt font-italic">
          {formatDateToYYYYMMDD(value?.appointment?.createdAt)}
        </p>
        <p className="doctor-room-appointmnet-detail-num">
          {value?.appointment?.number}
        </p>
      </div>
      <div className="doctor-room-appointmnet-detail-tag"></div>
    </div>
  );
}

export default AppointmentDetail;
