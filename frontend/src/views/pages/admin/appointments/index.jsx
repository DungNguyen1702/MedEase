import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  Select,
  DatePicker,
  TimePicker,
  Space,
  Tag,
  Descriptions,
  Collapse,
  Card,
  Typography,
  InputNumber,
  Empty,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "./index.scss";
import { appointmentAPI } from "../../../../api/appointmentAPI";
import { patientAPI } from "../../../../api/patientAPI";
import { specAPI } from "../../../../api/specAPI";
import callAPIForm from "../../../../utils/callAPIForm";
import {
  AppointmentStatus,
  DoctorPosition,
  DoctorFeePercentageByPosition,
  AppointmentTypeFee,
  ExaminationStatusEnum,
  OrderPaymentMethod,
  AppointmentType,
} from "../../../../constants/constants";

import { calculateFee, calculateSumFee } from "../../../../utils/calculateFee";
import { toast } from "react-toastify";

const { Option } = Select;
const { Panel } = Collapse;
const { Text } = Typography;

const AdminAppointments = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState("add"); // 'add', 'edit', 'view'
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [form] = Form.useForm();
  const [doctorsBySpecialization, setDoctorsBySpecialization] = useState({});
  const [selectedSpecializations, setSelectedSpecializations] = useState([]);
  const [totalFee, setTotalFee] = useState(0);
  const [searchText, setSearchText] = useState("");

  // Sample data using the provided JSON structure
  const [appointmentsData, setAppointmentsData] = useState([]);

  // Sample patient data for dropdown
  const [patientsData, setPatientsData] = useState([]);

  // Sample specialization data
  const [specsData, setSpecData] = useState([]);

  const callApi = async () => {
    const appointmentsResponse = await appointmentAPI.getAllAppointments();
    const patientsResponse = await patientAPI.getAllPatients();
    const specsResponse = await specAPI.getAllSpec();

    setAppointmentsData(appointmentsResponse.data);
    setPatientsData(patientsResponse.data);
    setSpecData(specsResponse.data);
  };

  useEffect(() => {
    callAPIForm(callApi, "Lỗi khi truy vấn dữ liệu cuộc hẹn");
  }, []);

  // Appointment types
  const appointmentTypes = Object.entries(AppointmentType).map(
    ([value, label]) => ({
      value,
      label,
    })
  );

  // Payment methods
  const paymentMethods = Object.entries(OrderPaymentMethod).map(
    ([value, label]) => ({
      value,
      label,
    })
  );

  // Organize doctors by specialization
  useEffect(() => {
    const doctorMap = {};
    specsData.forEach((spec) => {
      doctorMap[spec._id] = spec.doctors.map((doctor) => ({
        _id: doctor._id,
        name: doctor.account.name,
        position: doctor.position,
        room: doctor.room,
        specialization_id: doctor.specialization_id,
        specialization_name: spec.name,
      }));
    });
    setDoctorsBySpecialization(doctorMap);
  }, [specsData]);

  // Update total fee when form values change
  useEffect(() => {
    const appointmentType = form.getFieldValue("type");
    if (appointmentType && selectedSpecializations.length > 0) {
      const total = calculateSumFee(selectedSpecializations, appointmentType);
      setTotalFee(total);
      form.setFieldsValue({ price: total });
    }
  }, [selectedSpecializations, form]);

  // Handle specialization selection
  const handleSpecializationChange = (specializationId, index) => {
    const newSelectedSpecs = [...selectedSpecializations];
    const selectedSpec = specsData.find(
      (spec) => spec._id === specializationId
    );

    let firstDoctor = null;
    if (
      selectedSpec &&
      selectedSpec.doctors &&
      selectedSpec.doctors.length > 0
    ) {
      const d = selectedSpec.doctors[0];
      firstDoctor = {
        _id: d._id,
        name: d.account.name,
        position: d.position,
        room: d.room,
        specialization_id: d.specialization_id,
        specialization_name: selectedSpec.name,
      };
    }

    if (selectedSpec) {
      newSelectedSpecs[index] = {
        spec: selectedSpec,
        doctor: firstDoctor,
      };
      setSelectedSpecializations(newSelectedSpecs);

      // Reset doctor selection for this specialization
      const details = form.getFieldValue("appointment_details") || [];
      details[index] = {
        ...details[index],
        doctor_id: firstDoctor ? firstDoctor._id : undefined,
        address: firstDoctor
          ? `${firstDoctor.room} - ${firstDoctor.specialization_name}`
          : "",
      };
      form.setFieldsValue({ appointment_details: details });
    }
  };

  // Handle doctor selection
  const handleDoctorChange = (doctorId, index) => {
    const newSelectedSpecs = [...selectedSpecializations];
    const specId = form.getFieldValue([
      "appointment_details",
      index,
      "specialization_id",
    ]);
    const selectedDoctor = doctorsBySpecialization[specId]?.find(
      (doctor) => doctor._id === doctorId
    );

    if (selectedDoctor && newSelectedSpecs[index]) {
      // Update the doctor in the selected specializations
      newSelectedSpecs[index] = {
        ...newSelectedSpecs[index],
        doctor: selectedDoctor,
      };
      setSelectedSpecializations(newSelectedSpecs);

      // Auto-fill the room based on the selected doctor
      const roomAddress = `${selectedDoctor.room} - ${selectedDoctor.specialization_name}`;
      const details = form.getFieldValue("appointment_details") || [];
      details[index] = {
        ...details[index],
        address: roomAddress,
      };
      form.setFieldsValue({ appointment_details: details });
    }
  };

  // Add a new specialization-doctor pair
  const addSpecialization = () => {
    const details = form.getFieldValue("appointment_details") || [];
    form.setFieldsValue({
      appointment_details: [...details, {}],
    });
  };

  // Remove a specialization-doctor pair
  const removeSpecialization = (index) => {
    const newSelectedSpecs = [...selectedSpecializations];
    newSelectedSpecs.splice(index, 1);
    setSelectedSpecializations(newSelectedSpecs);

    const details = form.getFieldValue("appointment_details") || [];
    details.splice(index, 1);
    form.setFieldsValue({ appointment_details: details });
  };

  // Format appointment type for display
  const formatAppointmentType = (type) => {
    const found = appointmentTypes.find((t) => t.value === type);
    return found ? found.label : type;
  };

  // Format payment method for display
  const formatPaymentMethod = (method) => {
    const found = paymentMethods.find((m) => m.value === method);
    return found ? found.label : method;
  };

  // Format status for display
  const getStatusTag = (status) => {
    let color = "";
    let text = "";

    switch (status) {
      case "done":
        color = "success";
        text = "Hoàn thành";
        break;
      case "in_progress":
        color = "processing";
        text = "Đang khám";
        break;
      case "wait":
        color = "warning";
        text = "Chờ khám";
        break;
      case "scheduled":
        color = "default";
        text = "Đã đặt lịch";
        break;
      case "cancel":
        color = "error";
        text = "Đã hủy";
        break;
      default:
        color = "default";
        text = status;
    }

    return <Tag color={color}>{text}</Tag>;
  };

  // Format payment status
  const getPaymentStatusTag = (isPaid) => {
    return isPaid ? (
      <Tag color="success">Đã thanh toán</Tag>
    ) : (
      <Tag color="warning">Chưa thanh toán</Tag>
    );
  };

  // Format position for display
  const formatPosition = (position) => {
    return DoctorPosition[position] || position;
  };

  // Format examination status
  const getExamStatusTag = (status) => {
    let color = "";
    let text = "";

    switch (status) {
      case "examined":
        color = "success";
        text = "Đã khám";
        break;
      case "in_progress":
        color = "processing";
        text = "Đang khám";
        break;
      case "not_examined":
        color = "default";
        text = "Chưa khám";
        break;
      default:
        color = "default";
        text = status;
    }

    return <Tag color={color}>{text}</Tag>;
  };

  const showModal = (type, appointment = null) => {
    setModalType(type);
    setSelectedAppointment(appointment);
    setIsModalVisible(true);

    if (type === "edit" || type === "view") {
      // Reset selected specializations
      setSelectedSpecializations([]);

      // Prepare appointment details for form
      const details = appointment.appointment_detail || [];
      const formattedDetails = details.map((detail) => ({
        specialization_id: detail.specialization_id,
        doctor_id: detail.doctor_id,
        address: detail.address,
        description: detail.description,
        examStatus: detail.examStatus,
        time: detail.time,
      }));

      // Set up selected specializations for fee calculation
      const selectedSpecs = details
        .map((detail) => {
          const spec = specsData.find(
            (s) => s._id === detail.specialization_id
          );
          const doctor = spec?.doctors.find((d) => d._id === detail.doctor_id);

          return {
            spec: spec,
            doctor: doctor
              ? {
                  _id: doctor._id,
                  name: doctor.account.name,
                  position: doctor.position,
                  room: doctor.room,
                  specialization_id: doctor.specialization_id,
                  specialization_name: spec.name,
                }
              : null,
          };
        })
        .filter((item) => item.spec && item.doctor);

      setSelectedSpecializations(selectedSpecs);

      form.setFieldsValue({
        title: appointment.title,
        patient_id: appointment.patient_id,
        appointment_date: appointment.appointment_date
          ? dayjs(appointment.appointment_date)
          : null,
        type: appointment.type,
        symptoms: appointment.symptoms,
        status: appointment.status,
        paymentMethod: appointment.paymentMethod,
        isPaid: appointment.isPaid,
        price: appointment.price,
        appointment_details: details.map((detail) => ({
          ...detail,
          time: detail.time ? dayjs(detail.time, "HH:mm") : null,
        })),
        reasonCancel: appointment.reasonCancel,
      });
    } else {
      form.resetFields();
      setSelectedSpecializations([]);
      setTotalFee(0);

      // Initialize with one empty specialization
      form.setFieldsValue({
        appointment_details: [{}],
      });
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const patientId = values.patient_id;

      const appointment_detail = (values.appointment_details || []).map(
        (item, idx) => ({
          specialization_id: item.specialization_id,
          doctor_id: item.doctor_id,
          price: selectedSpecializations[idx]
            ? calculateFee(
                selectedSpecializations[idx].spec.base_price,
                selectedSpecializations[idx].doctor?.position,
                values.type
              )
            : 0,
          time: item.time ? item.time.format("HH:mm") : undefined,
          address: item.address,
          examStatus: item.examStatus,
          description: item.description,
        })
      );

      const appointment_date = values.appointment_date
        ? values.appointment_date.format("YYYY-MM-DD")
        : undefined;

      const data = {
        title: values.title,
        appointment_date,
        time:
          appointment_detail.length === 1
            ? appointment_detail[0].time
            : undefined,
        type: values.type,
        symptoms: values.symptoms,
        predicted_disease: values.predicted_disease || [],
        appointment_detail,
        paymentMethod: values.paymentMethod,
        createdBy: "Dũng",
        totalPrice: values.price,
        status: values.status,
        reasonCancel: values.reasonCancel,
        isPaid: values.isPaid,
      };

      if (modalType === "add") {
        const res = await appointmentAPI.createAppointment(patientId, data);
        if (res && res.data) {
          setAppointmentsData((prev) => [res.data, ...prev]);
          setIsModalVisible(false);
          form.resetFields();
          setSelectedSpecializations([]);
          toast.success("Thêm cuộc hẹn thành công");
        }
      } else if (modalType === "edit" && selectedAppointment) {
        // Chuẩn hóa dữ liệu appointment_detail
        const appointment_detail = (values.appointment_details || []).map(
          (item, idx) => ({
            specialization_id: item.specialization_id,
            doctor_id: item.doctor_id,
            price: selectedSpecializations[idx]
              ? calculateFee(
                  selectedSpecializations[idx].spec.base_price,
                  selectedSpecializations[idx].doctor?.position,
                  values.type
                )
              : 0,
            examStatus: item.examStatus,
            description: item.description,
            time: item.time ? item.time.format("HH:mm") : undefined,
            room: item.address, // Lưu ý: nếu backend cần trường 'room', hãy truyền từ address
          })
        );

        const appointment_date = values.appointment_date
          ? values.appointment_date.format("YYYY-MM-DD")
          : undefined;

        const data = {
          patientId: values.patient_id || null,
          title: values.title,
          appointment_date,
          time:
            appointment_detail.length === 1
              ? appointment_detail[0].time
              : undefined,
          type: values.type,
          symptoms: values.symptoms,
          predicted_disease: values.predicted_disease || [],
          appointment_detail,
          paymentMethod: values.paymentMethod,
          createdBy: "Dũng",
          totalPrice: values.price,
          status: values.status,
          reasonCancel: values.reasonCancel,
          isPaid: values.isPaid,
        };

        const res = await appointmentAPI.updateAppointment(
          selectedAppointment._id,
          data
        );
        if (res && res.data) {
          setAppointmentsData((prev) =>
            prev.map((item) =>
              item._id === selectedAppointment._id ? res.data : item
            )
          );
          setIsModalVisible(false);
          form.resetFields();
          setSelectedSpecializations([]);
          toast.success("Chỉnh sửa cuộc hẹn thành công");
        }
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lưu/chỉnh sửa cuộc hẹn");
    }
  };

  // Handle appointment type change
  const handleAppointmentTypeChange = (value) => {
    // Recalculate total fee when appointment type changes
    if (value && selectedSpecializations.length > 0) {
      const total = calculateSumFee(selectedSpecializations, value);
      setTotalFee(total);
      form.setFieldsValue({ price: total });
    }
  };

  // Lọc dữ liệu theo title cuộc hẹn
  const filteredAppointments = appointmentsData.filter((appointment) => {
    const keyword = searchText.trim().toLowerCase();
    return appointment.title?.toLowerCase().includes(keyword);
  });

  const columns = [
    {
      title: "Mã cuộc hẹn",
      dataIndex: "number",
      key: "number",
      width: 100,
      render: (number) => `APT-${number.toString().padStart(5, "0")}`,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Ngày hẹn",
      dataIndex: "appointment_date",
      key: "appointment_date",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
      sorter: (a, b) =>
        new Date(a.appointment_date) - new Date(b.appointment_date),
    },
    {
      title: "Giờ hẹn",
      dataIndex: "time",
      key: "time",
      render: (_, record) => record.time || "-",
    },
    {
      title: "Loại khám",
      dataIndex: "type",
      key: "type",
      render: (type) => formatAppointmentType(type),
      filters: appointmentTypes.map((type) => ({
        text: type.label,
        value: type.value,
      })),
      onFilter: (value, record) => record.type === value,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
      filters: Object.entries(AppointmentStatus).map(([value, text]) => ({
        text,
        value,
      })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Thanh toán",
      key: "payment",
      render: (_, record) => getPaymentStatusTag(record.isPaid),
      filters: [
        { text: "Đã thanh toán", value: true },
        { text: "Chưa thanh toán", value: false },
      ],
      onFilter: (value, record) => record.isPaid === value,
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => showModal("view", record)}
            className="view-button"
          />
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => showModal("edit", record)}
            className="edit-button"
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          />
        </Space>
      ),
    },
  ];

  const getModalTitle = () => {
    switch (modalType) {
      case "add":
        return "Thêm cuộc hẹn mới";
      case "edit":
        return "Chỉnh sửa cuộc hẹn";
      case "view":
        return "Chi tiết cuộc hẹn";
      default:
        return "";
    }
  };

  // Get patient name by ID
  const getPatientName = (patientId) => {
    const patient = patientsData.find((p) => p._id === patientId);
    return patient ? patient.name : patientId;
  };

  // Lấy tên chuyên khoa từ id
  const getSpecializationName = (specId) => {
    const spec = specsData.find((s) => s._id === specId);
    return spec ? spec.name : specId;
  };

  // Lấy tên bác sĩ từ id
  const getDoctorName = (doctorId) => {
    for (const spec of specsData) {
      const doctor = spec.doctors.find((d) => d._id === doctorId);
      if (doctor) return doctor.account.name;
    }
    return doctorId;
  };

  // Lấy chức vụ bác sĩ từ id
  const getDoctorPosition = (doctorId) => {
    for (const spec of specsData) {
      const doctor = spec.doctors.find((d) => d._id === doctorId);
      if (doctor) {
        return formatPosition(doctor.position);
      }
    }
    return "";
  };

  // Calculate fee for a single specialization-doctor pair
  const calculateSpecializationFee = (specId, doctorId, appointmentType) => {
    const spec = specsData.find((s) => s._id === specId);
    if (!spec) return 0;

    const doctor = spec.doctors.find((d) => d._id === doctorId);
    if (!doctor) return 0;

    return calculateFee(spec.base_price, doctor.position, appointmentType);
  };

  const handleDelete = async (id) => {
    try {
      await appointmentAPI.deleteAppointment(id);
      setAppointmentsData((prev) => prev.filter((item) => item._id !== id));
      toast.success("Xóa cuộc hẹn thành công");
    } catch (error) {
      toast.error("Xóa cuộc hẹn thất bại");
    }
  };

  return (
    <div className="appointments-page">
      <div className="page-header">
        <h1 className="page-title">Quản lý cuộc hẹn</h1>
        <div className="header-actions">
          <Input
            placeholder="Tìm kiếm cuộc hẹn"
            prefix={<SearchOutlined />}
            className="search-input"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal("add")}
            className="add-button"
          >
            Thêm cuộc hẹn
          </Button>
        </div>
      </div>

      {/* Hiển thị kết quả tìm kiếm */}
      {searchText && (
        <div style={{ marginBottom: 12 }}>
          <span>
            Kết quả tìm kiếm cho: <b>{searchText}</b> (
            {filteredAppointments.length} kết quả)
          </span>
        </div>
      )}

      <Table
        columns={columns}
        dataSource={filteredAppointments}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
        className="appointments-table"
      />

      <Modal
        title={getModalTitle()}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={
          modalType === "view"
            ? [
                <Button key="back" onClick={handleCancel}>
                  Đóng
                </Button>,
              ]
            : [
                <Button key="back" onClick={handleCancel}>
                  Hủy
                </Button>,
                <Button key="submit" type="primary" onClick={handleSubmit}>
                  {modalType === "add" ? "Thêm" : "Lưu"}
                </Button>,
              ]
        }
        width={800}
      >
        {modalType === "view" && selectedAppointment ? (
          <div className="appointment-details">
            <Descriptions title="Thông tin cuộc hẹn" bordered column={2}>
              <Descriptions.Item label="Mã cuộc hẹn" span={2}>
                APT-{selectedAppointment.number.toString().padStart(5, "0")}
              </Descriptions.Item>
              <Descriptions.Item label="Tiêu đề" span={2}>
                {selectedAppointment.title}
              </Descriptions.Item>
              <Descriptions.Item label="Bệnh nhân">
                {getPatientName(selectedAppointment.patient_id)}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {dayjs(selectedAppointment.createdAt).format("DD/MM/YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày hẹn">
                {dayjs(selectedAppointment.appointment_date).format(
                  "DD/MM/YYYY"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Giờ hẹn">
                {selectedAppointment.time || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Loại khám">
                {formatAppointmentType(selectedAppointment.type)}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {getStatusTag(selectedAppointment.status)}
              </Descriptions.Item>
              <Descriptions.Item label="Phương thức thanh toán">
                {formatPaymentMethod(selectedAppointment.paymentMethod)}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái thanh toán">
                {getPaymentStatusTag(selectedAppointment.isPaid)}
              </Descriptions.Item>
              <Descriptions.Item label="Giá khám" span={2}>
                {selectedAppointment.price.toLocaleString("vi-VN")} VNĐ
              </Descriptions.Item>
              <Descriptions.Item label="Triệu chứng" span={2}>
                {selectedAppointment.symptoms || "Không có"}
              </Descriptions.Item>
              {selectedAppointment.reasonCancel && (
                <Descriptions.Item label="Lý do hủy" span={2}>
                  {selectedAppointment.reasonCancel}
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Người tạo" span={2}>
                {selectedAppointment.createdBy}
              </Descriptions.Item>
            </Descriptions>

            {selectedAppointment.predicted_disease &&
              selectedAppointment.predicted_disease.length > 0 && (
                <div className="section">
                  <h3>Dự đoán bệnh</h3>
                  <ul className="disease-list">
                    {selectedAppointment.predicted_disease.map((disease) => (
                      <li key={disease._id}>
                        <span className="disease-name">{disease.name}</span>
                        <span className="disease-percent">
                          {disease.percent}%
                        </span>
                        <div className="progress-bar">
                          <div
                            className="progress"
                            style={{ width: `${disease.percent}%` }}
                          ></div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {selectedAppointment.appointment_detail &&
              selectedAppointment.appointment_detail.length > 0 && (
                <div className="section">
                  <h3>Chi tiết khám</h3>
                  <Collapse
                    defaultActiveKey={selectedAppointment.appointment_detail.map(
                      (_, index) => index.toString()
                    )}
                  >
                    {selectedAppointment.appointment_detail.map(
                      (detail, index) => (
                        <Panel
                          header={`Chi tiết khám #${
                            index + 1
                          } - ${getSpecializationName(
                            detail.specialization_id
                          )}`}
                          key={index.toString()}
                        >
                          <Descriptions bordered column={2} size="small">
                            <Descriptions.Item label="Chuyên khoa" span={2}>
                              {getSpecializationName(detail.specialization_id)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Bác sĩ">
                              {getDoctorName(detail.doctor_id)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Chức vụ">
                              {getDoctorPosition(detail.doctor_id)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Địa điểm">
                              {detail.address}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thời gian">
                              {detail.time}
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái khám">
                              {getExamStatusTag(detail.examStatus)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Giá">
                              {Number.parseInt(detail.price).toLocaleString(
                                "vi-VN"
                              )}{" "}
                              VNĐ
                            </Descriptions.Item>
                            <Descriptions.Item label="Mô tả" span={2}>
                              {detail.description || "Không có"}
                            </Descriptions.Item>
                          </Descriptions>
                        </Panel>
                      )
                    )}
                  </Collapse>
                </div>
              )}
          </div>
        ) : (
          <Form form={form} layout="vertical" disabled={modalType === "view"}>
            <div className="form-section">
              <h3 className="section-title">Thông tin cơ bản</h3>

              <Form.Item
                name="title"
                label="Tiêu đề cuộc hẹn"
                rules={[
                  { required: true, message: "Vui lòng nhập tiêu đề cuộc hẹn" },
                ]}
              >
                <Input />
              </Form.Item>

              <div className="form-row">
                <Form.Item
                  name="patient_id"
                  label="Bệnh nhân"
                  rules={[
                    { required: true, message: "Vui lòng chọn bệnh nhân" },
                  ]}
                  className="form-col"
                >
                  <Select
                    showSearch
                    placeholder="Chọn bệnh nhân"
                    optionFilterProp="children"
                  >
                    {patientsData.map((patient) => (
                      <Option key={patient._id} value={patient._id}>
                        {patient.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="type"
                  label="Loại khám"
                  rules={[
                    { required: true, message: "Vui lòng chọn loại khám" },
                  ]}
                  className="form-col"
                >
                  <Select
                    placeholder="Chọn loại khám"
                    onChange={handleAppointmentTypeChange}
                  >
                    {appointmentTypes.map((type) => (
                      <Option key={type.value} value={type.value}>
                        {type.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              <div className="form-row">
                <Form.Item
                  name="appointment_date"
                  label="Ngày hẹn"
                  rules={[
                    { required: true, message: "Vui lòng chọn ngày hẹn" },
                  ]}
                  className="form-col"
                >
                  <DatePicker format="DD/MM/YYYY" className="full-width" />
                </Form.Item>

                <Form.Item
                  name="status"
                  label="Trạng thái cuộc hẹn"
                  rules={[
                    { required: true, message: "Vui lòng chọn trạng thái" },
                  ]}
                  className="form-col"
                >
                  <Select placeholder="Chọn trạng thái">
                    {Object.entries(AppointmentStatus).map(([value, label]) => (
                      <Option key={value} value={value}>
                        {label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              <Form.Item name="symptoms" label="Triệu chứng">
                <Input.TextArea rows={3} />
              </Form.Item>

              {form.getFieldValue("status") === "cancel" && (
                <Form.Item
                  name="reasonCancel"
                  label="Lý do hủy"
                  rules={[
                    { required: true, message: "Vui lòng nhập lý do hủy" },
                  ]}
                >
                  <Input.TextArea rows={2} />
                </Form.Item>
              )}
            </div>

            <div className="form-section">
              <div className="section-header">
                <h3 className="section-title">Chi tiết khám</h3>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={addSpecialization}
                  disabled={!form.getFieldValue("type")}
                >
                  Thêm chuyên khoa
                </Button>
              </div>

              <Form.List name="appointment_details">
                {(fields, { add, remove }) => (
                  <>
                    {fields.length === 0 ? (
                      <Empty description="Chưa có chuyên khoa nào được chọn" />
                    ) : (
                      fields.map((field, index) => (
                        <Card
                          key={field.key}
                          title={`Chuyên khoa #${index + 1}`}
                          className="specialization-card"
                          extra={
                            <Button
                              danger
                              icon={<MinusCircleOutlined />}
                              onClick={() => {
                                remove(field.name);
                                removeSpecialization(index);
                              }}
                            >
                              Xóa
                            </Button>
                          }
                        >
                          <div className="form-row">
                            <Form.Item
                              {...field}
                              name={[field.name, "specialization_id"]}
                              label="Chuyên khoa"
                              rules={[
                                {
                                  required: true,
                                  message: "Vui lòng chọn chuyên khoa",
                                },
                              ]}
                              className="form-col"
                            >
                              <Select
                                showSearch
                                placeholder="Chọn chuyên khoa"
                                optionFilterProp="children"
                                onChange={(value) =>
                                  handleSpecializationChange(value, index)
                                }
                              >
                                {specsData.map((spec) => (
                                  <Option key={spec._id} value={spec._id}>
                                    {spec.name} -{" "}
                                    {spec.base_price.toLocaleString("vi-VN")}{" "}
                                    VNĐ
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </div>

                          <div className="form-row">
                            <Form.Item
                              {...field}
                              name={[field.name, "doctor_id"]}
                              label="Bác sĩ"
                              rules={[
                                {
                                  required: true,
                                  message: "Vui lòng chọn bác sĩ",
                                },
                              ]}
                              className="form-col"
                            >
                              <Select
                                showSearch
                                placeholder={
                                  form.getFieldValue([
                                    "appointment_details",
                                    index,
                                    "specialization_id",
                                  ])
                                    ? "Chọn bác sĩ"
                                    : "Vui lòng chọn chuyên khoa trước"
                                }
                                optionFilterProp="children"
                                disabled={
                                  !form.getFieldValue([
                                    "appointment_details",
                                    index,
                                    "specialization_id",
                                  ])
                                }
                                onChange={(value) =>
                                  handleDoctorChange(value, index)
                                }
                              >
                                {(
                                  doctorsBySpecialization[
                                    form.getFieldValue([
                                      "appointment_details",
                                      index,
                                      "specialization_id",
                                    ])
                                  ] || []
                                ).map((doctor) => (
                                  <Option key={doctor._id} value={doctor._id}>
                                    {doctor.name} -{" "}
                                    {formatPosition(doctor.position)}
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>

                            <Form.Item
                              {...field}
                              name={[field.name, "time"]}
                              label="Giờ hẹn"
                              rules={[
                                {
                                  required: true,
                                  message: "Vui lòng chọn giờ hẹn",
                                },
                              ]}
                              className="form-col"
                            >
                              <TimePicker
                                format="HH:mm"
                                className="full-width"
                              />
                            </Form.Item>
                          </div>

                          <div className="form-row">
                            <Form.Item
                              {...field}
                              name={[field.name, "address"]}
                              label="Phòng khám"
                              rules={[
                                {
                                  required: true,
                                  message: "Vui lòng nhập địa điểm khám",
                                },
                              ]}
                              className="form-col"
                            >
                              <Input disabled />
                            </Form.Item>

                            <Form.Item
                              {...field}
                              name={[field.name, "examStatus"]}
                              label="Trạng thái khám"
                              initialValue="not_examined"
                              className="form-col"
                            >
                              <Select>
                                {Object.entries(ExaminationStatusEnum).map(
                                  ([value, label]) => (
                                    <Option key={value} value={value}>
                                      {label}
                                    </Option>
                                  )
                                )}
                              </Select>
                            </Form.Item>
                          </div>

                          <Form.Item
                            {...field}
                            name={[field.name, "description"]}
                            label="Mô tả"
                          >
                            <Input.TextArea rows={2} />
                          </Form.Item>

                          {selectedSpecializations[index] &&
                            form.getFieldValue("type") && (
                              <div className="fee-calculation">
                                <Text strong>
                                  Phí khám:{" "}
                                  {calculateFee(
                                    selectedSpecializations[index].spec
                                      .base_price,
                                    selectedSpecializations[index].doctor
                                      ?.position,
                                    form.getFieldValue("type")
                                  ).toLocaleString("vi-VN")}{" "}
                                  VNĐ
                                </Text>
                                <div className="fee-details">
                                  <Text type="secondary">
                                    Giá cơ bản:{" "}
                                    {selectedSpecializations[
                                      index
                                    ].spec.base_price.toLocaleString(
                                      "vi-VN"
                                    )}{" "}
                                    VNĐ,
                                  </Text>
                                  <Text
                                    type="secondary"
                                    style={{ marginLeft: 8 }}
                                  >
                                    Hệ số bác sĩ (
                                    {formatPosition(
                                      selectedSpecializations[index].doctor
                                        ?.position
                                    )}
                                    ):{" "}
                                    {
                                      DoctorFeePercentageByPosition[
                                        selectedSpecializations[index].doctor
                                          ?.position
                                      ]
                                    }
                                    %,
                                  </Text>
                                  <Text
                                    type="secondary"
                                    style={{ marginLeft: 8 }}
                                  >
                                    Hệ số loại khám (
                                    {formatAppointmentType(
                                      form.getFieldValue("type")
                                    )}
                                    ):{" "}
                                    {
                                      AppointmentTypeFee[
                                        form.getFieldValue("type")
                                      ]
                                    }
                                    %
                                  </Text>
                                </div>
                              </div>
                            )}
                        </Card>
                      ))
                    )}
                  </>
                )}
              </Form.List>
            </div>

            <div className="form-section">
              <h3 className="section-title">Thanh toán</h3>

              <div className="form-row">
                <Form.Item
                  name="price"
                  label="Tổng phí khám"
                  rules={[
                    { required: true, message: "Vui lòng nhập giá khám" },
                  ]}
                  className="form-col"
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    addonAfter="VNĐ"
                    disabled
                  />
                </Form.Item>

                <Form.Item
                  name="paymentMethod"
                  label="Phương thức thanh toán"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn phương thức thanh toán",
                    },
                  ]}
                  className="form-col"
                >
                  <Select placeholder="Chọn phương thức thanh toán">
                    {paymentMethods.map((method) => (
                      <Option key={method.value} value={method.value}>
                        {method.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              <Form.Item
                name="isPaid"
                label="Trạng thái thanh toán"
                initialValue={false}
              >
                <Select>
                  <Option value={true}>Đã thanh toán</Option>
                  <Option value={false}>Chưa thanh toán</Option>
                </Select>
              </Form.Item>
            </div>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default AdminAppointments;
