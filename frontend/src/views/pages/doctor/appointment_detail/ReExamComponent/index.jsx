import { Button, DatePicker, Select } from "antd";
import React from "react";
import InputComponent from "../../../../../components/InputComponent";
import { DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

function ReExamComponent({
  diagnosis,
  value,
  onChange,
  index,
  onRemove,
  isEditable,
}) {
  const handleChange = (inputKey, inputValue) => {
    onChange(index, { ...value, [inputKey]: inputValue });
  };

  const onChangeDate = (date, dateString) => {
    handleChange("re_exam_date", dateString); // Lưu lại dạng YYYY-MM-DD hoặc DD/MM/YYYY tùy backend
  };

  return (
    <div className="diagnosis-component-container">
      <div className="d-flex justify-content-between align-items-center  my-2">
        <p className="diagnosis-component-title">Tái khám {index + 1}</p>
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

      <div className="d-flex justify-content-between align-items-center  my-2 row">
        <div className="col-6 d-flex justify-content-between align-items-center">
          <p className="diagnosis-component-title">Ngày : </p>
          <DatePicker
            className="diagnosis-component-input-result"
            onChange={onChangeDate}
            format={"YYYY-MM-DD"}
            value={value.re_exam_date ? dayjs(value.re_exam_date) : null}
            allowClear={false}
            disabled={!isEditable}
          />
        </div>
        <div className="col-6 d-flex justify-content-between align-items-center">
          <p className="diagnosis-component-title">Chuẩn đoán tương ứng : </p>
          <Select
            value={value.diagnosis}
            onChange={(val) => handleChange("diagnosis", val)}
            options={diagnosis.map((item) => ({
              label: item.diagnosis,
              value: item.diagnosis,
            }))}
            className="diagnosis-component-input-result w-80"
            disabled={!isEditable}
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
          disabled={!isEditable}
        />
      </div>
    </div>
  );
}

export default ReExamComponent;
