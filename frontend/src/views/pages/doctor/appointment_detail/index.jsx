import "./index.scss";
import { useEffect, useState } from "react";
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
import NoData from "../../../../components/NoData";
import { appointmentAPI } from "../../../../api/appointmentAPI";
import { predictDiseaseAPI } from "../../../../api/predictDiseaseAPI";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../../../context/AuthContext";

const DoctorAppointmentDetail = () => {
  const { id } = useParams();
  const { account } = useAuth();

  const [appointmentDetail, setAppointmentDetail] = useState({});

  const [predictedDiseases, setPredictedDiseases] = useState([]);

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

  const [isEditable, setIsEditable] = useState(false);

  const onPressPredictedDiseases = async () => {
    const response = await predictDiseaseAPI.getPredictDisease(
      appointmentDetail?.appointment?.symptoms
    );
    console.log("response", response);

    setPredictedDiseases(response?.data?.results?.slice(0, 5));
  };

  const onRemoveDiagnosis = (index) => {
    const newDiagnosis = [...diagnosis];
    newDiagnosis.splice(index, 1);
    setDiagnosis(newDiagnosis);
  };

  const onRemoveReExam = (index) => {
    if (!isEditable) return;
    const newReExams = [...reExams];
    newReExams.splice(index, 1);
    setReExams(newReExams);
  };

  const onAddReExam = () => {
    if (!isEditable) return;

    const newReExam = {
      diagnosis: "",
      re_exam_date: "",
      note: "",
    };
    setReExams([...reExams, newReExam]);
  };

  const onAddDiagnosis = () => {
    if (!isEditable) return;
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
    // Kiểm tra trùng tên
    const isDuplicate = diagnosis.some(
      (item, idx) => idx !== index && item.diagnosis === value.diagnosis
    );
    if (isDuplicate) {
      toast.error("Tên chuẩn đoán đã tồn tại, vui lòng chọn tên khác!");
      return;
    }
    const newDiagnosis = [...diagnosis];
    newDiagnosis[index] = value;
    setDiagnosis(newDiagnosis);
  };

  const onSubmit = async () => {
    // Build payload đúng chuẩn DTO
    const payload = {
      appointment_id: appointmentDetail?.appointment?._id,
      patient_id: appointmentDetail?.appointment?.patient?._id,
      symptoms: appointmentDetail?.appointment?.symptoms,
      predicted_disease: predictedDiseases.map((d) => ({
        name: d.name,
        percent: d.percent,
      })),
      medicalrecords: diagnosis.map((d) => {
        const obj = {
          diagnosis: d.diagnosis,
          prescription: d.prescription,
          note: d.note,
        };
        if (d._id) obj._id = d._id;
        return obj;
      }),
      reexamschedules: reExams.map((r) => {
        const obj = {
          diagnosis: r.diagnosis,
          re_exam_date: r.re_exam_date,
          note: r.note,
        };
        if (r._id) obj._id = r._id;
        return obj;
      }),
    };

    // console.log("Payload gửi lên backend:", payload);

    // Validate payload before sending
    if (!validatePayload(payload)) {
      return;
    }

    try {
      const res = await appointmentAPI.updateAppointmentDetail(payload);
      if (res && res.data) {
        console.log("Lưu trữ và chuyển số thành công:", res.data);
        toast.success("Lưu trữ và chuyển số thành công");
      }
    } catch (error) {
      console.log("Error submitting appointment detail:", error);
      toast.error("Lưu trữ và chuyển số thất bại");
    }

    // setIsEditable(false);
  };

  const callAPI = async () => {
    try {
      const res = await appointmentAPI.getAppointmentDetail(id);
      console.log("res", res?.data?.appointment?.predicted_disease);
      if (res && res.data) {
        setAppointmentDetail(res?.data);
        setPredictedDiseases(res?.data?.appointment?.predicted_disease);
        setDiagnosis(
          res.data.appointment.medicalrecords.length > 0
            ? res.data.appointment.medicalrecords.map((item) => ({
                _id: item._id,
                diagnosis: item.diagnosis,
                prescription: item.prescription,
                note: item.note,
              }))
            : [
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
              ]
        );
        setReExams(
          res.data.appointment.reexamschedules.length > 0
            ? res.data.appointment.reexamschedules.map((item) => {
                const diagnosisItem = res.data.appointment.medicalrecords.find(
                  (mr) => String(mr._id) === String(item.medical_record_id)
                );
                return {
                  _id: item._id,
                  diagnosis: diagnosisItem ? diagnosisItem.diagnosis : "",
                  diagnosisId: item.medical_record_id,
                  re_exam_date: formatDateToYYYYMMDD(item.re_exam_date),
                  note: item.note,
                };
              })
            : [
                {
                  diagnosis: "",
                  diagnosisId: "",
                  re_exam_date: "",
                  note: "",
                },
              ]
        );
      }
    } catch (error) {
      console.log("Error fetching appointment detail:", error);
    }
  };

  useEffect(() => {
    callAPI();
  }, []);

  useEffect(() => {
    if (appointmentDetail?.appointment?.medicalrecords && account?._id) {
      const canEdit = appointmentDetail.appointment.medicalrecords.some(
        (mr) => String(mr.doctor_id) === String(account._id)
      );
      setIsEditable(canEdit);
    }
  }, [appointmentDetail, account]);

  const uniqueDiagnosisList = [
    ...new Map(diagnosis.map((item) => [item.diagnosis, item])).values(),
  ];

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

          {predictedDiseases && predictedDiseases.length > 0 ? (
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
                    <div className="table-third-row">{disease.percent}%</div>
                  </div>
                  <div className="divider-horizontal" />
                </>
              ))}
            </div>
          ) : (
            <NoData />
          )}
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
        {uniqueDiagnosisList.map((item, index) => (
          <DiagnosisComponent
            value={item}
            key={index}
            index={index}
            onChange={onChangeDiagnosis}
            onRemove={onRemoveDiagnosis}
            isEditable={isEditable}
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
            isEditable={isEditable}
          />
        ))}
      </section>

      <div className="w-100 d-flex align-items-center justify-content-center my-3">
        {isEditable ? (
          <ButtonComponent
            onClick={onSubmit}
            className="diagnosis-button-save"
            styleButton="dark"
            content={
              <p className="diagnosis-button-save-text">Lưu trữ và chuyển số</p>
            }
          />
        ) : (
          <ButtonComponent
            onClick={() => setIsEditable(true)}
            className="diagnosis-button-save"
            styleButton="dark"
            content={<p className="diagnosis-button-save-text">Chỉnh sửa</p>}
          />
        )}
      </div>
    </div>
  );
};

function validatePayload(payload) {
  if (!payload.appointment_id) {
    toast.error("Thiếu mã lịch hẹn!");
    return false;
  }
  if (!payload.patient_id) {
    toast.error("Thiếu mã bệnh nhân!");
    return false;
  }
  if (!payload.medicalrecords || payload.medicalrecords.length === 0) {
    toast.error("Phải có ít nhất 1 chuẩn đoán!");
    return false;
  }
  for (const d of payload.medicalrecords) {
    if (!d.diagnosis) {
      toast.error("Tên chuẩn đoán không được để trống!");
      return false;
    }
    if (!d.prescription || d.prescription.length === 0) {
      toast.error("Chuẩn đoán phải có ít nhất 1 đơn thuốc!");
      return false;
    }
    for (const p of d.prescription) {
      if (!p.medicine || !p.dosage || !p.frequency || !p.duration) {
        toast.error("Đơn thuốc không được để trống thông tin!");
        return false;
      }
    }
  }
  for (const r of payload.reexamschedules || []) {
    if (!r.diagnosis) {
      toast.error("Lịch tái khám phải chọn chuẩn đoán!");
      return false;
    }
    if (!r.re_exam_date) {
      toast.error("Lịch tái khám phải có ngày!");
      return false;
    }
  }
  return true;
}

export default DoctorAppointmentDetail;
