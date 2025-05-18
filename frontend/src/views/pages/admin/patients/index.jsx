import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  Select,
  Space,
  DatePicker,
  Image,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "./index.scss";
import { patientAPI } from "../../../../api/patientAPI";
import callAPIForm from "../../../../utils/callAPIForm";
import { accountAPI } from "../../../../api/accountAPI";
import { toast } from "react-toastify";

const { Option } = Select;

const AdminPatients = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState("add"); // 'add', 'edit', 'view'
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");

  const [patientsData, setPatientsData] = useState([]);

  const calAPI = async () => {
    const response = await patientAPI.getAllPatients();
    if (response.status === 200) {
      setPatientsData(response.data);
    }
  };

  useEffect(() => {
    callAPIForm(calAPI, "Gặp lỗi khi lấy danh sách bệnh nhân");
  }, []);

  const showModal = (type, patient = null) => {
    setModalType(type);
    setSelectedPatient(patient);
    setIsModalVisible(true);

    if (type === "edit" || type === "view") {
      form.setFieldsValue({
        name: patient.name,
        gender: patient.gender,
        email: patient.email,
        tel: patient.tel,
        address: patient.address,
        date_of_birth: patient.date_of_birth
          ? dayjs(patient.date_of_birth)
          : null,
      });
    } else {
      form.resetFields();
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (values.date_of_birth && values.date_of_birth.toISOString) {
      values.date_of_birth = values.date_of_birth.toISOString();
    }
    if (modalType === "add") {
      const res = await accountAPI.createAccount(values);
      if (res && res.data) {
        setPatientsData((prev) => [res.data, ...prev]);
        setIsModalVisible(false);
        form.resetFields();
        toast.success("Thêm bệnh nhân thành công");
      }
    } else if (modalType === "edit" && selectedPatient) {
      const updateData = { ...values, id: selectedPatient._id };
      const res = await accountAPI.updateAccount(updateData);
      if (res && res.data) {
        setPatientsData((prev) =>
          prev.map((item) =>
            item._id === selectedPatient._id ? res.data : item
          )
        );
        setIsModalVisible(false);
        form.resetFields();
        toast.success("Cập nhật thông tin bệnh nhân thành công");
      }
    }
  };

  const handleDelete = async (id) => {
    await accountAPI.deleteAccount(id);
    setPatientsData((prev) => prev.filter((item) => item._id !== id));
    toast.success("Xóa bệnh nhân thành công");
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "-";
    return dayjs().diff(dayjs(dateOfBirth), "year");
  };

  // Format gender for display
  const formatGender = (gender) => {
    return gender === "male" ? "Nam" : gender === "female" ? "Nữ" : gender;
  };

  // Hàm lọc dữ liệu theo tên hoặc email
  const filteredPatients = patientsData.filter((patient) => {
    const keyword = searchText.trim().toLowerCase();
    return (
      patient.name.toLowerCase().includes(keyword) ||
      patient.email.toLowerCase().includes(keyword)
    );
  });

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      width: 100,
      ellipsis: true,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Bệnh nhân",
      key: "patient",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Image
            src={record.avatar || "/placeholder.svg"}
            alt="Avatar"
            width={40}
            height={40}
            style={{ borderRadius: "50%" }}
            preview={false}
          />
          <span>{record.name}</span>
        </div>
      ),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (gender) => formatGender(gender),
      filters: [
        { text: "Nam", value: "male" },
        { text: "Nữ", value: "female" },
      ],
      onFilter: (value, record) => record.gender === value,
    },
    {
      title: "Tuổi",
      key: "age",
      render: (_, record) => calculateAge(record.date_of_birth),
      sorter: (a, b) =>
        calculateAge(a.date_of_birth) - calculateAge(b.date_of_birth),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ellipsis: true,
    },
    {
      title: "Số điện thoại",
      dataIndex: "tel",
      key: "tel",
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
            onClick={() =>
              callAPIForm(handleDelete(record._id), "Gặp lỗi khi xóa bệnh nhân")
            }
          />
        </Space>
      ),
    },
  ];

  const getModalTitle = () => {
    switch (modalType) {
      case "add":
        return "Thêm bệnh nhân mới";
      case "edit":
        return "Chỉnh sửa thông tin bệnh nhân";
      case "view":
        return "Chi tiết bệnh nhân";
      default:
        return "";
    }
  };

  return (
    <div className="patients-page">
      <div className="page-header">
        <h1 className="page-title">Quản lý bệnh nhân</h1>
        <div className="header-actions">
          <Input
            placeholder="Tìm kiếm bệnh nhân"
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
            Thêm bệnh nhân
          </Button>
        </div>
      </div>

      {/* Hiển thị kết quả tìm kiếm */}
      {searchText && (
        <div style={{ marginBottom: 12 }}>
          <span>
            Kết quả tìm kiếm cho: <b>{searchText}</b> ({filteredPatients.length}{" "}
            kết quả)
          </span>
        </div>
      )}

      <Table
        columns={columns}
        dataSource={filteredPatients}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
        className="patients-table"
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
                <Button
                  key="submit"
                  type="primary"
                  onClick={() =>
                    callAPIForm(
                      handleSubmit,
                      "Gặp lỗi khi thêm/chỉnh sửa bệnh nhân"
                    )
                  }
                >
                  {modalType === "add" ? "Thêm" : "Lưu"}
                </Button>,
              ]
        }
        width={700}
      >
        <Form form={form} layout="vertical" disabled={modalType === "view"}>
          {modalType !== "add" && selectedPatient && (
            <div className="avatar-preview">
              <Image
                src={selectedPatient.avatar || "/placeholder.svg"}
                alt="Avatar"
                width={100}
                height={100}
                style={{ borderRadius: "50%", marginBottom: "20px" }}
              />
            </div>
          )}

          <Form.Item
            name="name"
            label="Họ tên"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input />
          </Form.Item>

          <div className="form-row">
            <Form.Item
              name="gender"
              label="Giới tính"
              rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
              className="form-col"
            >
              <Select>
                <Option value="male">Nam</Option>
                <Option value="female">Nữ</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="date_of_birth"
              label="Ngày sinh"
              rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
              className="form-col"
            >
              <DatePicker format="DD/MM/YYYY" className="full-width" />
            </Form.Item>
          </div>

          <div className="form-row">
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
              className="form-col"
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="tel"
              label="Số điện thoại"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại" },
              ]}
              className="form-col"
            >
              <Input />
            </Form.Item>
          </div>

          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
          >
            <Input />
          </Form.Item>

          {modalType === "add" && (
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
            >
              <Input.Password />
            </Form.Item>
          )}

          {modalType === "view" && selectedPatient && (
            <>
              <Form.Item label="Ngày tạo">
                <Input
                  value={dayjs(selectedPatient.createdAt).format(
                    "DD/MM/YYYY HH:mm"
                  )}
                  disabled
                />
              </Form.Item>

              <Form.Item label="Lần cập nhật cuối">
                <Input
                  value={dayjs(selectedPatient.updatedAt).format(
                    "DD/MM/YYYY HH:mm"
                  )}
                  disabled
                />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default AdminPatients;
