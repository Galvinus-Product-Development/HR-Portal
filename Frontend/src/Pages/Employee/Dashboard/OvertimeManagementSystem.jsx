import React, { useEffect, useState } from "react";
import { CheckCircle, Clock, Edit } from "lucide-react";

export default function OvertimeManagementSystem() {
  // State for the form submission and existing requests
  const [overtimeRequest, setOvertimeRequest] = useState({
    date: "",
    startTime: "",
    endTime: "",
    duration: "",
    reason: "",
  });
  const [overtimeSubmitting, setOvertimeSubmitting] = useState(false);
  const [overtimeSuccess, setOvertimeSuccess] = useState(false);
  const id = localStorage.getItem("userId");

  // Sample unclaimed overtime requests data
  const [unclaimedRequests, setUnclaimedRequests] = useState([

  ]);

  // State for editing a claim
  const [editingClaim, setEditingClaim] = useState(null);
  const [claimFormData, setClaimFormData] = useState({
    hours: 0,
    minutes: 0,
  });
  const VITE_API_BASE_URL_AT = import.meta.env.VITE_API_BASE_URL_AT;
  // Handle form input changes
  const handleOvertimeChange = (e) => {
    const { name, value } = e.target;
    setOvertimeRequest((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getOvertimeUnclaimedRequest = async () => {
    try {
      const response = await fetch(
        `${VITE_API_BASE_URL_AT}/api/overtime/getUnclaimedOvertime/${id}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log(data);

      // setUnclaimedRequests((prev) => [...data.data]);
      setUnclaimedRequests((prev) =>
        data?.data?.map((item) => ({
          ...item,
          hours: Math.floor(item.duration / 3600000),
          minutes: Math.floor((item.duration % 3600000) / 60000),
        }))
      );
      console.log(unclaimedRequests);
    } catch (error) {
      console.log(error);
    } finally {
      setOvertimeSubmitting(false);
    }
  };

  // Handle form submission
  const handleOvertimeSubmit = async (e) => {
    const employeeId = localStorage.getItem("userId");
    console.log("THis is the employeeId form the localstorage", employeeId);
    e.preventDefault();
    setOvertimeSubmitting(true);
    try {
      console.log("This is the overtime request:-",overtimeRequest);
      const response = await fetch(
        `http://localhost:5003/at/api/overtime/${employeeId}`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(overtimeRequest),
        }
      );

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setOvertimeSubmitting(false);
    }

    // Simulate API call
    setTimeout(() => {

      // Reset form
      setOvertimeRequest({
        date: "",
        startTime: "",
        endTime: "",
        reason: "",
        duration: "",
      });
      setOvertimeSubmitting(false);
      setOvertimeSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => setOvertimeSuccess(false), 3000);
    }, 1000);
  };

  // Start editing a claim
  const startEditClaim = (request) => {
    setEditingClaim(request.id);
    setClaimFormData({
      hours: request.hours,
      minutes: request.minutes,
    });
  };

  // Handle claim form changes
  const handleClaimChange = (e) => {
    const { name, value } = e.target;
    setClaimFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit a claim
  // const submitClaim = async (id) => {
  //   // Update the request status and duration
  //   setUnclaimedRequests(
  //     unclaimedRequests.map((req) =>
  //       req.id === id
  //         ? {
  //             ...req,
  //             status: "Claimed",
  //             hours: parseInt(claimFormData.hours),
  //             minutes: parseInt(claimFormData.minutes),
  //           }
  //         : req
  //     )
  //   );
  //   const duration =
  //     claimFormData.hours * 60 * 60 * 1000 + claimFormData.minutes * 60 * 1000;
  //   console.log("this is duration:-", duration);

  //   try {
  //     const response = await fetch(
  //       `${VITE_API_BASE_URL_AT}/api/overtime/claimOvertime/${id}`,
  //       {
  //         method: "PATCH",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           duration
  //         })
  //       }
  //     );
  //     if(response.ok)
  //     {
  //       const data=await response.json();
  //       console.log("This is the backend data for claim",data);
  //     }
  //   } catch (e) {
  //     console.log("Error during sumbiting claim request ", e);
  //   }

  //   // Exit edit mode
  //   setEditingClaim(null);
  // };

  const submitClaim = async (id) => {
    // Check if the claimFormData values are valid numbers before proceeding
    const hours = parseInt(claimFormData.hours, 10);
    const minutes = parseInt(claimFormData.minutes, 10);
  
    if (isNaN(hours) || isNaN(minutes)) {
      console.error("Invalid hours or minutes");
      return; // Stop execution if invalid
    }
  
    // Update the request status and duration in the local state
    setUnclaimedRequests((prevRequests) =>
      prevRequests.map((req) =>
        req.id === id
          ? {
              ...req,
              status: "Claimed",
              hours, // Direct assignment since we've parsed the values
              minutes,
            }
          : req
      )
    );
  
    const duration = hours * 60 * 60 * 1000 + minutes * 60 * 1000;
    console.log("This is duration:-", duration);
  
    try {
      const response = await fetch(
        `${VITE_API_BASE_URL_AT}/api/overtime/claimOvertime/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ duration }),
        }
      );
  
      if (response.ok) {
        const data = await response.json();
        console.log("This is the backend data for claim", data);
      } else {
        console.error("Failed to submit claim, server responded with:", response.status);
      }
    } catch (e) {
      console.log("Error during submitting claim request ", e);
    }
  
    // Exit edit mode
    setEditingClaim(null);
  };
  

  // Cancel editing
  const cancelEdit = () => {
    setEditingClaim(null);
  };

  // Format duration display
  const formatDuration = (hours, minutes) => {
    return `${hours}h ${minutes}m`;
  };

  // Format date for display
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    getOvertimeUnclaimedRequest();
  }, []);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "24px",
      }}
    >
      {/* Overtime Request Form */}
      <div
        style={{
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
        }}
      >
        <h3
          style={{ fontSize: "20px", fontWeight: "600", marginBottom: "16px" }}
        >
          Request Overtime
        </h3>
        <form
          onSubmit={handleOvertimeSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          {overtimeSuccess && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                color: "rgb(6, 95, 70)",
                borderRadius: "4px",
              }}
            >
              <CheckCircle size={16} style={{ marginRight: "8px" }} />
              Overtime request submitted successfully!
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label
              htmlFor="date"
              style={{
                marginBottom: "4px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={overtimeRequest.date}
              onChange={handleOvertimeChange}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
              }}
              required
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label
              htmlFor="startTime"
              style={{
                marginBottom: "4px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Overtime Start Time
            </label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={overtimeRequest.startTime}
              onChange={handleOvertimeChange}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
              }}
              required
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label
              htmlFor="endTime"
              style={{
                marginBottom: "4px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Overtime End Time
            </label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={overtimeRequest.endTime}
              onChange={handleOvertimeChange}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
              }}
              required
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label
              htmlFor="duration"
              style={{
                marginBottom: "4px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Overtime Duration
            </label>
            <input
              type="text"
              id="duration"
              name="duration"
              value={overtimeRequest.duration}
              onChange={handleOvertimeChange}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
              }}
              required
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label
              htmlFor="reason"
              style={{
                marginBottom: "4px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Reason
            </label>
            <textarea
              id="reason"
              name="reason"
              value={overtimeRequest.reason}
              onChange={handleOvertimeChange}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
                minHeight: "80px",
              }}
              placeholder="Please provide a reason for overtime request"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              backgroundColor: overtimeSubmitting ? "#60a5fa" : "#2563eb",
              color: "white",
              padding: "8px",
              borderRadius: "4px",
              border: "none",
              cursor: overtimeSubmitting ? "not-allowed" : "pointer",
              transition: "background-color 0.2s",
            }}
            disabled={overtimeSubmitting}
          >
            {overtimeSubmitting ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>

      {/* Unclaimed Overtime List */}
      <div
        style={{
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
        }}
      >
        <h3
          style={{ fontSize: "20px", fontWeight: "600", marginBottom: "16px" }}
        >
          Unclaimed Overtime Requests
        </h3>

        {unclaimedRequests?.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <Clock size={48} style={{ margin: "0 auto", color: "#9ca3af" }} />
            <p style={{ marginTop: "8px", color: "#6b7280" }}>
              No unclaimed overtime requests
            </p>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {unclaimedRequests?.map((request) => (
              <div
                key={request.id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "4px",
                  padding: "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "8px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ fontWeight: "500" }}>
                      {formatDate(request.date)}
                    </span>
                    <span style={{ margin: "0 8px", color: "#6b7280" }}>•</span>
                    <span style={{ color: "#4b5563" }}>
                      {new Date(request.startTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div
                    style={{
                      padding: "4px 8px",
                      fontSize: "12px",
                      borderRadius: "9999px",
                      backgroundColor: "#fef3c7",
                      color: "#92400e",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Clock size={12} style={{ marginRight: "4px" }} />
                    {request.overtimeStatus == "REQUESTACCEPTED"
                      ? "Unclaimed"
                      : ""}
                  </div>
                </div>

                <div style={{ marginBottom: "8px" }}>
                  <p style={{ color: "#4b5563", fontSize: "14px" }}>
                    {request.reason}
                  </p>
                </div>

                {editingClaim === request.id ? (
                  <div
                    style={{
                      marginTop: "12px",
                      borderTop: "1px solid #e5e7eb",
                      paddingTop: "12px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#4b5563",
                        marginBottom: "8px",
                      }}
                    >
                      Edit actual overtime hours:
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        marginBottom: "12px",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <label
                          style={{
                            fontSize: "12px",
                            color: "#6b7280",
                            display: "block",
                            marginBottom: "4px",
                          }}
                        >
                          Hours
                        </label>
                        <select
                          name="hours"
                          value={claimFormData.hours}
                          onChange={handleClaimChange}
                          style={{
                            width: "100%",
                            padding: "4px",
                            border: "1px solid #d1d5db",
                            borderRadius: "4px",
                            fontSize: "14px",
                          }}
                        >
                          {Array.from({ length: 25 }, (_, i) => (
                            <option key={i} value={i}>
                              {i.toString().padStart(2, "0")}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div style={{ flex: 1 }}>
                        <label
                          style={{
                            fontSize: "12px",
                            color: "#6b7280",
                            display: "block",
                            marginBottom: "4px",
                          }}
                        >
                          Minutes
                        </label>
                        <select
                          name="minutes"
                          value={claimFormData.minutes}
                          onChange={handleClaimChange}
                          style={{
                            width: "100%",
                            padding: "4px",
                            border: "1px solid #d1d5db",
                            borderRadius: "4px",
                            fontSize: "14px",
                          }}
                        >
                          {Array.from({ length: 60 }, (_, i) => (
                            <option key={i} value={i}>
                              {i.toString().padStart(2, "0")}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => submitClaim(request.id)}
                        style={{
                          flex: 1,
                          backgroundColor: "#059669",
                          color: "white",
                          fontSize: "14px",
                          padding: "8px",
                          borderRadius: "4px",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Submit Claim
                      </button>
                      <button
                        onClick={cancelEdit}
                        style={{
                          flex: 1,
                          backgroundColor: "#e5e7eb",
                          color: "#1f2937",
                          fontSize: "14px",
                          padding: "8px",
                          borderRadius: "4px",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "8px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: "14px",
                        color: "#4b5563",
                      }}
                    >
                      <Clock size={16} style={{ marginRight: "4px" }} />
                      <span>
                        {formatDuration(request.hours, request.minutes)}
                        {/* {`${Math.floor(
                          request.duration / 3600000
                        )}h ${Math.floor(
                          (request.duration % 3600000) / 60000
                        )}m`} */}
                      </span>
                    </div>

                    {request.overtimeStatus === "REQUESTACCEPTED" && (
                      <button
                        onClick={() => startEditClaim(request)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: "14px",
                          backgroundColor: "#dbeafe",
                          color: "#1e40af",
                          padding: "4px 12px",
                          borderRadius: "4px",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        <Edit size={12} style={{ marginRight: "4px" }} />
                        Claim
                      </button>
                    )}

                    {request.status === "Claimed" && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: "14px",
                          color: "#059669",
                        }}
                      >
                        <CheckCircle size={16} style={{ marginRight: "4px" }} />
                        Claimed
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
