import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  CreditCard,
  Building2,
  Edit,
  UserCog,
  Home,
  UserCircle,
  Briefcase,
} from "lucide-react";
import "./EmployeeDetails.css";
import EmployeeDetailsModal from "./EmployeeDetailsModal"; // Import the modal component
import "./EmployeeDetailsModal.css";

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State to store employee data
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const generateDeviceId = () => {
    const deviceId = `device-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("deviceId", deviceId);
    return deviceId;
  };

  useEffect(() => {
    const fetchEmployeeData = async () => {
      const deviceId = localStorage.getItem("deviceId") || generateDeviceId();
      const userAgent = navigator.userAgent;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
        "x-refresh-token": localStorage.getItem("refreshToken") || "",
        "x-device-id": deviceId, // Send deviceId in headers
        "user-agent": userAgent, // Send user agent in headers
      };
      try {
        const response = await fetch(
          `http://localhost:5001/api/employeeRoutes/fetchEmployeeDetailsById/${id}`,
          {
            method: "GET",
            headers,
          }
        );
        if (!response.ok) {
          throw new Error("Employee not found");
        }
        const data = await response.json();
        console.log("This is the real data:-", data);
        setEmployee(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!employee) {
    return <div>Employee not found</div>;
  }

  const fetchEmployeeDataa = async () => {
    try {
      const deviceId = localStorage.getItem("deviceId") || generateDeviceId();
      const userAgent = navigator.userAgent;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
        "x-refresh-token": localStorage.getItem("refreshToken") || "",
        "x-device-id": deviceId, // Send deviceId in headers
        "user-agent": userAgent, // Send user agent in headers
      };
      const response = await fetch(
        `http://localhost:5001/api/employeeRoutes/fetchEmployeeDetailsById/${id}`,
        {
          method: "GET",
          headers,
        }
      );
      if (!response.ok) {
        throw new Error("Employee not found");
      }
      const data = await response.json();
      console.log(data);
      setEmployee(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updatedEmployee) => {
    try {
      const deviceId = localStorage.getItem("deviceId") || generateDeviceId();
      const userAgent = navigator.userAgent;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
        "x-refresh-token": localStorage.getItem("refreshToken") || "",
        "x-device-id": deviceId, // Send deviceId in headers
        "user-agent": userAgent, // Send user agent in headers
      };
      console.log("This is edited employee Data:-", updatedEmployee);
      const response = await fetch(
        `http://localhost:5001/api/employeeRoutes/update-all/${id}`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify(updatedEmployee),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update employee details");
      }
      // console.log(updatedEmployee);
      // const updatedData = await response.json();
      // setEmployee(updatedData);
      await fetchEmployeeDataa();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating employee:", error.message);
    }
  };

  const handleApproval = async (status) => {
    try {
      const deviceId = localStorage.getItem("deviceId") || generateDeviceId();
      const userAgent = navigator.userAgent;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
        "x-refresh-token": localStorage.getItem("refreshToken") || "",
        "x-device-id": deviceId, // Send deviceId in headers
        "user-agent": userAgent, // Send user agent in headers
      };
      const response = await fetch(
        `http://localhost:5001/api/employeeRoutes/approval-status/${id}`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify({ approvalStatus: status }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update approval status");
      }

      // Refresh employee data after update
      await fetchEmployeeDataa();
    } catch (error) {
      console.error("Error updating approval status:", error.message);
    }
  };

  return (
    <div className="employee-details-container">
      {/* Header */}
      <div className="employee-details-header">
        <div className="action-buttons">
          <button
            className="action-button"
            onClick={() => setIsModalOpen(true)}
          >
            <Edit className="icon" />
            Edit Profile
          </button>
          {employee.personalDetails?.approvalStatus == "PENDING" && (
            <button
              className="action-button"
              onClick={() => handleApproval("APPROVED")}
            >
              <Edit className="icon" />
              Approve Details
            </button>
          )}
          {employee.personalDetails?.approvalStatus == "PENDING" && (
            <button
              className="action-button"
              onClick={() => handleApproval("REJECTED")}
            >
              <Edit className="icon" />
              Reject Details
            </button>
          )}
        </div>
      </div>

      {/* Employee Overview */}
      <div className="overview-card">
        <div className="overview-content">
          <img
            src={employee.avatar}
            alt={employee.personalDetails?.name}
            className="employee-avatar"
          />
          <div className="employee-info">
            <div className="employee-header">
              <div>
                <h1 className="employee-name">
                  {employee.personalDetails?.name}
                </h1>
                <p className="employee-job-title">
                  {employee.employmentDetails?.jobTitle}
                </p>
              </div>
              <span
                className={`status-badge ${employee?.employmentDetails?.status?.toLowerCase()}`}
              >
                {employee?.employmentDetails?.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Details */}
      <div className="details-card">
        <h2 className="details-title">
          <UserCircle className="icon" />
          Personal Details
        </h2>
        <div className="details-grid">
          <div>
            <p className="detail-label">Employee Name</p>
            <p className="detail-value">{employee?.personalDetails?.name}</p>
          </div>
          <div>
            <p className="detail-label">Gender</p>
            <p className="detail-value">{employee.personalDetails?.gender}</p>
          </div>
          <div>
            <p className="detail-label">Location</p>
            <p className="detail-value">{employee.personalDetails?.location}</p>
          </div>
          <div>
            <p className="detail-label">Date of Birth</p>
            <p className="detail-value">
              {employee.personalDetails?.dateOfBirth}
            </p>
          </div>
          <div>
            <p className="detail-label">Blood Group</p>
            <p className="detail-value">
              {employee.personalDetails?.bloodGroup}
            </p>
          </div>
          <div>
            <p className="detail-label">Personal Email</p>
            <p className="detail-value">
              {employee.personalDetails?.personalEmail}
            </p>
          </div>
          <div>
            <p className="detail-label">Phone Number</p>
            <p className="detail-value">
              {employee.personalDetails?.phoneNumber}
            </p>
          </div>
          <div>
            <p className="detail-label">Emergency Contact</p>
            <p className="detail-value">
              {employee?.emergencyContact?.phoneNumber}
            </p>
          </div>
          <div>
            <p className="detail-label">Marital Status</p>
            <p className="detail-value">
              {employee.personalDetails?.maritalStatus}
            </p>
          </div>
          <div>
            <p className="detail-label">Aadhar Number</p>
            <p className="detail-value">
              {employee?.personalDetails?.aadharNumber}
            </p>
          </div>
          <div>
            <p className="detail-label">Pan Number</p>
            <p className="detail-value">
              {employee?.personalDetails?.panNumber}
            </p>
          </div>
          <div>
            <p className="detail-label">Current Address</p>
            <p className="detail-value">
              {employee.personalDetails?.currentAddress}
            </p>
          </div>
          <div>
            <p className="detail-label">Permanent Address</p>
            <p className="detail-value">
              {employee.personalDetails?.permanentAddress}
            </p>
          </div>
        </div>
      </div>

      {/* Employment Details */}
      <div className="details-card">
        <h2 className="details-title">
          <Briefcase className="icon" />
          Employment Details
        </h2>
        <div className="details-grid">
          <div>
            <p className="detail-label">Employee ID</p>
            <p className="detail-value">
              {employee.employmentDetails?.employeeId}
            </p>
          </div>
          <div>
            <p className="detail-label">Job Title</p>
            <p className="detail-value">
              {employee.employmentDetails?.jobTitle}
            </p>
          </div>
          <div>
            <p className="detail-label">Line Manager</p>
            <p className="detail-value">
              {employee.employmentDetails?.lineManager}
            </p>
          </div>
          <div>
            <p className="detail-label">Location</p>
            <p className="detail-value">
              {employee.employmentDetails?.location}
            </p>
          </div>
          <div>
            <p className="detail-label">Office Email</p>
            <p className="detail-value">
              {employee.employmentDetails?.officeEmail}
            </p>
          </div>
          <div>
            <p className="detail-label">Date of Joining</p>
            <p className="detail-value">
              {employee.employmentDetails?.dateOfJoining}
            </p>
          </div>
          <div>
            <p className="detail-label">Employment Type</p>
            <p className="detail-value">
              {employee.employmentDetails?.employmentType}
            </p>
          </div>
          <div>
            <p className="detail-label">UAN</p>
            <p className="detail-value">
              {employee?.employmentDetails?.uanNumber}
            </p>
          </div>
          <div>
            <p className="detail-label">PF Account Number</p>
            <p className="detail-value">
              {employee?.employmentDetails?.pfNumber}
            </p>
          </div>
          <div>
            <p className="detail-label">ESIC Number</p>
            <p className="detail-value">
              {employee?.employmentDetails?.esicNumber}
            </p>
          </div>
        </div>
      </div>

      {/* Bank Details */}
      <div className="details-card">
        <h2 className="details-title">
          <CreditCard className="icon" />
          Bank Details
        </h2>
        <div className="details-grid">
          <div>
            <p className="detail-label">Account Holder's Name</p>
            <p className="detail-value">
              {employee.bankDetails?.accountHolder}
            </p>
          </div>
          <div>
            <p className="detail-label">Bank Name</p>
            <p className="detail-value">{employee.bankDetails?.bankName}</p>
          </div>
          <div>
            <p className="detail-label">Account Number</p>
            <p className="detail-value">
              {employee.bankDetails?.accountNumber}
            </p>
          </div>
          <div>
            <p className="detail-label">IFSC Code</p>
            <p className="detail-value">{employee.bankDetails?.ifscCode}</p>
          </div>
          {/* <div>
                        <p className="detail-label">Account Status</p>
                        <p className="detail-value">{employee.bankDetails?.accountStatus}</p>
                    </div> */}
        </div>
      </div>

      {isModalOpen && (
        <EmployeeDetailsModal
          onClose={() => setIsModalOpen(false)}
          employee={employee}
          handleSave={handleSave}
        />
      )}
    </div>
  );
};

export default EmployeeDetails;
