import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import HomePage from "../pages/homepage";
import { Routes, Route, Navigate } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProctectedRoute";
import WebFont from "webfontloader";
import MainLayout from "../../components/Layout/MainLayout";
import LoginPage from "../pages/login";
import RegisterPage from "../pages/register";
import HomepageDoctor from "../pages/doctor/dashboard";
import HomepageAdmin from "../pages/admin/dashboard";
import DoctorRoom from "../pages/doctor/room";
import DoctorPatient from "../pages/doctor/patient";
import DoctorQuestion from "../pages/doctor/question";
import DoctorAppointmentDetail from "../pages/doctor/appointment_detail";
import PatientProfile from "../pages/doctor/patient_profile";
import AdminLayout from "../../components/Layout/AdminLayout";
import AdminDoctors from "../pages/admin/doctors";
import AdminAppointments from "../pages/admin/appointments";
import AdminQuestions from "../pages/admin/questions";
import AdminPatients from "../pages/admin/patients";

const AllRoutes = () => {
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Nunito Sans", "Public Sans"],
      },
    });
  }, []);

  const { account } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to={
              account
                ? account.role === "admin"
                  ? "/admin/dashboard"
                  : "/doctor/dashboard"
                : "/homepage"
            }
          />
        }
      />
      {/* // public route  */}
      <Route element={<PublicRoute />}>
        <Route
          path="/homepage"
          element={<MainLayout children={<HomePage />} />}
        />
        <Route
          path="/auth/login"
          element={<MainLayout children={<LoginPage />} isFooter={false} />}
        />
        <Route
          path="/auth/register"
          element={<MainLayout children={<RegisterPage />} isFooter={false} />}
        />
      </Route>

      {/* // admin, doctor route  */}
      <Route element={<ProtectedRoute allowedRoles={["admin", "doctor"]} />}>
        {/* doctor */}
        <Route
          path="/doctor/dashboard"
          element={<MainLayout children={<HomepageDoctor />} />}
        />
        <Route
          path="/doctor/room"
          element={<MainLayout children={<DoctorRoom />} />}
        />
        <Route
          path="/doctor/patient"
          element={<MainLayout children={<DoctorPatient />} />}
        />
        <Route
          path="/doctor/question"
          element={<MainLayout children={<DoctorQuestion />} />}
        />
        <Route
          path="/doctor/appointment-detail/:id"
          element={<MainLayout children={<DoctorAppointmentDetail />} />}
        />
        <Route
          path="/doctor/patient/:id"
          element={<MainLayout children={<PatientProfile />} />}
        />

        {/* admin */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminLayout children={<HomepageAdmin />} currentPage="Trang chủ" />
          }
        />
        <Route
          path="/admin/doctor"
          element={
            <AdminLayout children={<AdminDoctors />} currentPage="Bác sĩ" />
          }
        />
        <Route
          path="/admin/appointment"
          element={
            <AdminLayout
              children={<AdminAppointments />}
              currentPage="Cuộc hẹn"
            />
          }
        />
        <Route
          path="/admin/question"
          element={
            <AdminLayout children={<AdminQuestions />} currentPage="Câu hỏi" />
          }
        />
        <Route
          path="/admin/patient"
          element={
            <AdminLayout children={<AdminPatients />} currentPage="Bệnh nhân" />
          }
        />
      </Route>
    </Routes>
  );
};

export default AllRoutes;
