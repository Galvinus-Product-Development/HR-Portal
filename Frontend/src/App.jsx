
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { AuthProvider } from "../src/contexts/AuthContexts";

// Admin
import Layout from "./components/Admin/Layout";
import Attendance from "./Pages/Admin/Attendance/Attendance";
import DailyAttendance from "./Pages/Admin/Attendance/DailyAttendance/DailyAttendance";
import AttendanceDashboard from "./Pages/Admin/Attendance/AttendanceDashboard/AttendanceDashboard";
import TrainingAndLearning from "./Pages/Admin/TrainingAndLearning/TrainingAndLearning";
import Certification from "./Pages/Admin/Certification/Certification";
import Dashboard from "./Pages/Admin/Dashboard/Dashboard";
import EmployeeDatabase from "./Pages/Admin/Employee/EmployeeDatabase/EmployeeDatabase";
import EmployeeDetails from "./Pages/Admin/Employee/EmployeeDetails/EmployeeDetails";
import LeaveManagement from "./Pages/Admin/LeaveManagement/LeaveManagement";
import LeaveRequests from "./Pages/Admin/LeaveManagement/LeaveRequest/LeaveRequest";
import LeaveHistory from "./Pages/Admin/LeaveManagement/LeaveHistory/LeaveHistory";
import LeavePolicy from "./Pages/Admin/LeaveManagement/LeavePolicy/LeavePolicy";
import PrivateRoute from "./components/Admin/PrivateRoute";
import LoginPage from "./pages/Admin/auth/LoginPage";
import ResetPassword from "./Pages/Admin/auth/ResetPassword";
import NewPassword from "./Pages/Admin/auth/NewPassword";
import RolePermissions from "./Pages/Admin/RoleManagement/RolePermission";
import RegisterPage from "./Pages/Admin/auth/RegisterPage";
import NotificationPage from "./Pages/Admin/Notification/NotificationPage";


//Employee
import EmpLayout from './components/Employee/layout';
import EmpDashboard from './Pages/Employee/Dashboard/Dashboard';
import EmpLeaveManagement from './Pages/Employee/LeaveManagement/LeaveManagement';
import EmpAttendance from './Pages/Employee/Attendance/Attendance';
import EmpTraining from './Pages/Employee/TrainingAndLearning/TrainingAndLearning'
import EmpCertification from './Pages/Employee/Certification/Certification'
import EmpSettings from './Pages/Employee/Settings/Settings'
import EmpEmployeeLayout from './Pages/Employee/Employee/EmployeeLayout/EmployeeLayout';
import EmpPersonalDetails from './Pages/Employee/Employee/PersonalDetails/PersonalDetails';
import EmploymentDetails from './Pages/Employee/Employee/EmployementDetails/EmployementDetails';
import EmpBankDetails from './Pages/Employee/Employee/BankDetails/BankDetails';
import EmpLeaveHistory from './Pages/Employee/LeaveManagement/LeaveHistory/LeaveHistory';
import EmpLeavePolicy from './Pages/Employee/LeaveManagement/LeavePolicy/LeavePolicy';
import EmpRequestLeave from './Pages/Employee/LeaveManagement/RequestLeave/RequestLeave'
import EmpAttendanceTracker from './Pages/Employee/Attendance/AttendanceTracker/AttendanceTracker';
import EmpAttendanceDashboard from './Pages/Employee/Attendance/AttendanceDashboard/AttendanceDashboard';
import EmpTrainingDetails from './Pages/Employee/TrainingAndLearning/TrainingDetails/TrainingDetails';
import EmpAddBankDetails from './Pages/Employee/Test/BankDetails';
import CompleteRegistration from "./Pages/Employee/CompleteRegistration";

// import Auth from './Pages/Auth/Auth';

function App() {
  return (
    
    <BrowserRouter>
    <AuthProvider>
        <Routes>



          {/* Authentication Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/reset-password/:token" element={<NewPassword />} />
          <Route path="/complete-registration/:token" element={<CompleteRegistration />} />
          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="leave-management" element={<LeaveManagement />} />

            <Route
              path="leave-management/leave-requests"
              element={<LeaveRequests />}
            />
            <Route
              path="leave-management/leave-history"
              element={<LeaveHistory />}
            />
            <Route
              path="leave-management/leave-policy"
              element={<LeavePolicy />}
            />

            <Route path="employee" element={<EmployeeDatabase />} />
            <Route path="role-permission" element={<RolePermissions />} />
            <Route path="employees/:id" element={<EmployeeDetails />} />
            <Route path="attendance/daily" element={<DailyAttendance />} />
            <Route
              path="attendance/dashboard"
              element={<AttendanceDashboard />}
            />
            <Route path="training" element={<TrainingAndLearning />} />
            <Route path="certification" element={<Certification />} />
            <Route path="register-page" element={<RegisterPage />} />
            <Route path="notification-page" element={<NotificationPage />} />
          </Route>
          {/* <Route path="*" element={<Navigate to="/" replace />} /> */}

          {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}


          {/* Employee Routes */}
          <Route
            path="/employee"
            element={
              <PrivateRoute>
                <EmpLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<EmpDashboard />} />
            {/* <Route path="/auth" element={<Auth />} /> */}
            <Route path="leave-management" element={<EmpLeaveManagement />} />
            <Route path="demo" element={<EmpAddBankDetails />} />
            <Route
              path="leave-management/request-leave"
              element={<EmpRequestLeave />}
            />
            <Route
              path="leave-management/leave-history"
              element={<EmpLeaveHistory />}
            />
            <Route
              path="leave-management/leave-policy"
              element={<EmpLeavePolicy />}
            />
            <Route path="attendance" element={<EmpAttendance />}>
              <Route path="tracker" element={<EmpAttendanceTracker />} />
              <Route path="dashboard" element={<EmpAttendanceDashboard />} />
            </Route>
            <Route path="training" element={<EmpTraining />} />
            <Route path="training/:id" element={<EmpTrainingDetails />} />
            <Route path="certification" element={<EmpCertification />} />
            <Route path="settings" element={<EmpSettings />} />
            <Route path="employee" element={<EmpEmployeeLayout />}>
              <Route path="personal" element={<EmpPersonalDetails />} />
              <Route path="employment" element={<EmploymentDetails />} />
              <Route path="bank" element={<EmpBankDetails />} />
            </Route>
          </Route>



        </Routes>
      
    </AuthProvider>
    </BrowserRouter>
  );
}

export default App;