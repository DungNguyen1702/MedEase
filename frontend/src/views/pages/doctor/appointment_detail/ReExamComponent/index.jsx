import { Button, DatePicker, Select } from "antd";
import React from "react";
import InputComponent from "../../../../../components/InputComponent";
import { DeleteOutlined } from "@ant-design/icons";

function ReExamComponent({ diagnosis, value, onChange, index, onRemove }) {
  const handleChange = (inputKey, inputValue) => {
    onChange(index, { ...value, [inputKey]: inputValue });
  };

  const onChangeDate = (date, dateString) => {
    console.log(date, dateString);
  };

  return (
    <div className="diagnosis-component-container">
      <div className="d-flex justify-content-between align-items-center  my-2">
        <p className="diagnosis-component-title">Tái khám {index + 1}</p>
        {index !== 0 && (
          <Button
            className="diagnosis-component-button-delete"
            onClick={() => onRemove(index)}
          >
            <DeleteOutlined />
          </Button>
        )}
      </div>

      <div className="d-flex justify-content-between align-items-center  my-2 row">
        <div className="col-6 d-flex justify-content-between align-items-center">
          <p className="diagnosis-component-title">Ngày : </p>
          <DatePicker
            className="diagnosis-component-input-result"
            onChange={onChangeDate}
            format={"DD/MM/YYYY"}
            value={value.date}
          />
        </div>
        <div className="col-6 d-flex justify-content-between align-items-center">
          <p className="diagnosis-component-title">Chuẩn đoán tương ứng : </p>
          <Select
            defaultValue={diagnosis[0].diagnosis}
            onChange={(value) => {
              handleChange("diagnosis", value);
            }}
            options={diagnosis.map((item) => {
              return {
                label: item.diagnosis,
                value: item.diagnosis,
              };
            })}
            className="diagnosis-component-input-result w-80"
          />
        </div>
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
        />
      </div>
    </div>
  );
}

export default ReExamComponent;
