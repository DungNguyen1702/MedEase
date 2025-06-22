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
    TimePicker,
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
import { DoctorPosition } from "../../../../constants/constants";
import callAPIForm from "../../../../utils/callAPIForm";
import { doctorAPI } from "../../../../api/doctorAPI";
import { specAPI } from "../../../../api/specAPI";
import { useAuth } from "../../../../context/AuthContext";
import { accountAPI } from "../../../../api/accountAPI";
import { toast } from "react-toastify";
import axiosClient from "../../../../utils/axiosCustomize";

const { Option } = Select;

const AdminDoctors = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalType, setModalType] = useState("add"); // 'add', 'edit', 'view'
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [form] = Form.useForm();
    const [doctorsData, setDoctorsData] = useState([]);
    const [specializations, setSpecializations] = useState([]);
    const [searchText, setSearchText] = useState("");

    const { token } = useAuth();

    // Format gender for display
    const formatGender = (gender) => {
        return gender === "male" ? "Nam" : gender === "female" ? "Nữ" : gender;
    };

    const showModal = (type, doctor = null) => {
        setModalType(type);
        setSelectedDoctor(doctor);
        setIsModalVisible(true);

        if (type === "edit" || type === "view") {
            form.setFieldsValue({
                name: doctor.account.name,
                gender: doctor.account.gender,
                email: doctor.account.email,
                tel: doctor.account.tel,
                address: doctor.account.address,
                date_of_birth: doctor.account.date_of_birth
                    ? dayjs(doctor.account.date_of_birth)
                    : null,
                specialization: doctor.specialization?._id, // Sử dụng _id thay vì name
                position: doctor.position,
                base_time: doctor.base_time
                    ? dayjs(doctor.base_time, "HH:mm")
                    : null,
                room: doctor.room,
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
        // Xử lý ngày/thời gian về đúng định dạng
        if (values.date_of_birth && values.date_of_birth.toISOString) {
            values.date_of_birth = values.date_of_birth.format("YYYY-MM-DD");
        }
        if (values.base_time && values.base_time.format) {
            values.base_time = values.base_time.format("HH:mm");
        }

        // Chuẩn hóa dữ liệu gửi đi
        const data = {
            ...values,
            role: "doctor",
            specializationId: values.specialization,
        };

        if (modalType === "add") {
            axiosClient.defaults.headers.common["Authorization"] =
                "Bearer " + localStorage.getItem("access_token");
            const res = await accountAPI.createAccount(data);
            if (res && res.data) {
                setDoctorsData((prev) => [res.data, ...prev]);
                setIsModalVisible(false);
                form.resetFields();
                toast.success("Thêm bác sĩ thành công");
            }
        } else if (modalType === "edit" && selectedDoctor) {
            const updateData = { ...data, id: selectedDoctor.account._id };
            axiosClient.defaults.headers.common["Authorization"] =
                "Bearer " + localStorage.getItem("access_token");
            const res = await accountAPI.updateAccountByAdmin(updateData);
            if (res && res.data) {
                setDoctorsData((prev) =>
                    prev.map((item) =>
                        item.account._id === selectedDoctor.account._id
                            ? res.data
                            : item
                    )
                );
                setIsModalVisible(false);
                form.resetFields();
                toast.success("Cập nhật thông tin bác sĩ thành công");
            }
        }
    };

    const handleDelete = async (id) => {
        axiosClient.defaults.headers.common["Authorization"] =
            "Bearer " + localStorage.getItem("access_token");
        await accountAPI.deleteAccount(id);
        setDoctorsData((prev) =>
            prev.filter((item) => item.account._id !== id)
        );
        toast.success("Xóa bác sĩ thành công");
    };

    const columns = [
        {
            title: "STT",
            key: "index",
            width: 100,
            render: (_, __, index) => index + 1, // Hiển thị số thứ tự (STT)
        },
        {
            title: "Bác sĩ",
            key: "doctor",
            render: (_, record) => (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                    }}
                >
                    <Image
                        src={record?.account?.avatar || "/placeholder.svg"} // Sử dụng ?. để tránh lỗi
                        alt="Avatar"
                        width={40}
                        height={40}
                        style={{ borderRadius: "50%" }}
                        preview={false}
                    />
                    <span>{record?.account?.name || "Không có tên"}</span>{" "}
                    {/* Hiển thị tên bác sĩ */}
                </div>
            ),
        },
        {
            title: "Giới tính",
            key: "gender",
            render: (_, record) => formatGender(record?.account?.gender), // Sử dụng ?. để tránh lỗi
            filters: [
                { text: "Nam", value: "male" },
                { text: "Nữ", value: "female" },
            ],
            onFilter: (value, record) => record?.account?.gender === value,
        },
        {
            title: "Chuyên khoa",
            key: "specialization",
            render: (_, record) =>
                record?.specialization?.name || "Không có chuyên khoa", // Sử dụng ?. để tránh lỗi
            filters: Array.from(
                new Set(
                    doctorsData.map((doctor) => doctor?.specialization?.name)
                )
            )
                .filter((name) => name) // Loại bỏ giá trị null hoặc undefined
                .map((name) => ({
                    text: name,
                    value: name,
                })),
            onFilter: (value, record) => record?.specialization?.name === value,
        },
        {
            title: "Chức vụ",
            key: "position",
            render: (_, record) =>
                DoctorPosition[record?.position] || "Không có chức vụ", // Sử dụng ?. để tránh lỗi
            filters: Object.keys(DoctorPosition).map((key) => ({
                text: DoctorPosition[key],
                value: key,
            })),
            onFilter: (value, record) => record?.position === value,
        },
        {
            title: "Phòng",
            dataIndex: "room",
            key: "room",
            render: (room) => room || "Không có phòng", // Hiển thị giá trị mặc định nếu không có phòng
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
                        onClick={() => handleDelete(record.account._id)}
                    />
                </Space>
            ),
        },
    ];

    const getModalTitle = () => {
        switch (modalType) {
            case "add":
                return "Thêm bác sĩ mới";
            case "edit":
                return "Chỉnh sửa thông tin bác sĩ";
            case "view":
                return "Chi tiết bác sĩ";
            default:
                return "";
        }
    };

    const callAPI = async () => {
        axiosClient.application.defaults.headers.common["Authorization"] =
            "Bearer " + localStorage.getItem("access_token");
        const responseDoctors = await doctorAPI.getAllDoctors();
        const responseSpec = await specAPI.getAllSpec();

        if (responseDoctors.status === 200) {
            setDoctorsData(responseDoctors.data);
        }

        if (responseSpec.status === 200) {
            const specData = responseSpec.data.map((spec) => ({
                _id: spec._id, // Sử dụng _id thay vì id
                name: spec.name,
                image: spec.image,
                description: spec.description,
                base_price: spec.base_price,
            }));
            setSpecializations(specData);
        }
    };

    useEffect(() => {
        callAPIForm(callAPI, "Truy vấn dữ liệu bác sĩ, khoa thất bại");
    }, []);

    // Hàm lọc dữ liệu theo tên hoặc email bác sĩ
    const filteredDoctors = doctorsData.filter((doctor) => {
        const keyword = searchText.trim().toLowerCase();
        const name = doctor?.account?.name?.toLowerCase() || "";
        const email = doctor?.account?.email?.toLowerCase() || "";
        return name.includes(keyword) || email.includes(keyword);
    });

    return (
        <div className="doctors-page">
            <div className="page-header">
                <h1 className="page-title">Quản lý bác sĩ</h1>
                <div className="header-actions">
                    <Input
                        placeholder="Tìm kiếm bác sĩ"
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
                        Thêm bác sĩ
                    </Button>
                </div>
            </div>

            {/* Hiển thị kết quả tìm kiếm */}
            {searchText && (
                <div style={{ marginBottom: 12 }}>
                    <span>
                        Kết quả tìm kiếm cho: <b>{searchText}</b> (
                        {filteredDoctors.length} kết quả)
                    </span>
                </div>
            )}

            <Table
                columns={columns}
                dataSource={filteredDoctors}
                rowKey="_id"
                pagination={{ pageSize: 10 }}
                className="doctors-table"
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
                                  onClick={handleSubmit}
                              >
                                  {modalType === "add" ? "Thêm" : "Lưu"}
                              </Button>,
                          ]
                }
                width={700}
            >
                <Form
                    form={form}
                    layout="vertical"
                    disabled={modalType === "view"}
                >
                    {modalType !== "add" && selectedDoctor && (
                        <div className="avatar-preview">
                            <Image
                                src={
                                    selectedDoctor.account.avatar ||
                                    "/placeholder.svg"
                                }
                                alt="Avatar"
                                width={100}
                                height={100}
                                style={{
                                    borderRadius: "50%",
                                    marginBottom: "20px",
                                }}
                            />
                        </div>
                    )}

                    <div className="form-section">
                        <h3 className="section-title">Thông tin cá nhân</h3>

                        <Form.Item
                            name="name"
                            label="Họ tên"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập họ tên",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <div className="form-row">
                            <Form.Item
                                name="gender"
                                label="Giới tính"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn giới tính",
                                    },
                                ]}
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
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn ngày sinh",
                                    },
                                ]}
                                className="form-col"
                            >
                                <DatePicker
                                    format="DD/MM/YYYY"
                                    className="full-width"
                                />
                            </Form.Item>
                        </div>

                        <div className="form-row">
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập email",
                                    },
                                    {
                                        type: "email",
                                        message: "Email không hợp lệ",
                                    },
                                ]}
                                className="form-col"
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="tel"
                                label="Số điện thoại"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập số điện thoại",
                                    },
                                ]}
                                className="form-col"
                            >
                                <Input />
                            </Form.Item>
                        </div>

                        <Form.Item
                            name="address"
                            label="Địa chỉ"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập địa chỉ",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        {modalType === "add" && (
                            <Form.Item
                                name="password"
                                label="Mật khẩu"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập mật khẩu",
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                        )}
                    </div>

                    <div className="form-section">
                        <h3 className="section-title">Thông tin chuyên môn</h3>

                        <div className="form-row">
                            <Form.Item
                                name="specialization"
                                label="Chuyên khoa"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn chuyên khoa",
                                    },
                                ]}
                                className="form-col"
                            >
                                <Select>
                                    {specializations.map((spec) => (
                                        <Option key={spec._id} value={spec._id}>
                                            {spec.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="position"
                                label="Chức vụ"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn chức vụ",
                                    },
                                ]}
                                className="form-col"
                            >
                                <Select>
                                    {Object.keys(DoctorPosition).map((key) => (
                                        <Option key={key} value={key}>
                                            {DoctorPosition[key]}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>

                        <div className="form-row">
                            <Form.Item
                                name="base_time"
                                label="Thời gian khám cơ bản"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập thời gian khám",
                                    },
                                ]}
                                className="form-col"
                            >
                                <TimePicker
                                    format="HH:mm"
                                    className="full-width"
                                />
                            </Form.Item>

                            <Form.Item
                                name="room"
                                label="Phòng khám"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập phòng khám",
                                    },
                                ]}
                                className="form-col"
                            >
                                <Input />
                            </Form.Item>
                        </div>
                    </div>

                    {modalType === "view" && selectedDoctor && (
                        <div className="form-section">
                            <h3 className="section-title">
                                Thông tin chuyên khoa
                            </h3>
                            <div className="specialization-info">
                                <div className="specialization-image">
                                    <Image
                                        src={
                                            selectedDoctor.specialization
                                                .image || "/placeholder.svg"
                                        }
                                        alt="Specialization"
                                        width={100}
                                        height={100}
                                        style={{ borderRadius: "8px" }}
                                    />
                                </div>
                                <div className="specialization-details">
                                    <p>
                                        <strong>Mô tả:</strong>{" "}
                                        {
                                            selectedDoctor.specialization
                                                .description
                                        }
                                    </p>
                                    <p>
                                        <strong>Giá khám cơ bản:</strong>{" "}
                                        {selectedDoctor.specialization.base_price.toLocaleString(
                                            "vi-VN"
                                        )}{" "}
                                        VNĐ
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </Form>
            </Modal>
        </div>
    );
};

export default AdminDoctors;
