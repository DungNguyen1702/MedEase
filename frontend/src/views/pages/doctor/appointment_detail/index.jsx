import "./index.scss";
import FakeData from "../../../../data/FakeData.json";
import { useState } from "react";
import { Avatar, Button } from "antd";
import { formatDateToYYYYMMDD } from "../../../../utils/stringUtil";
import {
  ExaminationStatusColor,
  ExaminationStatusEnum,
} from "../../../../constants/constants";
import "bootstrap/dist/css/bootstrap.min.css";
import ButtonComponent from "../../../../components/ButtonComponent";
import DiagnosisComponent from "./DiagnosisComponent";
import ReExamComponent from "./ReExamComponent";

const DoctorAppointmentDetail = () => {
  const [appointmentDetail, setAppointmentDetail] = useState(
    FakeData.appointmentDetails[0]
  );

  const predictedDiseases = [
    {
      name: "Xốt",
      rate: "80%",
    },
    {
      name: "Cúm",
      rate: "70%",
    },
    {
      name: "Viêm họng",
      rate: "60%",
    },
  ];

  const [diagnosis, setDiagnosis] = useState([
    {
      diagnosis: "",
      prescription: [
        {
          medicine: "",
          dosage: "",
          frequency: "",
          duration: "",
        },
      ],
      note: "",
    },
  ]);

  const [reExams, setReExams] = useState([
    {
      diagnosis: "",
      re_exam_date: "",
      note: "",
    },
  ]);

  const onPressPredictedDiseases = () => {
    console.log("onPressPredictedDiseases");
  };

  const onRemoveDiagnosis = (index) => {
    const newDiagnosis = [...diagnosis];
    newDiagnosis.splice(index, 1);
    setDiagnosis(newDiagnosis);
  };

  const onRemoveReExam = (index) => {
    const newReExams = [...reExams];
    newReExams.splice(index, 1);
    setReExams(newReExams);
  };
  const onAddReExam = () => {
    const newReExam = {
      diagnosis: "",
      date: "",
      re_exam_date: "",
    };
    setReExams([...reExams, newReExam]);
  };

  const onAddDiagnosis = () => {
    const newDiagnosis = {
      diagnosis: "",
      prescription: [
        {
          medicine: "",
          dosage: "",
          frequency: "",
          duration: "",
        },
      ],
      note: "",
    };
    setDiagnosis([...diagnosis, newDiagnosis]);
  };

  const onChangeReExam = (index, value) => {
    const newReExams = [...reExams];
    newReExams[index] = value;
    setReExams(newReExams);
  };

  const onChangeDiagnosis = (index, value) => {
    const newDiagnosis = [...diagnosis];
    newDiagnosis[index] = value;
    setDiagnosis(newDiagnosis);
  };

  const onSubmit = () => {
    console.log("onSubmit");
  };

  return (
    <div className="appointment-detail">
      <section className="appointment-info">
        <div className="appointment-title">
          <div className="title">{appointmentDetail?.appointment?.title}</div>
          <div className="appointment-number">
            {appointmentDetail?.appointment?.number}
          </div>
        </div>

        <div className="patient-info ">
          <div className="info-group">
            <div className="label">Bệnh nhân : </div>
            <Avatar
              src={appointmentDetail?.appointment?.patient?.avatar}
              size={50}
              shape="circle"
            />
            <div className="value">
              {appointmentDetail?.appointment?.patient?.name}
            </div>
          </div>
          <div className="info-group">
            <div className="label">Khoa : </div>
            <div className="value">
              {appointmentDetail?.specialization?.name}
            </div>
          </div>
        </div>

        <div className="appointment-details">
          <div className="details-column">
            <div className="info-row">
              <div className="label">Ngày khám : </div>
              <div className="value">
                {formatDateToYYYYMMDD(
                  appointmentDetail?.appointment?.appointment_date
                )}
              </div>
            </div>
          </div>
          <div className="details-column">
            <div className="info-row">
              <div className="label">Giờ khám : </div>
              <div className="value">{appointmentDetail?.time}</div>
            </div>
          </div>
        </div>

        <div className="appointment-details">
          <div className="details-column">
            <div className="info-row">
              <div className="label">Lý do hủy : </div>
              <div className="value">
                {appointmentDetail?.appointment?.reasonCancel
                  ? appointmentDetail?.appointment?.reasonCancel
                  : "Không có lý do"}
              </div>
            </div>
          </div>
          <div className="details-column">
            <div className="info-row">
              <div className="label">Trạng thái : </div>
              <div
                className="status-badge"
                style={{
                  backgroundColor:
                    ExaminationStatusColor[appointmentDetail?.examStatus],
                }}
              >
                {ExaminationStatusEnum[appointmentDetail?.examStatus]}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="medical-record">
        <div className="section-title">Triệu chứng</div>
        <div className="symptoms-input">
          {appointmentDetail?.appointment?.symptoms}
        </div>

        <div className="diagnosis-section">
          <div className="section-header">
            <div className="section-title">Bệnh dự đoán</div>
            <ButtonComponent
              onClick={onPressPredictedDiseases}
              content={<p className="button-content-text">Dự đoán</p>}
              className="diagnosis-button"
              styleButton="dark"
            />
          </div>

          <div className="diagnosis-table">
            <div className="table-header">
              <div className="table-first-row">STT</div>
              <div className="divider" />
              <div className="table-second-row">Bệnh</div>
              <div className="divider" />
              <div className="table-third-row">Tỉ lệ</div>
            </div>
            <div className="divider-horizontal" />
            {predictedDiseases.map((disease, index) => (
              <>
                <div className="table-row" key={index}>
                  <div className="table-first-row">{index + 1}</div>
                  <div className="divider" />
                  <div className="table-second-row">{disease.name}</div>
                  <div className="divider" />
                  <div className="table-third-row">{disease.rate}</div>
                </div>
                <div className="divider-horizontal" />
              </>
            ))}
          </div>
        </div>

        <div className="w-100 d-flex justify-content-between align-items-center my-4">
          <div className="section-title">Bệnh chuẩn đoán</div>
          <ButtonComponent
            onClick={onAddDiagnosis}
            content={<p className="button-content-text">Thêm chuẩn đoán</p>}
            className="diagnosis-button"
            styleButton="dark"
          />
        </div>
        {diagnosis.map((item, index) => (
          <DiagnosisComponent
            value={item}
            key={index}
            index={index}
            onChange={onChangeDiagnosis}
            onRemove={onRemoveDiagnosis}
          />
        ))}

        <div className="d-flex justify-content-between align-items-center my-4">
          <div className="section-title">Lịch tái khám</div>
          <ButtonComponent
            onClick={onAddReExam}
            content={<p className="button-content-text">Thêm lịch tái khám</p>}
            className="diagnosis-button"
            styleButton="dark"
          />
        </div>
        {reExams.map((item, index) => (
          <ReExamComponent
            diagnosis={diagnosis}
            value={item}
            key={index}
            index={index}
            onChange={onChangeReExam}
            onRemove={onRemoveReExam}
          />
        ))}
      </section>

      <div className="w-100 d-flex align-items-center justify-content-center my-3">
        <Button
          onClick={onSubmit}
          className="diagnosis-button-save"
          styleButton="dark"
        >
          <p className="diagnosis-button-save-text">Lưu trữ và chuyển số</p>
        </Button>
      </div>
    </div>
  );
};

export default DoctorAppointmentDetail;
