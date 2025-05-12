import React from "react";
import "./index.scss";

function SpecCard({ value }) {
  return (
    <div className="spec-card-container">
      <img
        className="spec-card-image"
        src={value?.image}
        alt="Specialist img"
      />
      <p className="spec-card-name">{value?.name}</p>
      <div className="spec-card-tag"></div>
    </div>
  );
}

export default SpecCard;
