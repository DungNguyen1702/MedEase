import "./index.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../../../../context/AuthContext";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";
import { IMAGES } from "../../../../constants/images";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import LoadingOverlay from "../../../../components/LoadingOverlay";
import { Table, Pagination } from "antd";
import AppointmentCard from "./components/appointmentCard";
import QuestionCard from "./components/questionCard";
import { statisticAPI } from "../../../../api/statisticAPI";
import NoData from "../../../../components/NoData";
import axiosClient from "../../../../utils/axiosCustomize";

Chart.register(...registerables);

const paginateData = (data, page, limit) => {
    const startIndex = (page - 1) * limit; // Vị trí bắt đầu
    const endIndex = startIndex + limit; // Vị trí kết thúc
    return data.slice(startIndex, endIndex); // Cắt dữ liệu
};

function HomepageDoctor() {
    const { account, token } = useAuth();
    const [todayAppointmentNum, setTodayAppointmentNum] = useState(0);
    const [totalAppointmentNum, setTotalAppointmentNum] = useState(0);
    const [loading, setLoading] = useState(false);
    const [appointmentList, setAppointmentList] = useState([]);
    const [questionList, setQuestionList] = useState([]);

    const [total, setTotal] = useState({
        appointment: 0,
        question: 0,
    });
    const [page, setPage] = useState({
        appointment: 1,
        question: 1,
    });
    const [limit, setLimit] = useState({
        appointment: 4,
        question: 3,
    });
    const [paginatedAppointments, setPaginatedAppointments] = useState(
        paginateData(appointmentList, page.appointment, limit.appointment)
    );
    const [paginatedQuestions, setPaginatedQuestions] = useState(
        paginateData(questionList, page.question, limit.question)
    );

    // Dữ liệu slide
    const slidesData = [IMAGES.Slide1, IMAGES.Slide2, IMAGES.Slide3];

    // Chart Week
    const [weekData, setWeekData] = useState([]);

    const chartWeekConfig = {
        datasets: [
            {
                label: "Số lượng bệnh nhân trong tuần",
                backgroundColor: "rgba(45,156,219,0.2)",
                borderColor: "rgba(45,156,219,1)",
                borderWidth: 1,
                hoverBackgroundColor: "rgba(45,156,219,0.4)",
                hoverBorderColor: "rgba(45,156,219,1)",
                data: weekData,
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const chartWeekOptions = {
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                grid: {
                    display: false,
                },
                beginAtZero: true,
            },
        },
        parsing: {
            xAxisKey: "dayOfWeek",
            yAxisKey: "patientNum",
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const data = context.dataset.data[context.dataIndex];
                        return `Ngày: ${data.date}, Doanh thu: ${data.patientNum}`;
                    },
                },
            },
        },
    };

    // Table data
    const tableColumns = [
        {
            title: "Ngày",
            dataIndex: "date",
        },
        {
            title: "Thứ",
            dataIndex: "dayOfWeek",
        },
        {
            title: "Tổng số bệnh nhân",
            dataIndex: "patientNum",
            sorter: (a, b) => a.patientNum - b.patientNum,
        },
        {
            title: "SL bệnh nhân đã khám",
            dataIndex: "examinedPatientNum",
            sorter: (a, b) => a.examinedPatientNum - b.examinedPatientNum,
        },
    ];

    const callAPI = async () => {
        setLoading(true);
        try {
            axiosClient.defaults.headers.common["Authorization"] =
                "Bearer " + localStorage.getItem("access_token");
            // Gọi API, truyền account._id (accountId) lên backend
            const res = await statisticAPI.getStatisticByDoctor();
            console.log("response : ", res);
            if (res && res.data) {
                setTodayAppointmentNum(res.data.todayAppointmentNum);
                setTotalAppointmentNum(res.data.totalAppointmentNum);
                setAppointmentList(res.data.appointmentList || []);
                setQuestionList(res.data.questionList || []);
                console.log("appointmentList: ", res.data.total);
                setTotal(res.data.total || { appointment: 0, question: 0 });
                setWeekData(res.data.weekData || []);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        callAPI();
    }, []);

    useEffect(() => {
        setPaginatedAppointments(
            paginateData(appointmentList, page.appointment, limit.appointment)
        );
        setPaginatedQuestions(
            paginateData(questionList, page.question, limit.question)
        );
    }, [page, limit, appointmentList, questionList]);

    return (
        <div className="homepage-doctor-container">
            {loading && <LoadingOverlay loading={loading} />}
            <div className="homepage-doctor-header">
                {/* Swiper Slide */}
                <Swiper
                    direction="horizontal"
                    effect="fade"
                    speed={1000}
                    loop={true}
                    navigation={true}
                    modules={[EffectFade, Navigation]}
                    className="homepage-doctor-swiper"
                >
                    {slidesData.map((slide, index) => (
                        <SwiperSlide key={index}>
                            <div
                                className="swiper-slide-content"
                                style={{
                                    backgroundImage: `url(${slide})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    height: "600px",
                                }}
                            ></div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Header Table */}
                <div className="homepage-doctor-header-table-container">
                    <h4 className="w-100 text-align-center font-italic">
                        Chào bác sĩ {account?.name}!
                    </h4>
                    <p>
                        "Chúc bạn một ngày tràn đầy năng lượng và thành công
                        trong hành trình chăm sóc sức khỏe cho mọi người!"
                    </p>
                    <div className="homepage-doctor-header-table-horizontal-divide"></div>
                    <div className="d-flex align-items-center justify-content-around w-100">
                        <div className="d-flex flex-column align-items-center">
                            <p className="homepage-doctor-header-table-title">
                                Số lịch hẹn hôm nay
                            </p>
                            <p className="homepage-doctor-header-table-value">
                                {todayAppointmentNum}
                            </p>
                        </div>
                        <div className="homepage-doctor-header-table-vertical-divide"></div>
                        <div className="d-flex flex-column align-items-center">
                            <p className="homepage-doctor-header-table-title">
                                Tổng số lịch hẹn đã khám
                            </p>
                            <p className="homepage-doctor-header-table-value">
                                {totalAppointmentNum}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="homepage-doctor-content">
                <div className="homepage-doctor-content-item-container">
                    <p className="homepage-doctor-content-item-title">
                        Số lượng bệnh nhân đã khám trong tuần
                    </p>
                    <div className="d-flex justify-content-between align-items-center row my-4">
                        <div className="homepage-doctor-content-small-item">
                            <Line
                                key={loading}
                                data={chartWeekConfig}
                                options={chartWeekOptions}
                                className="admin-dashboard-line-chart"
                            />
                            <p className="homepage-doctor-content-small-item-title mt-2">
                                Biểu đồ số lượng bệnh nhân trong tuần
                            </p>
                        </div>
                        <div className="homepage-doctor-content-small-item-vertical-divide"></div>
                        <div className="homepage-doctor-content-small-item">
                            <Table
                                key={loading}
                                columns={tableColumns}
                                dataSource={weekData}
                                pagination={false}
                            />
                            <p className="homepage-doctor-content-small-item-title mt-2">
                                Bảng số lượng bệnh nhân trong tuần
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="homepage-doctor-footer">
                <div className="homepage-doctor-footer-item-container">
                    <p className="homepage-doctor-footer-item-title">
                        Lịch hẹn trong ngày
                    </p>
                    {paginatedAppointments &&
                    paginatedAppointments.length > 0 ? (
                        <>
                            {paginatedAppointments.map((appointment) => (
                                <AppointmentCard
                                    value={appointment}
                                    key={appointment?._id}
                                />
                            ))}
                            <div className="w-100 d-flex justify-content-center align-items-center">
                                <Pagination
                                    current={page.appointment}
                                    pageSize={limit.appointment}
                                    total={total.appointment}
                                    onChange={(pageA, pageSize) => {
                                        setPage({
                                            ...page,
                                            appointment: pageA,
                                        });
                                        setLimit({
                                            ...limit,
                                            appointment: pageSize,
                                        });
                                    }}
                                    style={{
                                        marginTop: 16,
                                        textAlign: "right",
                                    }}
                                />
                            </div>
                        </>
                    ) : (
                        <NoData />
                    )}
                </div>

                <div className="homepage-doctor-footer-item-container">
                    <p className="homepage-doctor-footer-item-title">
                        Bảng câu hỏi
                    </p>
                    {paginatedQuestions && paginatedQuestions.length > 0 ? (
                        <>
                            {paginatedQuestions.map((question) => (
                                <QuestionCard
                                    value={question}
                                    key={question?._id}
                                />
                            ))}
                            <div className="w-100 d-flex justify-content-center align-items-center">
                                <Pagination
                                    current={page.question}
                                    pageSize={limit.question}
                                    total={total.question}
                                    onChange={(pageA, pageSize) => {
                                        setPage({
                                            ...page,
                                            question: pageA,
                                        });
                                        setLimit({
                                            ...limit,
                                            question: pageSize,
                                        });
                                    }}
                                    style={{
                                        marginTop: 16,
                                        textAlign: "right",
                                    }}
                                />
                            </div>
                        </>
                    ) : (
                        <NoData />
                    )}
                </div>
            </div>
        </div>
    );
}

export default HomepageDoctor;
