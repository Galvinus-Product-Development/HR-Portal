// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   ArrowLeft,
//   User,
//   Mail,
//   Phone,
//   Building,
//   MapPin,
//   Calendar,
//   CreditCard,
//   Building2,
//   Edit,
//   UserCog,
//   Home,
//   UserCircle,
//   Briefcase,
// } from "lucide-react";
// import "./EmployeeDetails.css";
// import EmployeeDetailsModal from "./EmployeeDetailsModal"; // Import the modal component
// import "./EmployeeDetailsModal.css";
// const API_BASE_URL_ED = import.meta.env.VITE_API_BASE_URL_ED;
// const EmployeeDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   // State to store employee data
//   const [employee, setEmployee] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const generateDeviceId = () => {
//     const deviceId = `device-${Math.random().toString(36).substr(2, 9)}`;
//     localStorage.setItem("deviceId", deviceId);
//     return deviceId;
//   };

//   useEffect(() => {
//     const fetchEmployeeData = async () => {
//       const deviceId = localStorage.getItem("deviceId") || generateDeviceId();
//       const userAgent = navigator.userAgent;
//       const headers = {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
//         "x-refresh-token": localStorage.getItem("refreshToken") || "",
//         "x-device-id": deviceId, // Send deviceId in headers
//         "user-agent": userAgent, // Send user agent in headers
//       };
//       try {
//         const response = await fetch(
//           `${API_BASE_URL_ED}/api/employeeRoutes/fetchEmployeeDetailsById/${id}`,
//           {
//             method: "GET",
//             headers,
//           }
//         );
//         if (!response.ok) {
//           throw new Error("Employee not found");
//         }
//         const data = await response.json();
//         console.log("This is the real data:-", data);
//         setEmployee(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEmployeeData();
//   }, [id]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   if (!employee) {
//     return <div>Employee not found</div>;
//   }

//   const fetchEmployeeDataa = async () => {
//     try {
//       const deviceId = localStorage.getItem("deviceId") || generateDeviceId();
//       const userAgent = navigator.userAgent;
//       const headers = {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
//         "x-refresh-token": localStorage.getItem("refreshToken") || "",
//         "x-device-id": deviceId, // Send deviceId in headers
//         "user-agent": userAgent, // Send user agent in headers
//       };
//       const response = await fetch(
//         `${API_BASE_URL_ED}/api/employeeRoutes/fetchEmployeeDetailsById/${id}`,
//         {
//           method: "GET",
//           headers,
//         }
//       );
//       if (!response.ok) {
//         throw new Error("Employee not found");
//       }
//       const data = await response.json();
//       console.log(data);
//       setEmployee(data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSave = async (updatedEmployee) => {
//     try {
//       const deviceId = localStorage.getItem("deviceId") || generateDeviceId();
//       const userAgent = navigator.userAgent;
//       const headers = {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
//         "x-refresh-token": localStorage.getItem("refreshToken") || "",
//         "x-device-id": deviceId, // Send deviceId in headers
//         "user-agent": userAgent, // Send user agent in headers
//       };
//       console.log("This is edited employee Data:-", updatedEmployee);
//       const response = await fetch(
//         `${API_BASE_URL_ED}/api/employeeRoutes/update-all/${id}`,
//         {
//           method: "PUT",
//           headers,
//           body: JSON.stringify(updatedEmployee),
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to update employee details");
//       }
//       // console.log(updatedEmployee);
//       // const updatedData = await response.json();
//       // setEmployee(updatedData);
//       await fetchEmployeeDataa();
//       setIsModalOpen(false);
//     } catch (error) {
//       console.error("Error updating employee:", error.message);
//     }
//   };

//   const handleApproval = async (status) => {
//     try {
//       const deviceId = localStorage.getItem("deviceId") || generateDeviceId();
//       const userAgent = navigator.userAgent;
//       const headers = {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
//         "x-refresh-token": localStorage.getItem("refreshToken") || "",
//         "x-device-id": deviceId, // Send deviceId in headers
//         "user-agent": userAgent, // Send user agent in headers
//       };
//       const response = await fetch(
//         `${API_BASE_URL_ED}/api/employeeRoutes/approval-status/${id}`,
//         {
//           method: "PUT",
//           headers,
//           body: JSON.stringify({ approvalStatus: status }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to update approval status");
//       }

//       // Refresh employee data after update
//       await fetchEmployeeDataa();
//     } catch (error) {
//       console.error("Error updating approval status:", error.message);
//     }
//   };

//   return (
//     <div className="employee-details-container">
//       {/* Header */}
//       <div className="employee-details-header">
//         <div className="action-buttons">
//           <button
//             className="action-button"
//             onClick={() => setIsModalOpen(true)}
//           >
//             <Edit className="icon" />
//             Edit Profile
//           </button>
//           {employee.personalDetails?.approvalStatus == "PENDING" && (
//             <button
//               className="action-button"
//               onClick={() => handleApproval("APPROVED")}
//             >
//               <Edit className="icon" />
//               Approve Details
//             </button>
//           )}
//           {employee.personalDetails?.approvalStatus == "PENDING" && (
//             <button
//               className="action-button"
//               onClick={() => handleApproval("REJECTED")}
//             >
//               <Edit className="icon" />
//               Reject Details
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Employee Overview */}
//       <div className="overview-card">
//         <div className="overview-content">
//           <img
//             src={employee.avatar}
//             alt={employee.personalDetails?.name}
//             className="employee-avatar"
//           />
//           <div className="employee-info">
//             <div className="employee-header">
//               <div>
//                 <h1 className="employee-name">
//                   {employee.personalDetails?.name}
//                 </h1>
//                 <p className="employee-job-title">
//                   {employee.employmentDetails?.jobTitle}
//                 </p>
//               </div>
//               <span
//                 className={`status-badge ${employee?.employmentDetails?.status?.toLowerCase()}`}
//               >
//                 {employee?.employmentDetails?.status}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Personal Details */}
//       <div className="details-card">
//         <h2 className="details-title">
//           <UserCircle className="icon" />
//           Personal Details
//         </h2>
//         <div className="details-grid">
//           <div>
//             <p className="detail-label">Employee Name</p>
//             <p className="detail-value">{employee?.personalDetails?.name}</p>
//           </div>
//           <div>
//             <p className="detail-label">Gender</p>
//             <p className="detail-value">{employee.personalDetails?.gender}</p>
//           </div>

//           <div>
//             <p className="detail-label">Date of Birth</p>
//             <p className="detail-value">
//               {employee.personalDetails?.dateOfBirth
//                 ? new Intl.DateTimeFormat("en-GB").format(
//                     new Date(employee.personalDetails.dateOfBirth)
//                   )
//                 : "N/A"}
//             </p>
//           </div>

//           <div>
//             <p className="detail-label">Blood Group</p>
//             <p className="detail-value">
//               {employee.personalDetails?.bloodGroup}
//             </p>
//           </div>
//           <div>
//             <p className="detail-label">Personal Email</p>
//             <p className="detail-value">
//               {employee.personalDetails?.personalEmail}
//             </p>
//           </div>
//           <div>
//             <p className="detail-label">Phone Number</p>
//             <p className="detail-value">
//               {employee.personalDetails?.phoneNumber}
//             </p>
//           </div>
//           <div>
//             <p className="detail-label">Emergency Contact</p>
//             <p className="detail-value">
//               {employee?.emergencyContact?.phoneNumber}
//             </p>
//           </div>
//           <div>
//             <p className="detail-label">Marital Status</p>
//             <p className="detail-value">
//               {employee.personalDetails?.maritalStatus}
//             </p>
//           </div>
//           <div>
//             <p className="detail-label">Aadhar Number</p>
//             <p className="detail-value">
//               {employee?.personalDetails?.aadharNumber}
//             </p>
//           </div>
//           <div>
//             <p className="detail-label">Pan Number</p>
//             <p className="detail-value">
//               {employee?.personalDetails?.panNumber}
//             </p>
//           </div>
//           <div>
//             <p className="detail-label">Current Address</p>
//             <p className="detail-value">
//               {employee.personalDetails?.currentAddress}
//             </p>
//           </div>
//           <div>
//             <p className="detail-label">Permanent Address</p>
//             <p className="detail-value">
//               {employee.personalDetails?.permanentAddress}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Employment Details */}
//       <div className="details-card">
//         <h2 className="details-title">
//           <Briefcase className="icon" />
//           Employment Details
//         </h2>
//         <div className="details-grid">
//           <div>
//             <p className="detail-label">Employee ID</p>
//             <p className="detail-value">
//               {employee.employmentDetails?.employeeId}
//             </p>
//           </div>

//           <div>
//             <p className="detail-label">Status</p>
//             <p className="detail-value">
//               {employee?.employmentDetails?.status.toLowerCase()}
//             </p>
//           </div>


//           <div>
//             <p className="detail-label">Job Title</p>
//             <p className="detail-value">
//               {employee.employmentDetails?.jobTitle}
//             </p>
//           </div>
//           <div>
//             <p className="detail-label">Department</p>
//             <p className="detail-value">
//               {employee.employmentDetails?.department}
//             </p>
//           </div>
//           <div>
//             <p className="detail-label">Line Manager</p>
//             <p className="detail-value">
//               {employee.employmentDetails?.lineManager}
//             </p>
//           </div>
//           <div>
//             <p className="detail-label">Location</p>
//             <p className="detail-value">
//               {employee.employmentDetails?.location}
//             </p>
//           </div>
//           <div>
//             <p className="detail-label">Office Email</p>
//             <p className="detail-value">
//               {employee.employmentDetails?.officeEmail}
//             </p>
//           </div>
//           <div>
//             <p className="detail-label">Date of Joining</p>
//             <p className="detail-value">
//               {employee.employmentDetails?.dateOfJoining}
//             </p>
//           </div>
//           <div>
//             <p className="detail-label">Employment Type</p>
//             <p className="detail-value">
//               {employee.employmentDetails?.employmentType}
//             </p>
//           </div>
//           <div>
//             <p className="detail-label">UAN</p>
//             <p className="detail-value">
//               {employee?.employmentDetails?.uanNumber}
//             </p>
//           </div>
//           <div>
//             <p className="detail-label">PF Account Number</p>
//             <p className="detail-value">
//               {employee?.employmentDetails?.pfNumber}
//             </p>
//           </div>
//           <div>
//             <p className="detail-label">ESIC Number</p>
//             <p className="detail-value">
//               {employee?.employmentDetails?.esicNumber}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Bank Details */}
//       <div className="details-card">
//         <h2 className="details-title">
//           <CreditCard className="icon" />
//           Bank Details
//         </h2>
//         <div className="details-grid">
//           <div>
//             <p className="detail-label">Account Holder's Name</p>
//             <p className="detail-value">
//               {employee.bankDetails?.accountHolder}
//             </p>
//           </div>
//           <div>
//             <p className="detail-label">Bank Name</p>
//             <p className="detail-value">{employee.bankDetails?.bankName}</p>
//           </div>
//           <div>
//             <p className="detail-label">Account Number</p>
//             <p className="detail-value">
//               {employee.bankDetails?.accountNumber}
//             </p>
//           </div>
//           <div>
//             <p className="detail-label">IFSC Code</p>
//             <p className="detail-value">{employee.bankDetails?.ifscCode}</p>
//           </div>
//           {/* <div>
//                         <p className="detail-label">Account Status</p>
//                         <p className="detail-value">{employee.bankDetails?.accountStatus}</p>
//                     </div> */}
//         </div>
//       </div>

//       {isModalOpen && (
//         <EmployeeDetailsModal
//           onClose={() => setIsModalOpen(false)}
//           employee={employee}
//           handleSave={handleSave}
//         />
//       )}
//     </div>
//   );
// };

// export default EmployeeDetails;
























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
const API_BASE_URL_ED = import.meta.env.VITE_API_BASE_URL_ED;
const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State to store employee data
  const [employee, setEmployee] = useState(null);
  const [unapprovedEmployee, setUnapprovedEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [approvalAction, setApprovalAction] = useState(null); // 'APPROVED' or 'REJECTED'
  
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
          `${API_BASE_URL_ED}/api/employeeRoutes/fetchEmployeeDetailsById/${id}`,
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

    const fetchUnapprovedEmployeeData = async () => {
      const deviceId = localStorage.getItem("deviceId") || generateDeviceId();
      const userAgent = navigator.userAgent;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
        "x-refresh-token": localStorage.getItem("refreshToken") || "",
        "x-device-id": deviceId,
        "user-agent": userAgent,
      };
    
      try {
        const response = await fetch(
          `${API_BASE_URL_ED}/api/personal-details/unapproved/${id}`,
          {
            method: "GET",
            headers,
          }
        );
    
        if (!response.ok) {
          throw new Error("Employee not found");
        }
    
        const data = await response.json();
        const submission = data.submission || {};
    
        // Find Aadhaar and PAN documents
        const aadhaarDoc = submission.documents?.find(
          (doc) => doc.document_type === "AADHAAR"
        );
        const panDoc = submission.documents?.find(
          (doc) => doc.document_type === "PAN"
        );
    
        // Attach them to the submission object
        const updatedSubmission = {
          ...submission,
          aadharNumber: aadhaarDoc?.document_number || "",
          aadhaarIssueDate: aadhaarDoc?.issue_date || "",
          aadhaarExpiryDate: aadhaarDoc?.expiry_date || "",
          aadhaarPath: aadhaarDoc?.document_path || "",
    
          panNumber: panDoc?.document_number || "",
          panIssueDate: panDoc?.issue_date || "",
          panExpiryDate: panDoc?.expiry_date || "",
          panPath: panDoc?.document_path || "",
        };
    
        // Set it in state
        setUnapprovedEmployee({ submission: updatedSubmission });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    

    fetchUnapprovedEmployeeData()

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
        `${API_BASE_URL_ED}/api/employeeRoutes/fetchEmployeeDetailsById/${id}`,
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
        `${API_BASE_URL_ED}/api/employeeRoutes/update-all/${id}`,
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

  const handleApprovalModalOpen = (status) => {
    // Check if there are details to approve
    if (unapprovedEmployee.submission?.approval_status === "PENDING") {
      setApprovalAction(status);
      setIsApprovalModalOpen(true);
    } else {
      // If nothing to approve, don't open the modal
      alert("No pending details to approve or reject.");
    }
  };

  const handleApproval = async () => {
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
        `${API_BASE_URL_ED}/api/employeeRoutes/approval-status/${id}`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify({ approvalStatus: approvalAction }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update approval status");
      }

      // Close the modal
      setIsApprovalModalOpen(false);
      
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
          {unapprovedEmployee?.submission?.approval_status === "PENDING" && (
            <button
              className="action-button"
              onClick={() => handleApprovalModalOpen("APPROVED")}
            >
              <Edit className="icon" />
              Approve Details
            </button>
          )}
          {unapprovedEmployee?.submission?.approval_status === "PENDING" && (
            <button
              className="action-button"
              onClick={() => handleApprovalModalOpen("REJECTED")}
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
            <p className="detail-label">Date of Birth</p>
            <p className="detail-value">
              {employee.personalDetails?.dateOfBirth
                ? new Intl.DateTimeFormat("en-GB").format(
                    new Date(employee.personalDetails.dateOfBirth)
                  )
                : "N/A"}
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
            <p className="detail-label">Status</p>
            <p className="detail-value">
              {employee?.employmentDetails?.status.toLowerCase()}
            </p>
          </div>


          <div>
            <p className="detail-label">Job Title</p>
            <p className="detail-value">
              {employee.employmentDetails?.jobTitle}
            </p>
          </div>
          <div>
            <p className="detail-label">Department</p>
            <p className="detail-value">
              {employee.employmentDetails?.department}
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
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <EmployeeDetailsModal
          onClose={() => setIsModalOpen(false)}
          employee={employee}
          handleSave={handleSave}
        />
      )}

      {/* Approval Modal */}
      {isApprovalModalOpen && unapprovedEmployee.submission?.approval_status === "PENDING" && (
        <div className="modal-overlay">
          <div className="approval-modal">
            <div className="modal-header">
              <h2>{approvalAction === "APPROVED" ? "Approve" : "Reject"} Employee Details</h2>
              <button
                className="close-button"
                onClick={() => setIsApprovalModalOpen(false)}
              >
                &times;
              </button>
            </div>
            <div className="modal-content">
              <div className="approval-details">
                <h3>Personal Details Pending Approval:</h3>
                <div className="details-list">
                  <div className="detail-item">
                    <span className="detail-key">First Name:</span>
                    <span className="detail-value">{unapprovedEmployee.submission?.first_name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-key">Last Name:</span>
                    <span className="detail-value">{unapprovedEmployee.submission?.last_name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-key">Gender:</span>
                    <span className="detail-value">{unapprovedEmployee.submission?.gender}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-key">Date of Birth:</span>
                    <span className="detail-value">
                      {unapprovedEmployee.submission?.date_of_birth
                        ? new Intl.DateTimeFormat("en-GB").format(
                            new Date(unapprovedEmployee.submission.date_of_birth)
                          )
                        : "N/A"}
                    </span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-key">Blood Group:</span>
                    <span className="detail-value">{unapprovedEmployee.submission?.blood_group}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-key">Personal Email:</span>
                    <span className="detail-value">{unapprovedEmployee.submission?.email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-key">Phone Number:</span>
                    <span className="detail-value">{unapprovedEmployee.submission?.phone_number}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-key">Marital Status:</span>
                    <span className="detail-value">{unapprovedEmployee.submission?.marital_status}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-key">Aadhar Number:</span>
                    <span className="detail-value">{unapprovedEmployee.submission?.aadharNumber}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-key">PAN Number:</span>
                    <span className="detail-value">{unapprovedEmployee.submission?.panNumber}</span>
                  </div>
                </div>
              </div>
              <div className="modal-actions">
                <button
                  className="cancel-button"
                  onClick={() => setIsApprovalModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className={`${approvalAction === "APPROVED" ? "approve-button" : "reject-button"}`}
                  onClick={handleApproval}
                >
                  {approvalAction === "APPROVED" ? "Approve" : "Reject"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetails;