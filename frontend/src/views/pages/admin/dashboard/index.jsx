import { Row, Col, Card, Statistic } from "antd";
import {
  UserOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { Line, Pie } from "@ant-design/plots";
import "./index.scss";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  AppointmentStatus,
  AppointmentType,
} from "../../../../constants/constants";
import { toast } from "react-toastify";
import { statisticAPI } from "../../../../api/statisticAPI";

const HomepageAdmin = () => {
  const currentMonth = dayjs().month() + 1;

  // Sample data for charts
  const [lineData, setLineData] = useState([
    { month: "Tháng 1", patients: 35 },
    { month: "Tháng 2", patients: 42 },
    { month: "Tháng 3", patients: 56 },
    { month: "Tháng 4", patients: 49 },
    { month: "Tháng 5", patients: 63 },
    { month: "Tháng 6", patients: 58 },
    { month: "Tháng 7", patients: 58 },
    { month: "Tháng 8", patients: 58 },
    { month: "Tháng 9", patients: 58 },
    { month: "Tháng 10", patients: 58 },
    { month: "Tháng 11", patients: 58 },
    { month: "Tháng 12", patients: 58 },
  ]);

  const [patientNum, setPatientNum] = useState({
    num: 0,
    today: 0,
  });
  const [doctorNum, setDoctorNum] = useState({
    num: 0,
    week: 0,
  });
  const [AppointmentNum, setAppointmentNum] = useState({
    num: 0,
    pending: 0,
  });

  const [recentAppointment, setRecentAppointment] = useState([]);

  const [pieData, setPieData] = useState([
    { type: "Khám tổng quát", value: 27 },
    { type: "Khám chuyên khoa", value: 25 },
    { type: "Cấp cứu", value: 18 },
    { type: "Tái khám", value: 15 },
    { type: "Khác", value: 10 },
  ]);

  const lineConfig = {
    data: lineData,
    xField: "month",
    yField: "patients",
    point: {
      size: 5,
      shape: "diamond",
    },
    color: "#6282F4",
  };

  const pieConfig = {
    data: pieData,
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    label: {
      type: "outer",
    },
    interactions: [{ type: "element-active" }],
  };

  const callAPI = async () => {
    try {
      const response = await statisticAPI.getStatisticByAdmin();
      const { data } = response;
      if (data) {
        setPatientNum(data?.patientNum);
        setDoctorNum(data?.doctorNum);
        setAppointmentNum(data?.appointmentNum);
        setRecentAppointment(data?.recentAppointments.slice(0, 5));
        setLineData(data?.lineData.slice(0, currentMonth));
        setPieData(
          data?.pieData?.map((item) => ({
            type: AppointmentType[item.type],
            value: item.value,
          }))
        );
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error?.response?.data?.message[0]?.message ||
          "Có lỗi xảy ra, vui lòng thử lại sau."
      );
    }
  };

  useEffect(() => {
    callAPI();
  }, []);

  return (
    <div className="dashboard">
      <h1 className="page-title">Tổng quan</h1>

      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={8}>
          <Card className="stat-card patients-card">
            <Statistic
              title="Tổng số bệnh nhân"
              value={patientNum.num}
              prefix={<UserOutlined />}
            />
            <div className="stat-footer">
              <span className="stat-increase">
                {patientNum.today > 0
                  ? `+${patientNum.today}`
                  : patientNum.today}{" "}
                hôm nay
              </span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="stat-card doctors-card">
            <Statistic
              title="Tổng số bác sĩ"
              value={doctorNum.num}
              prefix={<MedicineBoxOutlined />}
            />
            <div className="stat-footer">
              <span className="stat-increase">
                {doctorNum.week > 0 ? `+${doctorNum.week}` : doctorNum.week}{" "}
                tuần này
              </span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="stat-card appointments-card">
            <Statistic
              title="Cuộc hẹn hôm nay"
              value={AppointmentNum.num}
              prefix={<CalendarOutlined />}
            />
            <div className="stat-footer">
              <span className="stat-pending">
                {AppointmentNum.pending} đang chờ
              </span>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="charts-row">
        <Col xs={24} lg={16}>
          <Card title="Số lượng bệnh nhân theo tháng" className="chart-card">
            <Line {...lineConfig} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Phân loại cuộc hẹn" className="chart-card">
            <Pie {...pieConfig} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card title="Cuộc hẹn gần đây" className="recent-card">
            <table className="recent-table">
              <thead>
                <tr>
                  <th>Bệnh nhân</th>
                  <th>Bác sĩ</th>
                  <th>Ngày</th>
                  <th>Giờ</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointment.map((appointmentDetail) => (
                  <tr key={appointmentDetail?._id}>
                    <td>{appointmentDetail?.appointment?.patient?.name}</td>
                    <td>{appointmentDetail?.doctor?.account?.name}</td>
                    <td>
                      {dayjs(
                        appointmentDetail?.appointment?.appointment_date
                      ).format("DD/MM/YYYY")}
                    </td>
                    <td>{appointmentDetail?.time}</td>
                    <td>
                      {
                        AppointmentStatus[
                          appointmentDetail?.appointment?.status
                        ]
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HomepageAdmin;
