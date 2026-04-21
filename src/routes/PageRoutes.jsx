import { lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

const LoginPage = lazy(() => import('../pages/login'))
const RegisterPage = lazy(() => import('../pages/register'))
const DashboardPage = lazy(() => import('../pages/dashboard'))
const UserPage = lazy(() => import('../pages/user'))
const DoctorPage = lazy(() => import('../pages/doctor'))
const ServicePage = lazy(() => import('../pages/service'))
const AppointmentPage = lazy(() => import('../pages/appointment'))
const AnnouncementPage = lazy(() => import('../pages/announcement'))
import { AlertProvider } from '../contexts/AlertContext'; 
import { getCookie } from '../utils/cookieHelper';

const PageRoutes = () => {
    const isAuthenticated = !!getCookie("access_token");
  return (
      <BrowserRouter>
        <AlertProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<DashboardPage />} />
            <Route path="/users" element={<UserPage />} />
            <Route path="/medical-personnels" element={<DoctorPage />} />
            <Route path="/services" element={<ServicePage />} />
            <Route path="/appointments" element={<AppointmentPage />} />
            <Route path="/announcement" element={<AnnouncementPage />} />
            <Route
              path="*"
              element={
                isAuthenticated
                  ? <Navigate to="/" replace />
                  : <Navigate to="/login" replace />
              }
            />
          </Routes>
        </AlertProvider>
      </BrowserRouter>
  )
}

export default PageRoutes