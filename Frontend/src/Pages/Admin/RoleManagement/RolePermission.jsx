import React, { useState, useEffect } from "react";
import { Shield, Info, Search, UserCog, Plus, Trash2 } from "lucide-react";
import "./RolePermission.css";

const RolePermissions = () => {
  const [selectedRole, setSelectedRole] = useState("Super Admin");
  const [showAssignRole, setShowAssignRole] = useState(false);
  const [showCreateRole, setShowCreateRole] = useState(false);
  const [showDeleteRole, setShowDeleteRole] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [rolePermissions, setRolePermissions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [availablePermissions, setAvailablePermissions] = useState([]);

  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [roleToDelete, setRoleToDelete] = useState("");
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showDeletePermissionModal, setShowDeletePermissionModal] = useState(false);
  const [selectedRoleForPermission, setSelectedRoleForPermission] =
    useState(null);
  const [selectedPermission, setSelectedPermission] = useState("");
  const [selectedRoleForPermissionDeletion,setSelectedRoleForPermissionDeletion]=useState("");

  useEffect(() => {
    fetchEmployees();
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/role-permissions/employees"
      );
      const data = await response.json();
      console.log("Employees ", data);
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/role-permissions/roles"
      );
      const data = await response.json();
      console.log("Roles & Permission", data);
      setRolePermissions(data);
      // setSelectedRole(data[0]?.role || null);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/role-permissions/permissions"
      );
      const data = await response.json();
      console.log("Permission", data);
      setAvailablePermissions(data);
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  };

  const handleCreateRole = async () => {
    if (!roleName.trim()) return alert("Role name is required!");
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
        "x-refresh-token": localStorage.getItem("refreshToken") || "",
      };
      const response = await fetch("http://localhost:5000/api/v1/admin/roles", {
        method: "POST",
        headers,
        body: JSON.stringify({ name: roleName, description: roleDescription }),
      });
      if (!response.ok) throw new Error("Failed to create role");

      setRoleName("");
      setRoleDescription("");
      setShowCreateRole(false);
      fetchRoles();
    } catch (error) {
      console.error("Error creating role:", error);
    }
  };

  const handleDeleteRole = async () => {
    if (!roleToDelete) return alert("Select a role to delete!");

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
      "x-refresh-token": localStorage.getItem("refreshToken") || "",
    };

    try {
      console.log("Here.........", localStorage.getItem("accessToken"));

      const response = await fetch(
        `http://localhost:5000/api/v1/admin/roles/${roleToDelete}`,
        {
          method: "DELETE",
          headers,  // <-- Correct placement of headers inside options
        }
      );

      if (!response.ok) throw new Error("Failed to delete role");

      setRoleToDelete("");
      setShowDeleteRole(false);
      fetchRoles();
    } catch (error) {
      console.error("Error deleting role:", error);
    }
};


  const handleUpdateEmployeeRole = async (employeeId, newRole) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
        "x-refresh-token": localStorage.getItem("refreshToken") || "",
      };

      const response = await fetch(
        "http://localhost:5000/api/v1/admin/assign-role",
        {
          method: "POST",
          headers,
          body: JSON.stringify({ userId: employeeId, roleName: newRole }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update role");
      }

      const result = await response.json();
      console.log("Role updated successfully:", result);

      // Optionally refresh the employees list to reflect the update
      fetchEmployees();
    } catch (error) {
      console.error("Error updating employee role:", error.message);
      alert(`Failed to update role: ${error.message}`); // Optional user feedback
    }
  };

  const handleOpenPermissionModal = (role) => {
    setSelectedRoleForPermission(role);
    setShowPermissionModal(true);
  };

  const handleAddPermission = async () => {
    if (!selectedRoleForPermission || !selectedPermission) return;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
      "x-refresh-token": localStorage.getItem("refreshToken") || "",
    };
    console.log(selectedRoleForPermission, selectedPermission);
    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/admin/assign-role-permission",
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            roleName: selectedRoleForPermission,
            permissionName: selectedPermission,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to add permission");

      fetchRoles();
      setShowPermissionModal(false);
    } catch (error) {
      console.error("Error adding permission:", error);
    }
  };

  const handleRemovePermission = async (roleId, permissionId) => {
    // console.log(roleId,permissionId);
    if (!roleId || !permissionId) return;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
      "x-refresh-token": localStorage.getItem("refreshToken") || "",
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/admin/remove-role-permission",
        {
          method: "POST",
          headers,
          body: JSON.stringify({ roleId, permissionId }),
        }
      );

      if (!response.ok) throw new Error("Failed to remove permission");

      fetchRoles(); // Refresh roles to update UI
    } catch (error) {
      console.error("Error removing permission:", error);
    }
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const AssignRoleModal = () => (
    <div className="rolemgmt-modal-overlay">
      <div className="rolemgmt-modal-container">
        <div className="rolemgmt-modal-header">
          <h3 className="rolemgmt-modal-title">Assign Roles to Employees</h3>
          <button
            onClick={() => setShowAssignRole(false)}
            className="rolemgmt-modal-close-btn"
          >
            ×
          </button>
        </div>

        <div className="rolemgmt-search-container">
          <div className="rolemgmt-search-input-wrapper">
            <Search className="rolemgmt-search-icon" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rolemgmt-search-input"
            />
          </div>
        </div>

        <div className="rolemgmt-employee-list">
          {filteredEmployees.map((employee) => (
            <div key={employee.id} className="rolemgmt-employee-item">
              <div className="rolemgmt-employee-info">
                <img
                  src={employee.avatar}
                  alt={employee.name}
                  className="rolemgmt-employee-avatar"
                />
                <div>
                  <h4 className="rolemgmt-employee-name">{employee.name}</h4>
                  <p className="rolemgmt-employee-department">
                    {employee.department}
                  </p>
                </div>
              </div>
              <div className="rolemgmt-employee-role-select-container">
                <select
                  value={employee.role}
                  onChange={(e) =>
                    handleUpdateEmployeeRole(employee.id, e.target.value)
                  }
                  className="rolemgmt-employee-role-select"
                >
                  {Object.keys(rolePermissions).map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="rolemgmt-container">
      <div className="rolemgmt-header">
        <div className="rolemgmt-title-container">
          <Shield className="rolemgmt-title-icon" />
          <h1 className="rolemgmt-title-text">Role Permissions</h1>
        </div>

        {selectedRole === "Super Admin" && (
          <>
            <button
              onClick={() => setShowAssignRole(true)}
              className="rolemgmt-assign-roles-btn"
            >
              <UserCog className="rolemgmt-btn-icon" /> Assign Roles
            </button>
            <button
              onClick={() => setShowCreateRole(true)}
              className="rolemgmt-create-role-btn"
            >
              <Plus className="rolemgmt-btn-icon" /> Create Role
            </button>
            <button
              onClick={() => setShowDeleteRole(true)}
              className="rolemgmt-delete-role-btn"
            >
              <Trash2 className="rolemgmt-btn-icon" /> Delete Role
            </button>
          </>
        )}
      </div>

      {/* Create Role Modal */}
      {showCreateRole && (
        <div className="rolemgmt-modal-overlay">
          <div className="rolemgmt-modal-container">
            <div className="rolemgmt-modal-header">
              <h3>Create New Role</h3>
              <button
                className="rolemgmt-close-btn"
                onClick={() => setShowCreateRole(false)}
              >
                ×
              </button>
            </div>
            <input
              type="text"
              placeholder="Role Name"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
            />
            <textarea
              placeholder="Role Description"
              value={roleDescription}
              onChange={(e) => setRoleDescription(e.target.value)}
            />
            <button
              onClick={handleCreateRole}
              className="rolemgmt-assign-roles-btn"
            >
              Create Role
            </button>
          </div>
        </div>
      )}

      {showDeleteRole && (
        <div className="rolemgmt-modal-overlay">
          <div className="rolemgmt-modal-container">
            <div className="rolemgmt-modal-header">
              <h3>Delete Role</h3>
              <button
                className="rolemgmt-close-btn"
                onClick={() => setShowDeleteRole(false)}
              >
                ×
              </button>
            </div>

            <select
              value={roleToDelete}
              onChange={(e) => setRoleToDelete(e.target.value)}
            >
              <option value="">Select Role to Delete</option>
              {Object.values(rolePermissions).map(({ role, roleId }) => (
                <option key={roleId} value={roleId}>
                  {role}
                </option>
              ))}
            </select>

            <button
              onClick={() => handleDeleteRole(roleToDelete)}
              className="rolemgmt-delete-role-btn"
              disabled={!roleToDelete}
            >
              Delete Role
            </button>
          </div>
        </div>
      )}

      <div className="rolemgmt-permissions-card">
        <h2 className="rolemgmt-section-title">Permissions</h2>
        <div className="rolemgmt-permissions-grid">
          {Object.entries(rolePermissions).map(([role, data]) => (
            <div key={role} className="rolemgmt-module-card">
              <div className="rolemgmt-module-header">
                <h3 className="rolemgmt-module-title">{role}</h3>
                <button
                  className="rolemgmt-assign-roles-btn"
                  onClick={() => handleOpenPermissionModal(role)}
                >
                  + Add Permission
                </button>
              </div>
              <div className="rolemgmt-permissions-list">

                {data.permissions.map((permission) => {
                  return (
                    <div
                      className="rolemgmt-permission-item"
                      key={permission.id}
                    >
                      <span className="rolemgmt-permission-name">
                        {permission.name}
                      </span>
                      <button
                        className="rolemgmt-remove-permission-btn"
                        onClick={() =>{
                          console.log(data);
                          // setShowPermissionModal(true) ||
                          setShowDeletePermissionModal(true) ||
                          setSelectedPermission(permission)
                          setSelectedRoleForPermissionDeletion(data);
                        }
                        }
                      >
                        <Trash2 className="rolemgmt-remove-icon" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAssignRole && <AssignRoleModal />}

      {showPermissionModal && (
        <div className="rolemgmt-modal-overlay">
          <div className="rolemgmt-modal-container">
            <div className="rolemgmt-modal-header">
              <h3>Add Permission to {selectedRoleForPermission}</h3>
              <button
                className="rolemgmt-assign-roles-btn"
                onClick={() => setShowPermissionModal(false)}
              >
                ×
              </button>
            </div>

            <select
              value={selectedPermission}
              onChange={(e) => setSelectedPermission(e.target.value)}
            >
              <option value="">Select a permission</option>
              {availablePermissions.map((perm) => (
                <option key={perm.id} value={perm.name}>
                  {perm.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleAddPermission}
              className="rolemgmt-assign-roles-btn"
            >
              Add Permission
            </button>
          </div>
        </div>
      )}

      {showDeletePermissionModal && selectedPermission && (
        <div className="rolemgmt-modal-overlay">
          <div className="rolemgmt-modal-container">
            <div className="rolemgmt-modal-header">
              <h3>Remove Permission</h3>
              <button
                className="rolemgmt-close-btn"
                onClick={() => setShowDeletePermissionModal(false)}
              >
                ×
              </button>
            </div>
            <p>
              Are you sure you want to remove <b>{selectedPermission.name}</b>{" "}
              from <b>{selectedRoleForPermissionDeletion.role}</b>?
            </p>
            <button
              className="rolemgmt-delete-role-btn"
              onClick={() => {
                // console.log(selectedRoleForPermission,selectedPermission);
                handleRemovePermission(
                  selectedRoleForPermissionDeletion.roleId,
                  selectedPermission.id
                );
                setShowDeletePermissionModal(false);
                setSelectedPermission(null);
              }}
            >
              Remove Permission
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolePermissions;
