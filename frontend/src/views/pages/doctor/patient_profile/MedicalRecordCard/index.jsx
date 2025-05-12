import React from "react";
import "./index.scss";

function MedicalRecordCard({ value }) {
  return (
    <div className="medical-record-card-container">
      <h3 className="medical-record-card-title">Hồ sơ y tế</h3>
      <div className="medical-record-card-content">
        <p>
          <strong>Triệu chứng: </strong>
          {value?.symptoms || "Không có thông tin"}
        </p>
        <p>
          <strong>Chuẩn đoán: </strong>
          {value?.diagnosis || "Không có thông tin"}
        </p>
        <div>
          <strong>Đơn thuốc:</strong>
          {value?.prescription?.length > 0 ? (
            <ul>
              {value.prescription.map((item) => (
                <li key={item._id}>
                  <strong>{item.medicine}</strong> - {item.dosage},{" "}
                  {item.frequency}, {item.duration}
                </li>
              ))}
            </ul>
          ) : (
            <p>Không có đơn thuốc</p>
          )}
        </div>
        <p>
          <strong>Ghi chú: </strong>
          {value?.note || "Không có ghi chú"}
        </p>
      </div>
    </div>
  );
}

export default MedicalRecordCard;
