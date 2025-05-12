import React from "react";
import "./index.scss";

function DoctorCard({ value }) {
  return (
    <div className="doctor-card-container">
      <div className="doctor-card-tag"></div>
      <img
        className="doctor-card-image"
        src={value?.account?.avatar}
        alt="Doctor avatar"
      />
      <p className="doctor-card-name">{value?.account?.name}</p>
    </div>
  );
}

export default DoctorCard;
