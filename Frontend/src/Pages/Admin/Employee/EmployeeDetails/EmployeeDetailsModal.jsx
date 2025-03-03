import React, { useState, useEffect } from "react";
import { UserCircle, Briefcase, CreditCard } from "lucide-react";

const EmployeeModal = ({ employee, onClose, handleSave }) => {
  const [editedEmployee, setEditedEmployee] = useState({
    personalDetails: {},
    employmentDetails: {},
    bankDetails: {},
  });

  const [errors, setErrors] = useState({});
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    if (employee) {
      setEditedEmployee(employee);
    }
  }, [employee]);
  const generateDeviceId = () => {
    const deviceId = `device-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("deviceId", deviceId);
    return deviceId;
  };

  useEffect(() => {
    // Fetch employees from backend
    const fetchManagers = async () => {
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
          "http://localhost:5001/api/employeeRoutes/formatted",
          {
            method: "GET",
            headers,
          }
        );
        const data = await response.json();
        console.log(data);
        setManagers(data.data); // Assuming data is an array of employee objects
      } catch (error) {
        console.error("Error fetching managers:", error);
      }
    };

    fetchManagers();
  }, []);

  const handleChange = (section, key, value) => {
    setEditedEmployee((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const validate = () => {
    let newErrors = {};
    const phoneRegex = /^[6-9]\d{9}$/;
    const aadharRegex = /^\d{12}$/;
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    const uanPfEsicRegex = /^\d{12}$/;
    const accountNumberRegex = /^\d{8,18}$/;

    const { personalDetails, employmentDetails, bankDetails } = editedEmployee;

    // **Personal Details Validation**
    if (!personalDetails.name?.trim()) {
      newErrors.name = "Name is required";
    }
    if (!personalDetails.gender?.trim()) {
      newErrors.gender = "Gender is required";
    }
    if (!personalDetails.location?.trim()) {
      newErrors.location = "Location is required";
    }
    if (!personalDetails.dateOfBirth) {
      newErrors.dateOfBirth = "Date of Birth is required";
    }
    if (!personalDetails.bloodGroup?.trim()) {
      newErrors.bloodGroup = "Blood group is required";
    }
    if (
      !personalDetails.personalEmail ||
      !emailRegex.test(personalDetails.personalEmail)
    ) {
      newErrors.personalEmail = "Invalid email format";
    }
    if (
      !personalDetails.phoneNumber ||
      !phoneRegex.test(personalDetails.phoneNumber)
    ) {
      newErrors.phoneNumber = "Invalid phone number (10 digits required)";
    }
    if (!personalDetails.maritalStatus?.trim()) {
      newErrors.maritalStatus = "Marital status is required";
    }
    if (
      !personalDetails.aadharNumber ||
      !aadharRegex.test(personalDetails.aadharNumber)
    ) {
      newErrors.aadharNumber = "Aadhar must be 12 digits";
    }
    if (
      !personalDetails.panNumber ||
      !panRegex.test(personalDetails.panNumber)
    ) {
      newErrors.panNumber = "PAN format invalid (e.g., ABCDE1234F)";
    }
    if (!personalDetails.currentAddress?.trim()) {
      newErrors.currentAddress = "Current address is required";
    }
    if (!personalDetails.permanentAddress?.trim()) {
      newErrors.permanentAddress = "Permanent address is required";
    }

    // **Employment Details Validation**
    if (!employmentDetails.employeeId?.trim()) {
      newErrors.employeeId = "Employee ID is required";
    }
    if (!employmentDetails.jobTitle?.trim()) {
      newErrors.jobTitle = "Job title is required";
    }
    if (!employmentDetails.location?.trim()) {
      newErrors.location = "Location is required";
    }
    if (
      !employmentDetails.officeEmail ||
      !emailRegex.test(employmentDetails.officeEmail)
    ) {
      newErrors.officeEmail = "Invalid office email format";
    }
    if (!employmentDetails.dateOfJoining) {
      newErrors.dateOfJoining = "Date of Joining is required";
    }
    if (!employmentDetails.employmentType?.trim()) {
      newErrors.employmentType = "Employment type is required";
    }
    if (
      !employmentDetails.uanNumber ||
      !uanPfEsicRegex.test(employmentDetails.uanNumber)
    ) {
      newErrors.uanNumber = "UAN must be 12 digits";
    }
    if (
      !employmentDetails.pfNumber ||
      !uanPfEsicRegex.test(employmentDetails.pfNumber)
    ) {
      newErrors.pfNumber = "PF number must be 12 digits";
    }
    if (
      !employmentDetails.esicNumber ||
      !uanPfEsicRegex.test(employmentDetails.esicNumber)
    ) {
      newErrors.esicNumber = "ESIC number must be 12 digits";
    }
    if (!employmentDetails.lineManagerId) {
      newErrors.lineManager = "Line manager selection is required";
    }

    // **Bank Details Validation**
    if (!bankDetails.accountHolder?.trim()) {
      newErrors.accountHolder = "Account holder name is required";
    }
    if (!bankDetails.bankName?.trim()) {
      newErrors.bankName = "Bank name is required";
    }
    if (!bankDetails.ifscCode || !ifscRegex.test(bankDetails.ifscCode)) {
      newErrors.ifscCode =
        "Invalid IFSC Code (11 characters, e.g., SBIN0001234)";
    }
    if (
      !bankDetails.accountNumber ||
      !accountNumberRegex.test(bankDetails.accountNumber)
    ) {
      newErrors.accountNumber = "Account Number must be 8-18 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveClick = () => {
    if (validate()) {
      handleSave(editedEmployee);
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Employee Details</h2>

        {/* Personal Details */}
        <div className="details-card">
          <h3>
            <UserCircle className="icon" /> Personal Details
          </h3>
          <div className="details-grid">
            {[
              "name",
              "gender",
              "location",
              "dateOfBirth",
              "bloodGroup",
              "personalEmail",
              "phoneNumber",
              "maritalStatus",
              "aadharNumber",
              "panNumber",
              "currentAddress",
              "permanentAddress",
            ].map((key) => (
              <div key={key}>
                <p className="detail-label">
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .trim()
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </p>
                <input
                  type={key.includes("date") ? "date" : "text"}
                  value={
                    editedEmployee.personalDetails?.[key] ||
                    editedEmployee?.[key] ||
                    ""
                  }
                  onChange={(e) =>
                    handleChange("personalDetails", key, e.target.value)
                  }
                />
                {errors[key] && <p className="error">{errors[key]}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Employment Details */}
        <div className="details-card">
          <h3>
            <Briefcase className="icon" /> Employment Details
          </h3>
          <div className="details-grid">
            {[
              "employeeId",
              "jobTitle",
              "location",
              "officeEmail",
              "dateOfJoining",
              "employmentType",
              "uanNumber",
              "pfNumber",
              "esicNumber",
            ].map((key) => (
              <div key={key}>
                <p className="detail-label">
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .trim()
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </p>
                <input
                  type={key.includes("date") ? "date" : "text"}
                  value={
                    editedEmployee.employmentDetails?.[key] ||
                    editedEmployee?.[key] ||
                    ""
                  }
                  onChange={(e) =>
                    handleChange("employmentDetails", key, e.target.value)
                  }
                />
                {errors[key] && <p className="error">{errors[key]}</p>}
              </div>
            ))}

            {/* Line Manager Dropdown */}
            {/* <div>
              <p className="detail-label">Line Manager</p>
              <select
                value={editedEmployee.employmentDetails?.lineManager || ""}
                onChange={(e) =>
                  handleChange(
                    "employmentDetails",
                    "lineManagerId",
                    e.target.value
                  )
                }
              >
                <option
                  value={
                    editedEmployee.employmentDetails?.["lineManagerId"] || ""
                  }
                >
                  {editedEmployee.employmentDetails?.["lineManager"]}
                </option>
                {managers?.map((manager) => (
                  <option key={manager.id} value={manager.id}>
                    {manager.name}
                  </option>
                ))}
              </select>
              {errors.lineManager && (
                <p className="error">{errors.lineManager}</p>
              )}
            </div> */}

            <div>
              <p className="detail-label">Line Manager</p>
              <select
                value={editedEmployee.employmentDetails?.lineManagerId || ""}
                onChange={(e) =>
                  handleChange(
                    "employmentDetails",
                    "lineManagerId",
                    e.target.value
                  )
                }
              >
                <option value="">Select a Manager</option>
                {managers?.map((manager) => (
                  <option key={manager.id} value={manager.id}>
                    {manager.name}
                  </option>
                ))}
              </select>
              {errors.lineManager && (
                <p className="error">{errors.lineManager}</p>
              )}
            </div>

            
          </div>
        </div>

        {/* Bank Details */}
        <div className="details-card">
          <h3>
            <CreditCard className="icon" /> Bank Details
          </h3>
          <div className="details-grid">
            {["accountHolder", "bankName", "accountNumber", "ifscCode"].map(
              (key) => (
                <div key={key}>
                  <p className="detail-label">
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .trim()
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </p>
                  <input
                    type="text"
                    value={editedEmployee.bankDetails?.[key] || ""}
                    onChange={(e) =>
                      handleChange("bankDetails", key, e.target.value)
                    }
                  />
                  {errors[key] && <p className="error">{errors[key]}</p>}
                </div>
              )
            )}
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={handleSaveClick}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeModal;
