import React, { useEffect, useState } from "react";
import FakeData from "../../../../data/FakeData.json";
import { Avatar } from "antd";
import {
  formatDateToYYYYMMDD,
  paginateData,
} from "../../../../utils/stringUtil";
import AppointmentCard from "./AppointmentCard";
import PaginationComponent from "../../../../components/Pagination";
import MedicalRecordCard from "./MedicalRecordCard";
import "./index.scss";
import { patientAPI } from "../../../../api/patientAPI";
import { useParams } from "react-router-dom";
import NoData from "../../../../components/NoData";

function PatientProfile() {
  const { id } = useParams();

  const [appointments, setAppointments] = useState(FakeData.appointmentDetails);
  const [medicalRecords, setMedicalRecords] = useState(FakeData.medical_record);
  const [patient, setPatient] = useState(FakeData.patients[0]);

  // pagination
  const [total, setTotal] = useState({
    appointment: appointments.length,
    medicalRecord: medicalRecords.length,
  });
  const [page, setPage] = useState({
    appointment: 1,
    medicalRecord: 1,
  });
  const [limit, setLimit] = useState({
    appointment: 4,
    medicalRecord: 3,
  });

  // pagination data
  const [paginatedAppointments, setPaginatedAppointments] = useState(
    paginateData(appointments, page.appointment, limit.appointment)
  );
  const [paginatedMedicalRecords, setPaginatedMedicalRecords] = useState(
    paginateData(medicalRecords, page.medicalRecord, limit.medicalRecord)
  );

  useEffect(() => {
    setPaginatedAppointments(
      paginateData(appointments, page.appointment, limit.appointment)
    );
    setPaginatedMedicalRecords(
      paginateData(medicalRecords, page.medicalRecord, limit.medicalRecord)
    );
  }, [page, limit, appointments, medicalRecords]);

  const callAPI = async () => {
    try {
      const res = await patientAPI.getPatientProfile(id);
      if (res && res.data) {
        setPatient(res.data.patient);
        setAppointments(res.data.appointments);
        setMedicalRecords(res.data.medicalRecords);
        setTotal({
          appointment: res.data.total.appointment,
          medicalRecord: res.data.total.medicalRecord,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    callAPI();
  }, []);

  return (
    <div className="patient-profile-container">
      <div className="patient-profile-header">
        <div className="w-100 d-flex flex-column justify-content-between align-items-center">
          <Avatar
            size={100}
            src={patient?.avatar}
            className="patient-profile-avatar"
            shape="circle"
          />
          <p className="patient-profile-header-name">{patient?.name}</p>
          <p className="patient-profile-header-mail">{patient?.email}</p>
        </div>

        <div className="patient-profile-header-info">
          <div className="patient-profile-header-info-item row">
            <div className="col-6 d-flex ">
              <p className="patient-profile-header-info-item-content">
                <strong>Địa chỉ : </strong>
                {patient?.address}
              </p>
            </div>
            <div className="col-6 d-flex ">
              <p className="patient-profile-header-info-item-content">
                <strong>Số điện thoại : </strong>
                {patient?.tel}
              </p>
            </div>
          </div>
          <div className="patient-profile-header-info-item row">
            <div className="col-6 d-flex ">
              <p className="patient-profile-header-info-item-content">
                <strong>Ngày sinh : </strong>
                {formatDateToYYYYMMDD(patient?.date_of_birth)}
              </p>
            </div>
            <div className="col-6 d-flex ">
              <p className="patient-profile-header-info-item-content">
                <strong>Giới tính : </strong>
                {patient?.gender === "male" ? "Nam" : "Nữ"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="patient-profile-footer">
        {/* <div className="patient-profile-footer"> */}
        <div className="patient-profile-footer-item-container">
          <p className="patient-profile-footer-item-title">Số lịch hẹn</p>
          {paginatedAppointments && paginatedAppointments.length !== 0 ? (
            <>
              {paginatedAppointments.map((appointment) => (
                <AppointmentCard value={appointment} key={appointment?._id} />
              ))}
              <PaginationComponent
                page={page.appointment}
                limit={limit.appointment}
                total={total.appointment}
                setPage={(value) => {
                  setPage({ ...page, appointment: value });
                }}
                setLimit={(value) => {
                  setLimit({ ...limit, appointment: value });
                }}
              />
            </>
          ) : (
            <NoData />
          )}
        </div>

        <div className="patient-profile-footer-item-container">
          <p className="patient-profile-footer-item-title">Lịch sử khám bệnh</p>
          {paginatedMedicalRecords && paginatedMedicalRecords.length !== 0 ? (
            <>
              {paginatedMedicalRecords.map((medicalRecordCard) => (
                <MedicalRecordCard
                  value={medicalRecordCard}
                  key={medicalRecordCard?._id}
                />
              ))}
              <PaginationComponent
                page={page.medicalRecord}
                limit={limit.medicalRecord}
                total={total.medicalRecord}
                setPage={(value) => {
                  setPage({ ...page, medicalRecord: value });
                }}
                setLimit={(value) => {
                  setLimit({ ...limit, medicalRecord: value });
                }}
              />
            </>
          ) : (
            <NoData />
          )}
        </div>
      </div>
    </div>
  );
}

export default PatientProfile;
