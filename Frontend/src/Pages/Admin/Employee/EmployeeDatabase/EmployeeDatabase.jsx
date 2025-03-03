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
} from "lucide-react";
import "./EmployeeDatabase.css";

const EmployeeDatabase = () => {
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
  const generateDeviceId = () => {
    const deviceId = `device-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("deviceId", deviceId);
    return deviceId;
  };
  useEffect(() => {
    const fetchEmployees = async () => {
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
        ); // Adjust your API endpoint
        if (!response.ok) throw new Error("Failed to fetch employees");
        const data = await response.json();
        setEmployees(data.data); // Assuming API response format: { success: true, data: [...] }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const departments = Array.from(
    new Set(employees.map((emp) => emp.department))
  );
  const locations = Array.from(new Set(employees.map((emp) => emp.location)));
  const statuses = ["Active", "On Leave", "Inactive"];

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

  if (loading) return <p>Loading employees...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="employee-db-container">
      <div className="employee-db-header">
        <div className="employee-db-title">
          <Users className="employee-db-icon" />
          <h1>Employee Database</h1>
        </div>
        <div className="employee-db-buttons">
          <button className="employee-db-btn">
            <Download className="employee-db-btn-icon" /> Export
          </button>
          <button className="employee-db-btn">
            <Upload className="employee-db-btn-icon" /> Import
          </button>
          <button className="employee-db-btn-add">
            <Plus className="employee-db-btn-icon" /> Add Employee
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
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr
                key={employee.id}
                className="employee-db-row"
                onClick={() => navigate(`/admin/employees/${employee.id}`)}
              >
                <td>
                  <div className="employee-db-profile">
                    <img
                      className="employee-db-avatar"
                      src={employee.avatar}
                      alt={employee.name}
                    />
                    <div>
                      <div className="employee-db-name">{employee.name}</div>
                      <div className="employee-db-id">{employee.id}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="employee-db-contact">
                    <Mail className="employee-db-contact-icon" />{" "}
                    {employee.email}
                  </div>
                  <div className="employee-db-contact">
                    <Phone className="employee-db-contact-icon" />{" "}
                    {employee.phone}
                  </div>
                </td>
                <td>
                  <div>{employee.department}</div>
                  <div className="employee-db-designation">
                    {employee.designation}
                  </div>
                </td>
                <td>
                  <div className="employee-db-location">
                    <MapPin className="employee-db-contact-icon" />{" "}
                    {employee.location}
                  </div>
                </td>
                <td>
                  <span
                    className={`employee-db-status ${getStatusColor(
                      employee.status
                    )}`}
                  >
                    {employee.status}
                  </span>
                </td>
                <td>
                  <div className="employee-db-join-date">
                    <Calendar className="employee-db-contact-icon" />{" "}
                    {new Date(employee.joinDate).toLocaleDateString()}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeDatabase;
