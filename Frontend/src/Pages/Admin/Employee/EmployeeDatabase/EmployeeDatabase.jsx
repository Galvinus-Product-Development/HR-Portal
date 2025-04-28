import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Search,
  Download,
  Upload,
  Plus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Trash2,
  FileUp,
  UserPlus,
  FileDown,
} from "lucide-react";
import "./EmployeeDatabase.css";
import Papa from "papaparse";

const API_BASE_URL_ED = import.meta.env.VITE_API_BASE_URL_ED;
console.log("Ed base url:-", API_BASE_URL_ED);
const EmployeeDatabase = () => {
  const [profilePic, setProfilePic] = useState(
    localStorage.getItem("profileImage") ||
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  );
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    department: "",
    location: "",
    status: "",
  });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Import functionality states
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [columnMappings, setColumnMappings] = useState({});
  const [availableColumns, setAvailableColumns] = useState([]);
  const [importError, setImportError] = useState(null);
  const [importSuccess, setImportSuccess] = useState(false);

  // Add employee modal state
  const [showAddModal, setShowAddModal] = useState(false);

  // Add this state to your component
  const [activeTab, setActiveTab] = useState(0);

  // In your component state initialization:
  const [newEmployee, setNewEmployee] = useState({
    personalDetails: {
      name: "",
      gender: "",
      phoneNumber: "",
      dateOfBirth: "",
      bloodGroup: "",
      personalEmail: "",
      maritalStatus: "",
      aadharNumber: "",
      panNumber: "",
    },
    employmentDetails: {
      employeeId: "",
      officeEmail: "",
      department: "",
      jobTitle: "",
      location: "",
      status: "ACTIVE",
      dateOfJoining: new Date().toISOString(),
      lineManager: "",
      lineManagerId: "",
      employmentType: "",
      uanNumber: "",
      pfNumber: "",
      esicNumber: "",
    },
    bankDetails: {
      accountHolder: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
    },
    emergencyContact: {
      phoneNumber: "",
    },
    currentAddress: {
      street: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
    },
    permanentAddress: {
      street: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
    },
  });
  const [errors, setErrors] = useState({
    personalDetails: {},
    employmentDetails: {},
    emergencyContact: {},
    bankDetails: {},
  });

  // Updated input change handler for nested objects
  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;

  //   // Handle nested properties (e.g., "personalDetails.name")
  //   if (name.includes(".")) {
  //     const [section, field] = name.split(".");
  //     setNewEmployee((prev) => ({
  //       ...prev,
  //       [section]: {
  //         ...prev[section],
  //         [field]: value,
  //       },
  //     }));
  //   } else {
  //     // Handle top-level properties
  //     setNewEmployee((prev) => ({
  //       ...prev,
  //       [name]: value,
  //     }));
  //   }
  // };

  // const handleAddEmployeeSubmit = (e) => {
  //   e.preventDefault();

  //   // Check if required fields are filled and valid
  //   const requiredFieldsValid =
  //     newEmployee.personalDetails?.name &&
  //     newEmployee.employmentDetails?.officeEmail &&
  //     validateEmail(newEmployee.employmentDetails?.officeEmail);

  //   // Check if there are any validation errors
  //   const hasValidationErrors = Object.values(errors).some(
  //     section => Object.keys(section).length > 0
  //   );

  //   if (!requiredFieldsValid || hasValidationErrors) {
  //     // Handle validation failure
  //     alert("Please correct all errors before submitting");
  //     return;
  //   }

  //   // Continue with your existing form submission logic
  //   // ...

  //   // Close the modal after successful submission
  //   setShowAddModal(false);
  // };

  // Updated submit function
  const handleAddEmployeeSubmit = async (e) => {
    e.preventDefault();

    // Check if required fields are filled and valid
    const requiredFieldsValid =
      newEmployee.personalDetails?.name &&
      newEmployee.employmentDetails?.officeEmail &&
      validateEmail(newEmployee.employmentDetails?.officeEmail);

    // Check if there are any validation errors
    const hasValidationErrors = Object.values(errors).some(
      (section) => Object.keys(section).length > 0
    );

    if (!requiredFieldsValid || hasValidationErrors) {
      // Handle validation failure
      alert("Please correct all errors before submitting");
      return;
    }

    // // Basic validation
    // if (
    //   !newEmployee.personalDetails?.name ||
    //   !newEmployee.employmentDetails?.officeEmail
    //   // !newEmployee.employmentDetails?.lineManager
    // ) {
    //   alert("Name and  Official Email are required fields");
    //   return;
    // }

    // Process department if "Add New" was selected
    let finalDepartment = newEmployee.employmentDetails.department;
    if (newEmployee.employmentDetails.department === "new" && newDepartment) {
      finalDepartment = newDepartment;
    }

    // Process location if "Add New" was selected
    let finalLocation = newEmployee.employmentDetails.location;
    if (newEmployee.employmentDetails.location === "new" && newLocation) {
      finalLocation = newLocation;
    }

    // Create final employee object
    const employeeToSubmit = {
      ...newEmployee,
      employmentDetails: {
        ...newEmployee.employmentDetails,
        department: finalDepartment,
        location: finalLocation,
      },
    };

    try {
      const response = await fetch(
        `${API_BASE_URL_ED}/api/employeeRoutes/add`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify(employeeToSubmit),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add employee");
      }

      await fetchEmployees();
      setShowAddModal(false);
    } catch (error) {
      alert(`Error adding employee: ${error.message}`);
    }
  };

  const [newDepartment, setNewDepartment] = useState("");
  const [newLocation, setNewLocation] = useState("");

  // Add this state near your other import-related states
  const [importRowLimit, setImportRowLimit] = useState("");

  const generateDeviceId = () => {
    const deviceId = `device-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("deviceId", deviceId);
    return deviceId;
  };

  const getHeaders = () => {
    const deviceId = localStorage.getItem("deviceId") || generateDeviceId();
    const userAgent = navigator.userAgent;
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
      "x-refresh-token": localStorage.getItem("refreshToken") || "",
      "x-device-id": deviceId,
      "user-agent": userAgent,
    };
  };

  const fetchEmployees = async () => {
    try {
      console.log("Here....");
      const response = await fetch(
        `${API_BASE_URL_ED}/api/employeeRoutes/formatted`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );
      if (!response.ok) throw new Error("Failed to fetch employees");
      const data = await response.json();
      console.log("Employee database data:-------!!!^^^^^^", data.data);
      setEmployees(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const departments = Array.from(
    new Set(employees.map((emp) => emp.department))
  ).filter(Boolean);

  const locations = Array.from(
    new Set(employees.map((emp) => emp.location))
  ).filter(Boolean);

  const statuses = ["ACTIVE", "PENDING", "DEACTIVATED"];

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilters =
      (!filters.department || employee.department === filters.department) &&
      (!filters.location || employee.location === filters.location) &&
      (!filters.status || employee.status === filters.status);

    return matchesSearch && matchesFilters;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 5;

  // Compute the index range for the current page
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const paginatedEmployees = filteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );

  // Handle pagination navigation
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "status-active";
      case "On Leave":
        return "status-on-leave";
      case "Inactive":
        return "status-inactive";
      default:
        return "status-default";
    }
  };

  const handleExportCSV = () => {
    if (employees.length === 0) {
      alert("No employees to export.");
      return;
    }

    // Define CSV headers
    const csvHeaders = [
      // Personal & Basic Info
      "Employee ID", // employmentDetails.employeeId
      "Gender", // personalDetails.gender
      "Name", // personalDetails.name
      "Email", // employmentDetails.officeEmail
      "Phone", // personalDetails.phoneNumber
      "Department", // employmentDetails.department
      "Designation", // employmentDetails.jobTitle
      "Location", // employmentDetails.location
      "Status", // employmentDetails.status
      "Join Date", // employmentDetails.dateOfJoining
      "Line Manager", // employmentDetails.lineManager
      "Date Of Birth", // personalDetails.dateOfBirth
      "Blood Group", // personalDetails.bloodGroup
      "Personal Email", // personalDetails.personalEmail
      "Marital Status", // personalDetails.maritalStatus
      "Aadhar Number", // personalDetails.aadharNumber
      "Pan Number", // personalDetails.panNumber
      "Emergency Phone Number", // emergencyContact.phoneNumber

      // Current Address
      "Current Address", // currentAddress.street
      "Current City", // currentAddress.city
      "Current State", // currentAddress.state
      "Current Country", // currentAddress.country
      "Current Zip", // currentAddress.zipCode

      // Permanent Address
      "Permanent Address", // permanentAddress.street
      "Permanent City", // permanentAddress.city
      "Permanent State", // permanentAddress.state
      "Permanent Country", // permanentAddress.country
      "Permanent Zip", // permanentAddress.zipCode

      // Employment Extras
      "Employment Type", // employmentDetails.employmentType
      "UAN Number", // employmentDetails.uanNumber
      "PF Number", // employmentDetails.pfNumber
      "ESIC Number", // employmentDetails.esicNumber

      // Bank Details
      "Account Holder's Name", // bankDetails.accountHolder
      "Bank Name", // bankDetails.bankName
      "Account Number", // bankDetails.accountNumber
      "IFSC Code", // bankDetails.ifscCode
    ];

    // Convert employee data into CSV format
    const csvData = employees.map((emp) => ({
      "Employee ID": emp.id,
      Name: emp.name,
      Email: emp.email,
      Phone: emp.phone,
      Department: emp.department,
      Designation: emp.designation,
      Location: emp.location,
      Status: emp.status,
      "Join Date": new Date(emp.joinDate).toLocaleDateString(),
      "Line Manager": emp.lineManager || "",
    }));

    // Convert to CSV format
    const csv = Papa.unparse({ fields: csvHeaders, data: csvData });

    // Create a Blob and trigger download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "employee_database.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${API_BASE_URL_ED}/api/employeeRoutes/${id}`,
        {
          method: "DELETE",
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete employee");
      }

      // Refresh employee data after update
      await fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee", error.message);
    }
  };

  const handleApproval = async (status, id) => {
    try {
      const response = await fetch(
        `${API_BASE_URL_ED}/api/employeeRoutes/approval-status/${id}`,
        {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify({ approvalStatus: status }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update approval status");
      }

      // Refresh employee data after update
      await fetchEmployees();
    } catch (error) {
      console.error("Error updating approval status:", error.message);
    }
  };

  // Import functions
  const handleImportClick = () => {
    setShowImportModal(true);
    setImportFile(null);
    setColumnMappings({});
    setAvailableColumns([]);
    setImportError(null);
    setImportSuccess(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImportFile(file);

      Papa.parse(file, {
        header: true,
        preview: 1,
        complete: (results) => {
          if (results.meta && results.meta.fields) {
            const csvColumns = results.meta.fields;
            setAvailableColumns(csvColumns);
            console.log("This is csv cols:-------", csvColumns);
            const dbKeys = [
              "name",
              "officialEmail", //change
              "employeeId",
              "phone",
              "department",
              "designation",
              "location",
              "status",
              "joinDate",
              "lineManagerId", //change
              "dateOfBirth",
              "bloodGroup",
              "personalEmail",
              "maritalStatus",
              "aadharNumber",
              "panNumber",
              "emergencyPhoneNumber",
              "currentAddress.street",
              "currentAddress.city",
              "currentAddress.state",
              "currentAddress.country",
              "currentAddress.zipCode",
              "permanentAddress.street",
              "permanentAddress.city",
              "permanentAddress.state",
              "permanentAddress.country",
              "permanentAddress.zipCode",
              "employmentDetails.employmentType",
              "employmentDetails.uanNumber",
              "employmentDetails.pfNumber",
              "employmentDetails.esicNumber",
              "bankDetails.accountHolder",
              "bankDetails.bankName",
              "bankDetails.accountNumber",
              "bankDetails.ifscCode",
            ];

            // Normalize function for better matching
            const normalize = (str) =>
              str.toLowerCase().replace(/\s|_|-|\./g, "");

            const initialMappings = {};

            dbKeys.forEach((key) => {
              const keyNorm = normalize(key);
              console.log(".................", keyNorm);
              const matchedColumn = csvColumns.find((col) => {
                console.log(
                  "Normalize Coloumn :-",
                  normalize(col),
                  "includes :-",
                  keyNorm
                );
                return normalize(col).includes(keyNorm);
              });
              if (matchedColumn) {
                initialMappings[key] = matchedColumn;
              }
            });

            setColumnMappings(initialMappings);
          }
        },
        error: (error) => {
          setImportError(`Error reading file: ${error.message}`);
        },
      });
    }
  };

  const handleColumnMappingChange = (dbField, excelColumn) => {
    setColumnMappings((prev) => ({
      ...prev,
      [dbField]: excelColumn,
    }));
  };

  const validateImport = (data) => {
    // Check required fields
    const requiredFields = ["name", "officialEmail"];
    const missingFields = [];

    requiredFields.forEach((field) => {
      if (!columnMappings[field]) {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      return {
        valid: false,
        error: `Required column mappings missing: ${missingFields.join(", ")}`,
      };
    }

    // Validate data rows
    const invalidRows = [];
    data.forEach((row, index) => {
      const rowNum = index + 2; // Account for header row and 0-based index

      const hasName = row[columnMappings.name]?.trim();
      const hasEmail = row[columnMappings.officialEmail]?.trim();
      // const hasLineManager = row[columnMappings.lineManagerId]?.trim();

      if (!hasName || !hasEmail) {
        invalidRows.push(rowNum);
      }
    });

    if (invalidRows.length > 0) {
      return {
        valid: false,
        error: `Rows with missing required data: ${invalidRows.join(", ")}`,
      };
    }

    return { valid: true };
  };

  const processImportData = (data) => {
    return data.map((row) => {
      const getValue = (key) =>
        columnMappings[key] ? row[columnMappings[key]]?.trim?.() || "" : "";

      return {
        personalDetails: {
          name: getValue("name"),
          gender: getValue("gender"),
          phoneNumber: getValue("phone"),
          dateOfBirth: getValue("dateOfBirth"),
          bloodGroup: getValue("bloodGroup"),
          personalEmail: getValue("personalEmail"),
          maritalStatus: getValue("maritalStatus"),
          aadharNumber: getValue("aadharNumber"),
          panNumber: getValue("panNumber"),
        },
        employmentDetails: {
          // employeeId: getValue("employeeId"),
          companyEmployeeId: getValue("employeeId"),
          officeEmail: getValue("officialEmail"),
          department: getValue("department"),
          jobTitle: getValue("designation"),
          location: getValue("location"),
          status: getValue("status") || "ACTIVE",
          dateOfJoining: getValue("joinDate")
            ? new Date(getValue("joinDate")).toISOString()
            : new Date().toISOString(),
          lineManagerId: getValue("lineManagerId"),
          employmentType: getValue("employmentDetails.employmentType"),
          uanNumber: getValue("employmentDetails.uanNumber"),
          pfNumber: getValue("employmentDetails.pfNumber"),
          esicNumber: getValue("employmentDetails.esicNumber"),
        },
        bankDetails: {
          accountHolder: getValue("bankDetails.accountHolder"),
          bankName: getValue("bankDetails.bankName"),
          accountNumber: getValue("bankDetails.accountNumber"),
          ifscCode: getValue("bankDetails.ifscCode"),
        },
        emergencyContact: {
          phoneNumber: getValue("emergencyPhoneNumber"),
        },
        currentAddress: {
          street: getValue("currentAddress.street"),
          city: getValue("currentAddress.city"),
          state: getValue("currentAddress.state"),
          country: getValue("currentAddress.country"),
          zipCode: getValue("currentAddress.zipCode"),
        },
        permanentAddress: {
          street: getValue("permanentAddress.street"),
          city: getValue("permanentAddress.city"),
          state: getValue("permanentAddress.state"),
          country: getValue("permanentAddress.country"),
          zipCode: getValue("permanentAddress.zipCode"),
        },
      };
    });
  };

  const handleImportSubmit = async () => {
    setImportError(null);

    if (!importFile) {
      setImportError("Please select a file to import");
      return;
    }

    Papa.parse(importFile, {
      header: true,
      complete: async (results) => {
        // Apply row limit if specified
        console.log("this is results data:-", results.data);
        const rowLimit = importRowLimit ? parseInt(importRowLimit) : null;
        const dataToProcess = rowLimit
          ? results.data.slice(0, rowLimit)
          : results.data;

        const validation = validateImport(dataToProcess);

        if (!validation.valid) {
          setImportError(validation.error);
          return;
        }

        const processedData = processImportData(dataToProcess);
        console.log("This is processedData:------------", processedData);
        try {
          const response = await fetch(
            `${API_BASE_URL_ED}/api/employeeRoutes/bulk-import`,
            {
              method: "POST",
              headers: getHeaders(),
              body: JSON.stringify({ employees: processedData }),
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to import employees");
          }

          setImportSuccess(true);
          await fetchEmployees();
          setTimeout(() => {
            setShowImportModal(false);
          }, 2000);
        } catch (error) {
          setImportError(error.message);
        }
      },
      error: (error) => {
        setImportError(`Error parsing file: ${error.message}`);
      },
    });
  };

  // Add employee functions
  const handleAddEmployeeClick = () => {
    setShowAddModal(true);
    setNewEmployee({
      name: "",
      email: "",
      phone: "",
      department: "",
      designation: "",
      location: "",
      status: "ACTIVE",
      joinDate: new Date().toISOString().split("T")[0],
      lineManager: "",
    });
    setNewDepartment("");
    setNewLocation("");
  };

  if (loading) return <p>Loading employees...</p>;
  if (error) return <p>Error: {error}</p>;

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateAadharNumber = (aadhar) => {
    const aadharRegex = /^\d{12}$/;
    return aadharRegex.test(aadhar);
  };

  const validatePanNumber = (pan) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };

  const validateUANNumber = (uan) => {
    const uanRegex = /^\d{12}$/;
    return uanRegex.test(uan);
  };

  const validatePFNumber = (pf) => {
    const pfRegex = /^\d{12}$/;
    return pfRegex.test(pf);
  };

  const validateESICNumber = (esic) => {
    const esicRegex = /^\d{12}$/;
    return esicRegex.test(esic);
  };

  const validateAccountNumber = (account) => {
    const accountRegex = /^\d{9,18}$/;
    return accountRegex.test(account);
  };

  const validateIFSCCode = (ifsc) => {
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return ifscRegex.test(ifsc);
  };

  const validateNameField = (name) => {
    // Name fields should not contain numbers
    const nameRegex = /^[^0-9]+$/;
    return nameRegex.test(name);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const nameParts = name.split(".");
    const section = nameParts[0];
    const field = nameParts[1];

    // Create a new validation errors object
    const newErrors = { ...errors };

    // Validate based on field
    if (name === "personalDetails.phoneNumber") {
      if (value && !validatePhoneNumber(value)) {
        newErrors.personalDetails.phoneNumber =
          "Phone number must be 10 digits";
      } else {
        delete newErrors.personalDetails.phoneNumber;
      }
    } else if (name === "personalDetails.personalEmail") {
      if (value && !validateEmail(value)) {
        newErrors.personalDetails.personalEmail = "Invalid email format";
      } else {
        delete newErrors.personalDetails.personalEmail;
      }
    } else if (name === "emergencyContact.phoneNumber") {
      if (value && !validatePhoneNumber(value)) {
        newErrors.emergencyContact.phoneNumber =
          "Emergency contact must be 10 digits";
      } else {
        delete newErrors.emergencyContact.phoneNumber;
      }
    } else if (name === "personalDetails.aadharNumber") {
      if (value && !validateAadharNumber(value)) {
        newErrors.personalDetails.aadharNumber =
          "Aadhar number must be 12 digits";
      } else {
        delete newErrors.personalDetails.aadharNumber;
      }
    } else if (name === "personalDetails.panNumber") {
      if (value && !validatePanNumber(value)) {
        newErrors.personalDetails.panNumber =
          "Invalid PAN format (e.g., ABCDE1234F)";
      } else {
        delete newErrors.personalDetails.panNumber;
      }
    } else if (name === "employmentDetails.officeEmail") {
      if (!value || !validateEmail(value)) {
        newErrors.employmentDetails.officeEmail =
          "Valid office email is required";
      } else {
        delete newErrors.employmentDetails.officeEmail;
      }
    } else if (name === "employmentDetails.uanNumber") {
      if (value && !validateUANNumber(value)) {
        newErrors.employmentDetails.uanNumber = "UAN number must be 12 digits";
      } else {
        delete newErrors.employmentDetails.uanNumber;
      }
    } else if (name === "employmentDetails.pfNumber") {
      if (value && !validatePFNumber(value)) {
        newErrors.employmentDetails.pfNumber = "PF number must be 12 digits";
      } else {
        delete newErrors.employmentDetails.pfNumber;
      }
    } else if (name === "employmentDetails.esicNumber") {
      if (value && !validateESICNumber(value)) {
        newErrors.employmentDetails.esicNumber =
          "ESIC number must be 12 digits";
      } else {
        delete newErrors.employmentDetails.esicNumber;
      }
    } else if (name === "bankDetails.accountNumber") {
      if (value && !validateAccountNumber(value)) {
        newErrors.bankDetails.accountNumber =
          "Account number must be 9-18 digits";
      } else {
        delete newErrors.bankDetails.accountNumber;
      }
    } else if (name === "bankDetails.ifscCode") {
      if (value && !validateIFSCCode(value)) {
        newErrors.bankDetails.ifscCode = "Invalid IFSC code format";
      } else {
        delete newErrors.bankDetails.ifscCode;
      }
    } else if (
      name === "personalDetails.name" ||
      name === "employmentDetails.jobTitle" ||
      name === "bankDetails.accountHolder" ||
      name === "bankDetails.bankName"
    ) {
      if (value && !validateNameField(value)) {
        newErrors[section][field] = "Should not contain numbers";
      } else {
        delete newErrors[section][field];
      }
    }

    // Update the error state
    setErrors(newErrors);

    // Update the employee data
    setNewEmployee((prevState) => {
      const newState = { ...prevState };
      if (!newState[section]) {
        newState[section] = {};
      }
      newState[section][field] = value;
      return newState;
    });
  };

  return (
    <div className="employee-db-container">
      <div className="employee-db-header">
        <div className="employee-db-title">
          <Users className="employee-db-icon" />
          <h1>Employee Database</h1>
        </div>
        <div className="employee-db-buttons">
          <button className="employee-db-btn" onClick={handleAddEmployeeClick}>
            <UserPlus className="employee-db-btn-icon" /> Add Employee
          </button>
          <button className="employee-db-btn" onClick={handleImportClick}>
            <FileDown className="employee-db-btn-icon" />
            Import
          </button>
          <button className="employee-db-btn" onClick={handleExportCSV}>
            <Upload className="employee-db-btn-icon" /> Export
          </button>
        </div>
      </div>

      <div className="employee-db-filters">
        <div className="employee-db-search-container">
          <Search className="employee-db-search-icon" />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="employee-db-search"
          />
        </div>
        <select
          value={filters.department}
          onChange={(e) =>
            setFilters({ ...filters, department: e.target.value })
          }
          className="employee-db-select"
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
        <select
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          className="employee-db-select"
        >
          <option value="">All Locations</option>
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="employee-db-select"
        >
          <option value="">All Statuses</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="employee-db-table-container">
        <table className="employee-db-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Contact</th>
              <th>Department</th>
              <th>Location</th>
              <th>Status</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEmployees.map((employee) => (
              <tr key={employee.id} className="employee-db-row">
                <td onClick={() => navigate(`/admin/employees/${employee.id}`)}>
                  <div className="employee-db-profile">
                    <img
                      className="employee-db-avatar"
                      src={profilePic}
                      alt={employee.name}
                    />
                    <div>
                      <div className="employee-db-name">{employee.name}</div>
                      <div className="employee-db-id">
                        {employee?.companyEmployeeId}
                      </div>
                    </div>
                  </div>
                </td>
                <td onClick={() => navigate(`/admin/employees/${employee.id}`)}>
                  <div className="employee-db-contact">
                    <Mail className="employee-db-contact-icon" />{" "}
                    {employee.email}
                  </div>
                  <div className="employee-db-contact">
                    <Phone className="employee-db-contact-icon" />{" "}
                    {employee.phone}
                  </div>
                </td>
                <td onClick={() => navigate(`/admin/employees/${employee.id}`)}>
                  <div>{employee.department}</div>
                  <div className="employee-db-designation">
                    {employee.designation}
                  </div>
                </td>
                <td onClick={() => navigate(`/admin/employees/${employee.id}`)}>
                  <div className="employee-db-location">
                    <MapPin className="employee-db-contact-icon" />{" "}
                    {employee.location}
                  </div>
                </td>
                <td onClick={() => navigate(`/admin/employees/${employee.id}`)}>
                  <span
                    className={`employee-db-status ${getStatusColor(
                      employee.status
                    )}`}
                  >
                    {employee.status}
                  </span>
                </td>
                <td onClick={() => navigate(`/admin/employees/${employee.id}`)}>
                  <div className="employee-db-join-date">
                    <Calendar className="employee-db-contact-icon" />{" "}
                    {new Date(employee.joinDate).toLocaleDateString()}
                  </div>
                </td>
                <td>
                  <button
                    className="employee-db-delete-btn"
                    onClick={() => {
                      if (
                        window.confirm(
                          `Are you sure you want to delete ${employee.name}?`
                        )
                      ) {
                        handleDelete(employee.id);
                      }
                    }}
                  >
                    <Trash2 className="employee-db-delete-icon" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination-controls">
        <button onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>

        {/* Render page numbers dynamically */}
        {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
          let pageNumber = Math.max(1, currentPage - 2) + index;
          if (pageNumber > totalPages) return null;

          return (
            <button
              key={pageNumber}
              onClick={() => setCurrentPage(pageNumber)}
              className={currentPage === pageNumber ? "active-page" : ""}
            >
              {pageNumber}
            </button>
          );
        })}

        <button onClick={nextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Import Employees</h2>

            <div className="modal-body">
              {!importFile ? (
                <div className="file-upload-container">
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    id="file-upload"
                    className="file-upload-input"
                  />
                  <label htmlFor="file-upload" className="file-upload-label">
                    <FileUp className="upload-icon" />
                    <span>Choose Excel or CSV file</span>
                  </label>
                </div>
              ) : (
                <>
                  <div className="selected-file">
                    <p>Selected file: {importFile.name}</p>
                    <button onClick={() => setImportFile(null)}>Change</button>
                  </div>

                  <div className="row-limit-container">
                    <label htmlFor="row-limit">Number of rows to import:</label>
                    <input
                      type="number"
                      id="row-limit"
                      min="1"
                      placeholder="All rows"
                      value={importRowLimit}
                      onChange={(e) => setImportRowLimit(e.target.value)}
                      className="row-limit-input"
                    />
                    <p className="row-limit-help">
                      Leave empty to import all rows
                    </p>
                  </div>

                  <div className="column-mapping-container">
                    <h3>Map Excel Columns to Database Fields</h3>
                    <p className="required-note">* Required fields</p>

                    <div className="mapping-row">
                      <label>Name*:</label>
                      <select
                        value={columnMappings.name || ""}
                        onChange={(e) =>
                          handleColumnMappingChange("name", e.target.value)
                        }
                        className={!columnMappings.name ? "required-field" : ""}
                      >
                        <option value="">Select column</option>
                        {availableColumns.map((col) => (
                          <option key={col} value={col}>
                            {col}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mapping-row">
                      <label>Official Email*:</label>
                      <select
                        value={columnMappings.officialEmail || ""}
                        onChange={(e) =>
                          handleColumnMappingChange(
                            "officialEmail",
                            e.target.value
                          )
                        }
                        className={
                          !columnMappings.officialEmail ? "required-field" : ""
                        }
                      >
                        <option value="">Select column</option>
                        {availableColumns.map((col) => (
                          <option key={col} value={col}>
                            {col}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mapping-row">
                      <label>Employee Id</label>
                      <select
                        value={columnMappings.employeeId || ""}
                        onChange={(e) =>
                          handleColumnMappingChange(
                            "employeeId",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select column</option>
                        {availableColumns.map((col) => (
                          <option key={col} value={col}>
                            {col}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mapping-row">
                      <label>Line Manager Id:</label>
                      <select
                        value={columnMappings.lineManagerId || ""}
                        onChange={(e) =>
                          handleColumnMappingChange(
                            "lineManagerId",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select column</option>
                        {availableColumns.map((col) => (
                          <option key={col} value={col}>
                            {col}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mapping-row">
                      <label>Phone:</label>
                      <select
                        value={columnMappings.phone || ""}
                        onChange={(e) =>
                          handleColumnMappingChange("phone", e.target.value)
                        }
                      >
                        <option value="">Select column</option>
                        {availableColumns.map((col) => (
                          <option key={col} value={col}>
                            {col}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mapping-row">
                      <label>Department:</label>
                      <select
                        value={columnMappings.department || ""}
                        onChange={(e) =>
                          handleColumnMappingChange(
                            "department",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select column</option>
                        {availableColumns.map((col) => (
                          <option key={col} value={col}>
                            {col}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mapping-row">
                      <label>Designation:</label>
                      <select
                        value={columnMappings.designation || ""}
                        onChange={(e) =>
                          handleColumnMappingChange(
                            "designation",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select column</option>
                        {availableColumns.map((col) => (
                          <option key={col} value={col}>
                            {col}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mapping-row">
                      <label>Location:</label>
                      <select
                        value={columnMappings.location || ""}
                        onChange={(e) =>
                          handleColumnMappingChange("location", e.target.value)
                        }
                      >
                        <option value="">Select column</option>
                        {availableColumns.map((col) => (
                          <option key={col} value={col}>
                            {col}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mapping-row">
                      <label>Status:</label>
                      <select
                        value={columnMappings.status || ""}
                        onChange={(e) =>
                          handleColumnMappingChange("status", e.target.value)
                        }
                      >
                        <option value="">Select column</option>
                        {availableColumns.map((col) => (
                          <option key={col} value={col}>
                            {col}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mapping-row">
                      <label>Join Date:</label>
                      <select
                        value={columnMappings.joinDate || ""}
                        onChange={(e) =>
                          handleColumnMappingChange("joinDate", e.target.value)
                        }
                      >
                        <option value="">Select column</option>
                        {availableColumns.map((col) => (
                          <option key={col} value={col}>
                            {col}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Additional Mapping Fields */}

                    <div className="mapping-row">
                      <label>Date of Birth:</label>
                      <select
                        value={columnMappings.dateOfBirth || ""}
                        onChange={(e) =>
                          handleColumnMappingChange(
                            "dateOfBirth",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select column</option>
                        {availableColumns.map((col) => (
                          <option key={col} value={col}>
                            {col}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mapping-row">
                      <label>Blood Group:</label>
                      <select
                        value={columnMappings.bloodGroup || ""}
                        onChange={(e) =>
                          handleColumnMappingChange(
                            "bloodGroup",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select column</option>
                        {availableColumns.map((col) => (
                          <option key={col} value={col}>
                            {col}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mapping-row">
                      <label>Personal Email:</label>
                      <select
                        value={columnMappings.personalEmail || ""}
                        onChange={(e) =>
                          handleColumnMappingChange(
                            "personalEmail",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select column</option>
                        {availableColumns.map((col) => (
                          <option key={col} value={col}>
                            {col}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mapping-row">
                      <label>Marital Status:</label>
                      <select
                        value={columnMappings.maritalStatus || ""}
                        onChange={(e) =>
                          handleColumnMappingChange(
                            "maritalStatus",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select column</option>
                        {availableColumns.map((col) => (
                          <option key={col} value={col}>
                            {col}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mapping-row">
                      <label>Aadhar Number:</label>
                      <select
                        value={columnMappings.aadharNumber || ""}
                        onChange={(e) =>
                          handleColumnMappingChange(
                            "aadharNumber",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select column</option>
                        {availableColumns.map((col) => (
                          <option key={col} value={col}>
                            {col}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mapping-row">
                      <label>Pan Number:</label>
                      <select
                        value={columnMappings.panNumber || ""}
                        onChange={(e) =>
                          handleColumnMappingChange("panNumber", e.target.value)
                        }
                      >
                        <option value="">Select column</option>
                        {availableColumns.map((col) => (
                          <option key={col} value={col}>
                            {col}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mapping-row">
                      <label>Emergency Phone Number:</label>
                      <select
                        value={columnMappings.emergencyPhoneNumber || ""}
                        onChange={(e) =>
                          handleColumnMappingChange(
                            "emergencyPhoneNumber",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select column</option>
                        {availableColumns.map((col) => (
                          <option key={col} value={col}>
                            {col}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Current Address */}
                    {["street", "city", "state", "country", "zipCode"].map(
                      (field) => (
                        <div
                          className="mapping-row"
                          key={`currentAddress.${field}`}
                        >
                          <label>{`Current ${
                            field.charAt(0).toUpperCase() + field.slice(1)
                          }`}</label>
                          <select
                            value={
                              columnMappings[`currentAddress.${field}`] || ""
                            }
                            onChange={(e) =>
                              handleColumnMappingChange(
                                `currentAddress.${field}`,
                                e.target.value
                              )
                            }
                          >
                            <option value="">Select column</option>
                            {availableColumns.map((col) => (
                              <option key={col} value={col}>
                                {col}
                              </option>
                            ))}
                          </select>
                        </div>
                      )
                    )}

                    {/* Permanent Address */}
                    {["street", "city", "state", "country", "zipCode"].map(
                      (field) => (
                        <div
                          className="mapping-row"
                          key={`permanentAddress.${field}`}
                        >
                          <label>{`Permanent ${
                            field.charAt(0).toUpperCase() + field.slice(1)
                          }`}</label>
                          <select
                            value={
                              columnMappings[`permanentAddress.${field}`] || ""
                            }
                            onChange={(e) =>
                              handleColumnMappingChange(
                                `permanentAddress.${field}`,
                                e.target.value
                              )
                            }
                          >
                            <option value="">Select column</option>
                            {availableColumns.map((col) => (
                              <option key={col} value={col}>
                                {col}
                              </option>
                            ))}
                          </select>
                        </div>
                      )
                    )}

                    {/* Employment Extras */}
                    {[
                      "employmentType",
                      "uanNumber",
                      "pfNumber",
                      "esicNumber",
                    ].map((field) => (
                      <div
                        className="mapping-row"
                        key={`employmentDetails.${field}`}
                      >
                        <label>{field.replace(/([A-Z])/g, " $1")}</label>
                        <select
                          value={
                            columnMappings[`employmentDetails.${field}`] || ""
                          }
                          onChange={(e) =>
                            handleColumnMappingChange(
                              `employmentDetails.${field}`,
                              e.target.value
                            )
                          }
                        >
                          <option value="">Select column</option>
                          {availableColumns.map((col) => (
                            <option key={col} value={col}>
                              {col}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}

                    {/* Bank Details */}
                    {[
                      "accountHolder",
                      "bankName",
                      "accountNumber",
                      "ifscCode",
                    ].map((field) => (
                      <div className="mapping-row" key={`bankDetails.${field}`}>
                        <label>{field.replace(/([A-Z])/g, " $1")}</label>
                        <select
                          value={columnMappings[`bankDetails.${field}`] || ""}
                          onChange={(e) =>
                            handleColumnMappingChange(
                              `bankDetails.${field}`,
                              e.target.value
                            )
                          }
                        >
                          <option value="">Select column</option>
                          {availableColumns.map((col) => (
                            <option key={col} value={col}>
                              {col}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {importError && (
                <div className="import-error">
                  <p>{importError}</p>
                </div>
              )}

              {importSuccess && (
                <div className="import-success">
                  <p>Employees imported successfully!</p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                className="cancel-btn"
                onClick={() => setShowImportModal(false)}
              >
                Cancel
              </button>
              {importFile && (
                <button className="import-btn" onClick={handleImportSubmit}>
                  Import
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content large-modal">
            <h2>Add Employee</h2>

            <div className="modal-body">
              <form onSubmit={handleAddEmployeeSubmit}>
                <div className="form-tabs">
                  {[
                    "Personal Info",
                    "Employment",
                    "Address",
                    "Bank Details",
                  ].map((tab, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`form-tab ${
                        activeTab === index ? "active" : ""
                      }`}
                      onClick={() => setActiveTab(index)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="tab-content">
                  {activeTab === 0 && (
                    <div className="form-section">
                      <h3>Personal Details</h3>

                      <div className="form-row">
                        <div className="form-group half">
                          <label htmlFor="name">
                            Full Name <span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="personalDetails.name"
                            value={newEmployee.personalDetails?.name || ""}
                            onChange={handleInputChange}
                            required
                            className={`form-control ${
                              errors.personalDetails?.name ? "error-input" : ""
                            }`}
                          />
                          {errors.personalDetails?.name && (
                            <div className="error-message">
                              {errors.personalDetails.name}
                            </div>
                          )}
                        </div>

                        <div className="form-group half">
                          <label htmlFor="gender">Gender</label>
                          <select
                            id="gender"
                            name="personalDetails.gender"
                            value={newEmployee.personalDetails?.gender || ""}
                            onChange={handleInputChange}
                            className="form-control"
                          >
                            <option value="">Select Gender</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group half">
                          <label htmlFor="dateOfBirth">Date of Birth</label>
                          <input
                            type="date"
                            id="dateOfBirth"
                            name="personalDetails.dateOfBirth"
                            value={
                              newEmployee.personalDetails?.dateOfBirth || ""
                            }
                            onChange={handleInputChange}
                            className="form-control"
                          />
                        </div>

                        <div className="form-group half">
                          <label htmlFor="bloodGroup">Blood Group</label>
                          <select
                            id="bloodGroup"
                            name="personalDetails.bloodGroup"
                            value={
                              newEmployee.personalDetails?.bloodGroup || ""
                            }
                            onChange={handleInputChange}
                            className="form-control"
                          >
                            <option value="">Select Blood Group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group half">
                          <label htmlFor="phoneNumber">Phone Number</label>
                          <input
                            type="number"
                            id="phoneNumber"
                            name="personalDetails.phoneNumber"
                            value={
                              newEmployee.personalDetails?.phoneNumber || ""
                            }
                            onChange={handleInputChange}
                            className={`form-control ${
                              errors.personalDetails?.phoneNumber
                                ? "error-input"
                                : ""
                            }`}
                          />
                          {errors.personalDetails?.phoneNumber && (
                            <div className="error-message">
                              {errors.personalDetails.phoneNumber}
                            </div>
                          )}
                        </div>

                        <div className="form-group half">
                          <label htmlFor="personalEmail">Personal Email</label>
                          <input
                            type="email"
                            id="personalEmail"
                            name="personalDetails.personalEmail"
                            value={
                              newEmployee.personalDetails?.personalEmail || ""
                            }
                            onChange={handleInputChange}
                            className={`form-control ${
                              errors.personalDetails?.personalEmail
                                ? "error-input"
                                : ""
                            }`}
                          />
                          {errors.personalDetails?.personalEmail && (
                            <div className="error-message">
                              {errors.personalDetails.personalEmail}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group half">
                          <label htmlFor="maritalStatus">Marital Status</label>
                          <select
                            id="maritalStatus"
                            name="personalDetails.maritalStatus"
                            value={
                              newEmployee.personalDetails?.maritalStatus || ""
                            }
                            onChange={handleInputChange}
                            className="form-control"
                          >
                            <option value="">Select Status</option>
                            <option value="SINGLE">Single</option>
                            <option value="MARRIED">Married</option>
                            <option value="DIVORCED">Divorced</option>
                            <option value="WIDOWED">Widowed</option>
                          </select>
                        </div>

                        <div className="form-group half">
                          <label htmlFor="emergencyPhoneNumber">
                            Emergency Contact Number
                          </label>
                          <input
                            type="number"
                            id="emergencyPhoneNumber"
                            name="emergencyContact.phoneNumber"
                            value={
                              newEmployee.emergencyContact?.phoneNumber || ""
                            }
                            onChange={handleInputChange}
                            className={`form-control ${
                              errors.emergencyContact?.phoneNumber
                                ? "error-input"
                                : ""
                            }`}
                          />
                          {errors.emergencyContact?.phoneNumber && (
                            <div className="error-message">
                              {errors.emergencyContact.phoneNumber}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group half">
                          <label htmlFor="aadharNumber">Aadhar Number</label>
                          <input
                            type="number"
                            id="aadharNumber"
                            name="personalDetails.aadharNumber"
                            value={
                              newEmployee.personalDetails?.aadharNumber || ""
                            }
                            onChange={handleInputChange}
                            className={`form-control ${
                              errors.personalDetails?.aadharNumber
                                ? "error-input"
                                : ""
                            }`}
                          />
                          {errors.personalDetails?.aadharNumber && (
                            <div className="error-message">
                              {errors.personalDetails.aadharNumber}
                            </div>
                          )}
                        </div>

                        <div className="form-group half">
                          <label htmlFor="panNumber">PAN Number</label>
                          <input
                            type="text"
                            id="panNumber"
                            name="personalDetails.panNumber"
                            value={newEmployee.personalDetails?.panNumber || ""}
                            onChange={handleInputChange}
                            className={`form-control ${
                              errors.personalDetails?.panNumber
                                ? "error-input"
                                : ""
                            }`}
                          />
                          {errors.personalDetails?.panNumber && (
                            <div className="error-message">
                              {errors.personalDetails.panNumber}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 1 && (
                    <div className="form-section">
                      <h3>Employment Details</h3>

                      <div className="form-row">
                        <div className="form-group half">
                          <label htmlFor="officeEmail">
                            Office Email <span className="required">*</span>
                          </label>
                          <input
                            type="email"
                            id="officeEmail"
                            name="employmentDetails.officeEmail"
                            value={
                              newEmployee.employmentDetails?.officeEmail || ""
                            }
                            onChange={handleInputChange}
                            required
                            className={`form-control ${
                              errors.employmentDetails?.officeEmail
                                ? "error-input"
                                : ""
                            }`}
                          />
                          {errors.employmentDetails?.officeEmail && (
                            <div className="error-message">
                              {errors.employmentDetails.officeEmail}
                            </div>
                          )}
                        </div>
                        <div className="form-group half">
                          <label htmlFor="companyEmployeeId">Employee ID</label>
                          <input
                            type="number"
                            id="companyEmployeeId"
                            name="employmentDetails.companyEmployeeId"
                            value={
                              newEmployee.employmentDetails
                                ?.companyEmployeeId || ""
                            }
                            onChange={handleInputChange}
                            className={`form-control ${
                              errors.employmentDetails?.companyEmployeeId
                                ? "error-input"
                                : ""
                            }`}
                          />
                          {errors.employmentDetails?.companyEmployeeId && (
                            <div className="error-message">
                              {errors.employmentDetails.companyEmployeeId}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group half">
                          <label htmlFor="department">Department</label>
                          <select
                            id="department"
                            name="employmentDetails.department"
                            value={
                              newEmployee.employmentDetails?.department || ""
                            }
                            onChange={handleInputChange}
                            className="form-control"
                          >
                            <option value="">Select Department</option>
                            {departments.map((dept) => (
                              <option key={dept} value={dept}>
                                {dept}
                              </option>
                            ))}
                            <option value="new">+ Add New Department</option>
                          </select>

                          {newEmployee.employmentDetails?.department ===
                            "new" && (
                            <input
                              type="text"
                              placeholder="Enter new department"
                              value={newDepartment}
                              onChange={(e) => setNewDepartment(e.target.value)}
                              className="form-control mt-2"
                            />
                          )}
                        </div>

                        <div className="form-group half">
                          <label htmlFor="jobTitle">Designation</label>
                          <input
                            type="text"
                            id="jobTitle"
                            name="employmentDetails.jobTitle"
                            value={
                              newEmployee.employmentDetails?.jobTitle || ""
                            }
                            onChange={handleInputChange}
                            className={`form-control ${
                              errors.employmentDetails?.jobTitle
                                ? "error-input"
                                : ""
                            }`}
                          />
                          {errors.employmentDetails?.jobTitle && (
                            <div className="error-message">
                              {errors.employmentDetails.jobTitle}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group half">
                          <label htmlFor="location">Location</label>
                          <select
                            id="location"
                            name="employmentDetails.location"
                            value={
                              newEmployee.employmentDetails?.location || ""
                            }
                            onChange={handleInputChange}
                            className="form-control"
                          >
                            <option value="">Select Location</option>
                            {locations.map((loc) => (
                              <option key={loc} value={loc}>
                                {loc}
                              </option>
                            ))}
                            <option value="new">+ Add New Location</option>
                          </select>

                          {newEmployee.employmentDetails?.location ===
                            "new" && (
                            <input
                              type="text"
                              placeholder="Enter new location"
                              value={newLocation}
                              onChange={(e) => setNewLocation(e.target.value)}
                              className="form-control mt-2"
                            />
                          )}
                        </div>

                        <div className="form-group half">
                          <label htmlFor="status">Status</label>
                          <select
                            id="status"
                            name="employmentDetails.status"
                            value={
                              newEmployee.employmentDetails?.status || "ACTIVE"
                            }
                            onChange={handleInputChange}
                            className="form-control"
                          >
                            {statuses.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group half">
                          <label htmlFor="dateOfJoining">Join Date</label>
                          <input
                            type="date"
                            id="dateOfJoining"
                            name="employmentDetails.dateOfJoining"
                            value={
                              newEmployee.employmentDetails?.dateOfJoining?.split(
                                "T"
                              )[0] || new Date().toISOString().split("T")[0]
                            }
                            onChange={handleInputChange}
                            className="form-control"
                          />
                        </div>

                        <div className="form-group half">
                          <label htmlFor="lineManagerId">Line Manager</label>
                          <select
                            id="lineManagerId"
                            name="employmentDetails.lineManagerId"
                            value={
                              newEmployee.employmentDetails?.lineManagerId || ""
                            }
                            onChange={handleInputChange}
                            required
                            className="form-control"
                          >
                            <option value="">Select Line Manager</option>
                            {employees.map((emp) => (
                              <option key={emp.id} value={emp.id}>
                                {emp.name} ({emp.email})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group half">
                          <label htmlFor="employmentType">
                            Employment Type
                          </label>
                          <select
                            id="employmentType"
                            name="employmentDetails.employmentType"
                            value={
                              newEmployee.employmentDetails?.employmentType ||
                              ""
                            }
                            onChange={handleInputChange}
                            className="form-control"
                          >
                            <option value="">Select Type</option>
                            <option value="FULL_TIME">Full-time</option>
                            <option value="PART_TIME">Part-time</option>
                            <option value="CONTRACT">Contract</option>
                            <option value="INTERN">Intern</option>
                            <option value="CONSULTANT">Consultant</option>
                          </select>
                        </div>

                        <div className="form-group half">
                          <label htmlFor="uanNumber">UAN Number</label>
                          <input
                            type="number"
                            id="uanNumber"
                            name="employmentDetails.uanNumber"
                            value={
                              newEmployee.employmentDetails?.uanNumber || ""
                            }
                            onChange={handleInputChange}
                            className={`form-control ${
                              errors.employmentDetails?.uanNumber
                                ? "error-input"
                                : ""
                            }`}
                          />
                          {errors.employmentDetails?.uanNumber && (
                            <div className="error-message">
                              {errors.employmentDetails.uanNumber}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group half">
                          <label htmlFor="pfNumber">PF Number</label>
                          <input
                            type="number"
                            id="pfNumber"
                            name="employmentDetails.pfNumber"
                            value={
                              newEmployee.employmentDetails?.pfNumber || ""
                            }
                            onChange={handleInputChange}
                            className={`form-control ${
                              errors.employmentDetails?.pfNumber
                                ? "error-input"
                                : ""
                            }`}
                          />
                          {errors.employmentDetails?.pfNumber && (
                            <div className="error-message">
                              {errors.employmentDetails.pfNumber}
                            </div>
                          )}
                        </div>

                        <div className="form-group half">
                          <label htmlFor="esicNumber">ESIC Number</label>
                          <input
                            type="number"
                            id="esicNumber"
                            name="employmentDetails.esicNumber"
                            value={
                              newEmployee.employmentDetails?.esicNumber || ""
                            }
                            onChange={handleInputChange}
                            className={`form-control ${
                              errors.employmentDetails?.esicNumber
                                ? "error-input"
                                : ""
                            }`}
                          />
                          {errors.employmentDetails?.esicNumber && (
                            <div className="error-message">
                              {errors.employmentDetails.esicNumber}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 2 && (
                    <div className="form-section">
                      <h3>Current Address</h3>

                      <div className="form-group">
                        <label htmlFor="currentStreet">Street Address</label>
                        <input
                          type="text"
                          id="currentStreet"
                          name="currentAddress.street"
                          value={newEmployee.currentAddress?.street || ""}
                          onChange={handleInputChange}
                          className="form-control"
                        />
                      </div>

                      <div className="form-row">
                        <div className="form-group half">
                          <label htmlFor="currentCity">City</label>
                          <input
                            type="text"
                            id="currentCity"
                            name="currentAddress.city"
                            value={newEmployee.currentAddress?.city || ""}
                            onChange={handleInputChange}
                            className="form-control"
                          />
                        </div>

                        <div className="form-group half">
                          <label htmlFor="currentState">State</label>
                          <input
                            type="text"
                            id="currentState"
                            name="currentAddress.state"
                            value={newEmployee.currentAddress?.state || ""}
                            onChange={handleInputChange}
                            className="form-control"
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group half">
                          <label htmlFor="currentCountry">Country</label>
                          <input
                            type="text"
                            id="currentCountry"
                            name="currentAddress.country"
                            value={newEmployee.currentAddress?.country || ""}
                            onChange={handleInputChange}
                            className="form-control"
                          />
                        </div>

                        <div className="form-group half">
                          <label htmlFor="currentZipCode">Zip Code</label>
                          <input
                            type="text"
                            id="currentZipCode"
                            name="currentAddress.zipCode"
                            value={newEmployee.currentAddress?.zipCode || ""}
                            onChange={handleInputChange}
                            className="form-control"
                          />
                        </div>
                      </div>

                      <div className="form-check mt-4 mb-4">
                        <input
                          type="checkbox"
                          id="sameAsCurrentAddress"
                          onChange={(e) => {
                            if (e.target.checked) {
                              // Copy current address to permanent address
                              setNewEmployee({
                                ...newEmployee,
                                permanentAddress: {
                                  ...newEmployee.currentAddress,
                                },
                              });
                            }
                          }}
                        />
                        <label
                          htmlFor="sameAsCurrentAddress"
                          className="check-label"
                        >
                          Same as current address
                        </label>
                      </div>

                      <h3>Permanent Address</h3>

                      <div className="form-group">
                        <label htmlFor="permanentStreet">Street Address</label>
                        <input
                          type="text"
                          id="permanentStreet"
                          name="permanentAddress.street"
                          value={newEmployee.permanentAddress?.street || ""}
                          onChange={handleInputChange}
                          className="form-control"
                        />
                      </div>

                      <div className="form-row">
                        <div className="form-group half">
                          <label htmlFor="permanentCity">City</label>
                          <input
                            type="text"
                            id="permanentCity"
                            name="permanentAddress.city"
                            value={newEmployee.permanentAddress?.city || ""}
                            onChange={handleInputChange}
                            className="form-control"
                          />
                        </div>

                        <div className="form-group half">
                          <label htmlFor="permanentState">State</label>
                          <input
                            type="text"
                            id="permanentState"
                            name="permanentAddress.state"
                            value={newEmployee.permanentAddress?.state || ""}
                            onChange={handleInputChange}
                            className="form-control"
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group half">
                          <label htmlFor="permanentCountry">Country</label>
                          <input
                            type="text"
                            id="permanentCountry"
                            name="permanentAddress.country"
                            value={newEmployee.permanentAddress?.country || ""}
                            onChange={handleInputChange}
                            className="form-control"
                          />
                        </div>

                        <div className="form-group half">
                          <label htmlFor="permanentZipCode">Zip Code</label>
                          <input
                            type="text"
                            id="permanentZipCode"
                            name="permanentAddress.zipCode"
                            value={newEmployee.permanentAddress?.zipCode || ""}
                            onChange={handleInputChange}
                            className="form-control"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {activeTab === 3 && (
                    <div className="form-section">
                      <h3>Bank Details</h3>

                      <div className="form-group">
                        <label htmlFor="accountHolder">
                          Account Holder's Name
                        </label>
                        <input
                          type="text"
                          id="accountHolder"
                          name="bankDetails.accountHolder"
                          value={newEmployee.bankDetails?.accountHolder || ""}
                          onChange={handleInputChange}
                          className={`form-control ${
                            errors.bankDetails?.accountHolder
                              ? "error-input"
                              : ""
                          }`}
                        />
                        {errors.bankDetails?.accountHolder && (
                          <div className="error-message">
                            {errors.bankDetails.accountHolder}
                          </div>
                        )}
                      </div>

                      <div className="form-group">
                        <label htmlFor="bankName">Bank Name</label>
                        <input
                          type="text"
                          id="bankName"
                          name="bankDetails.bankName"
                          value={newEmployee.bankDetails?.bankName || ""}
                          onChange={handleInputChange}
                          className={`form-control ${
                            errors.bankDetails?.bankName ? "error-input" : ""
                          }`}
                        />
                        {errors.bankDetails?.bankName && (
                          <div className="error-message">
                            {errors.bankDetails.bankName}
                          </div>
                        )}
                      </div>

                      <div className="form-row">
                        <div className="form-group half">
                          <label htmlFor="accountNumber">Account Number</label>
                          <input
                            type="number"
                            id="accountNumber"
                            name="bankDetails.accountNumber"
                            value={newEmployee.bankDetails?.accountNumber || ""}
                            onChange={handleInputChange}
                            className={`form-control ${
                              errors.bankDetails?.accountNumber
                                ? "error-input"
                                : ""
                            }`}
                          />
                          {errors.bankDetails?.accountNumber && (
                            <div className="error-message">
                              {errors.bankDetails.accountNumber}
                            </div>
                          )}
                        </div>

                        <div className="form-group half">
                          <label htmlFor="ifscCode">IFSC Code</label>
                          <input
                            type="text"
                            id="ifscCode"
                            name="bankDetails.ifscCode"
                            value={newEmployee.bankDetails?.ifscCode || ""}
                            onChange={handleInputChange}
                            className={`form-control ${
                              errors.bankDetails?.ifscCode ? "error-input" : ""
                            }`}
                          />
                          {errors.bankDetails?.ifscCode && (
                            <div className="error-message">
                              {errors.bankDetails.ifscCode}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>

            <div className="modal-footer">
              <button
                className="cancel-btn"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button className="save-btn" onClick={handleAddEmployeeSubmit}>
                Add Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDatabase;
