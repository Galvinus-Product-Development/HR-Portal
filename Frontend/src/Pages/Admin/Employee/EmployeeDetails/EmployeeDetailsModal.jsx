import React, { useState, useEffect } from "react";
import { UserCircle, Briefcase, CreditCard } from "lucide-react";
const API_BASE_URL_ED = import.meta.env.VITE_API_BASE_URL_ED;
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
          `${API_BASE_URL_ED}/api/employeeRoutes/formatted`,
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
    if (!employmentDetails.department?.trim()) {
      newErrors.jobTitle = "Department is required";
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
              "location",
              "dateOfBirth",
              "personalEmail",
              "phoneNumber",
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

            <div>
              <p className="detail-label">Blood Group</p>
              <select
                value={editedEmployee.personalDetails?.bloodGroup || ""}
                onChange={(e) =>
                  handleChange("personalDetails", "bloodGroup", e.target.value)
                }
              >
                <option value="">Select Blood Group</option>
                <option value="A-">A-</option>
                <option value="A+">A+</option>
                <option value="B-">B-</option>
                <option value="B+">B+</option>
                <option value="AB-">AB-</option>
                <option value="AB+">AB+</option>
                <option value="O-">O-</option>
                <option value="O+">O+</option>
              </select>
              {errors.bloodGroup && (
                <p className="error">{errors.bloodGroup}</p>
              )}
            </div>

            <div>
              <p className="detail-label">Gender</p>
              <select
                value={editedEmployee.personalDetails?.gender || ""}
                onChange={(e) =>
                  handleChange("personalDetails", "gender", e.target.value)
                }
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
              {errors.gender && <p className="error">{errors.gender}</p>}
            </div>

            <div>
              <p className="detail-label">Marital Status</p>
              <select
                value={editedEmployee.personalDetails?.maritalStatus || ""}
                onChange={(e) =>
                  handleChange(
                    "personalDetails",
                    "maritalStatus",
                    e.target.value
                  )
                }
              >
                <option value="">Select Status</option>
                <option value="MARRIED">MARRIED</option>
                <option value="SINGLE">SINGLE</option>
                <option value="DIVORCED">DIVORCED</option>
                <option value="WIDOWED">WIDOWED</option>
              </select>
              {errors.maritalStatus && (
                <p className="error">{errors.maritalStatus}</p>
              )}
            </div>
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
              "department",
              "location",
              "officeEmail",
              "dateOfJoining",
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
                  onChange={(e) => {
                    let value = e.target.value;
                    if (key === "jobTitle") {
                      value = value.replace(/[^a-zA-Z\s]/g, ""); // Allow only letters & spaces
                    } else if (
                      ["uanNumber", "pfNumber", "esicNumber"].includes(key)
                    ) {
                      value = value.replace(/\D/g, ""); // Allow only numbers
                    }
                    handleChange("employmentDetails", key, value);
                  }}
                />
                {errors[key] && <p className="error">{errors[key]}</p>}
              </div>
            ))}

            <div>
              <p className="detail-label">Employment Type</p>
              <select
                value={editedEmployee.employmentDetails?.employmentType || ""}
                onChange={(e) =>
                  handleChange(
                    "employmentDetails",
                    "employmentType",
                    e.target.value
                  )
                }
              >
                <option value="">Select employment type</option>
                <option value="FULL_TIME">FULL TIME</option>
                <option value="PART_TIME">PART TIME</option>
                <option value="CONTRACT">CONTRACT</option>
                <option value="INTERN">INTERN</option>
              </select>
              {errors.employmentType && (
                <p className="error">{errors.employmentType}</p>
              )}
            </div>

            <div>
              <p className="detail-label">Status</p>
              <select
                value={editedEmployee.employmentDetails?.status || ""}
                onChange={(e) =>
                  handleChange("employmentDetails", "status", e.target.value)
                }
              >
                <option value="">Select Status</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="DEACTIVATED">DEACTIVATED</option>
                {/* <option value="CONTRACT">CONTRACT</option>
                <option value="INTERN">INTERN</option> */}
              </select>
              {errors.employmentType && (
                <p className="error">{errors.employmentType}</p>
              )}
            </div>

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
            {/* Account Holder (Only Letters) */}
            <div>
              <p className="detail-label">Account Holder</p>
              <input
                type="text"
                value={editedEmployee.bankDetails?.accountHolder || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // Allow only letters & spaces
                  handleChange("bankDetails", "accountHolder", value);
                }}
              />
              {errors.accountHolder && (
                <p className="error">{errors.accountHolder}</p>
              )}
            </div>

            {/* Bank Name (Only Letters) */}
            <div>
              <p className="detail-label">Bank Name</p>
              <input
                type="text"
                value={editedEmployee.bankDetails?.bankName || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // Allow only letters & spaces
                  handleChange("bankDetails", "bankName", value);
                }}
              />
              {errors.bankName && <p className="error">{errors.bankName}</p>}
            </div>

            {/* Account Number (Only Numbers) */}
            <div>
              <p className="detail-label">Account Number</p>
              <input
                type="number"
                value={editedEmployee.bankDetails?.accountNumber || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); // Allow only numbers
                  handleChange("bankDetails", "accountNumber", value);
                }}
              />
              {errors.accountNumber && (
                <p className="error">{errors.accountNumber}</p>
              )}
            </div>

            {/* IFSC Code (Alphanumeric) */}
            <div>
              <p className="detail-label">IFSC Code</p>
              <input
                type="text"
                value={editedEmployee.bankDetails?.ifscCode || ""}
                onChange={(e) =>
                  handleChange(
                    "bankDetails",
                    "ifscCode",
                    e.target.value.toUpperCase()
                  )
                }
              />
              {errors.ifscCode && <p className="error">{errors.ifscCode}</p>}
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSaveClick}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeModal;


