import React from "react";
import "./index.scss";
import InpuComponent from "../../../../../components/InputComponent";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import InputComponent from "../../../../../components/InputComponent";

function DiagnosisComponent({ value, onChange, index, onRemove, isEditable }) {
  const handleChange = (inputKey, inputValue) => {
    onChange(index, { ...value, [inputKey]: inputValue });
  };

  const handleAddPrescription = () => {
    if (!isEditable) return;
    const newPrescription = {
      medicine: "",
      dosage: "",
      frequency: "",
      duration: "",
    };
    handleChange("prescription", [...value.prescription, newPrescription]);
  };

  const handleRemovePrescription = (indexPres) => {
    const newPrescription = [...value.prescription];
    newPrescription.splice(indexPres, 1);
    handleChange("prescription", newPrescription);
  };

  return (
    <div className="diagnosis-component-container">
      <div className="d-flex justify-content-between align-items-center  my-2">
        <p className="diagnosis-component-title">Chuẩn đoán {index + 1}</p>
        {index !== 0 && (
          <Button
            className="diagnosis-component-button-delete"
            onClick={() => onRemove(index)}
            disabled={!isEditable}
          >
            <DeleteOutlined />
          </Button>
        )}
      </div>
      <div className="d-flex justify-content-between align-items-center my-2">
        <p className="diagnosis-component-title">Kết quả : </p>
        <InpuComponent
          placeholder="Nhập kết quả"
          value={value.diagnosis}
          setValue={(value) => handleChange("diagnosis", value)}
          type="text"
          className="diagnosis-component-input-result"
          disabled={!isEditable}
        />
      </div>
      <div className="d-flex justify-content-between align-items-center my-2">
        <p className="diagnosis-component-title">Đơn thuốc</p>
        <ButtonComponent
          onClick={handleAddPrescription}
          content={<p className="button-content-text">Thêm đơn thuốc</p>}
          className="diagnosis-component-button"
          styleButton="dark"
          disabled={!isEditable}
        />
      </div>

      <div className="diagnosis-component-prescription">
        <div className="diagnosis-component-prescription-header row">
          <div className="col-4 d-flex justify-content-center align-items-center">
            <strong>Tên thuốc</strong>
          </div>
          <div className="col-2 d-flex justify-content-center align-items-center">
            <strong>Số lượng</strong>
          </div>
          <div className="col-2 d-flex justify-content-center align-items-center">
            <strong>Thời gian</strong>
          </div>
          <div className="col-4 d-flex justify-content-center align-items-center">
            <strong>Ghi chú</strong>
          </div>
        </div>

        {value.prescription.map((item, indexPres) => (
          <div
            className="diagnosis-component-prescription-item row"
            key={indexPres}
          >
            <div className="col-4 d-flex justify-content-center align-items-center">
              <InpuComponent
                placeholder="Nhập tên thuốc"
                value={item.medicine}
                setValue={(valueInput) => {
                  const newPrescription = [...value.prescription];
                  newPrescription[indexPres].medicine = valueInput;
                  handleChange("prescription", newPrescription);
                }}
                type="text"
                className="diagnosis-component-input"
                disabled={!isEditable}
              />
            </div>
            <div className="col-2 d-flex justify-content-center align-items-center">
              <InpuComponent
                placeholder="Nhập số lượng"
                value={item.dosage}
                setValue={(valueInput) => {
                  const newPrescription = [...value.prescription];
                  newPrescription[indexPres].dosage = valueInput;
                  handleChange("prescription", newPrescription);
                }}
                type="text"
                className="diagnosis-component-input"
                disabled={!isEditable}
              />
            </div>
            <div className="col-2 d-flex justify-content-center align-items-center">
              <InpuComponent
                placeholder="Nhập thời gian"
                value={item.duration}
                setValue={(valueInput) => {
                  const newPrescription = [...value.prescription];
                  newPrescription[indexPres].duration = valueInput;
                  handleChange("prescription", newPrescription);
                }}
                type="text"
                className="diagnosis-component-input"
                disabled={!isEditable}
              />
            </div>
            <div className="col-4 d-flex justify-content-center align-items-center my-2">
              <InpuComponent
                placeholder="Nhập ghi chú"
                value={item.frequency}
                setValue={(valueInput) => {
                  const newPrescription = [...value.prescription];
                  newPrescription[indexPres].frequency = valueInput;
                  handleChange("prescription", newPrescription);
                }}
                type="text"
                className="diagnosis-component-input"
                disabled={!isEditable}
              />
              {indexPres !== 0 && (
                <Button
                  className="diagnosis-component-button-delete"
                  onClick={() => handleRemovePrescription(indexPres)}
                  disabled={!isEditable}
                >
                  <DeleteOutlined />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="w-100 d-flex flex-column">
        <p className="diagnosis-component-title my-2">Ghi chú</p>
        <InputComponent
          placeholder="Nhập ghi chú"
          value={value.note}
          setValue={(valueInput) => {
            handleChange("note", valueInput);
          }}
          type="text"
          className="diagnosis-component-input"
          disabled={!isEditable}
        />
      </div>
    </div>
  );
}

export default DiagnosisComponent;
