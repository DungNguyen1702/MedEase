import React from "react";
import "./index.scss";
import { calculateAge } from "../../../../../../utils/stringUtil";
import { useNavigate } from "react-router-dom";

function PatientCard({ value }) {
  const navigate = useNavigate();
  const onClickPatientCard = () => {
    navigate(`/doctor/patient/${value?._id}`);
  };

  return (
    <div className="patient-card-container" onClick={onClickPatientCard}>
      <div className="patient-card-header">
        <img src={value?.avatar} alt="Avatar" className="patient-card-avatar" />
        <h3 className="patient-card-name">{value?.name}</h3>
      </div>
      <div className="patient-card-divide"></div>
      <div className="patient-card-details">
        <p className="patient-card-detail">
          <strong>Tuổi : </strong> {calculateAge(value?.date_of_birth)} tuổi
        </p>
        <p className="patient-card-detail">
          <strong>Email : </strong> {value?.email} tuổi
        </p>
        <p className="patient-card-detail">
          <strong>Số lần khám : </strong> {value?.appointmentNumber} lần
        </p>
      </div>
    </div>
  );
}

export default PatientCard;
