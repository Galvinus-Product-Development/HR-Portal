import React, { useState, useEffect } from "react";
import { FaFileAlt, FaDownload, FaSpinner } from "react-icons/fa";
import "./LeavePolicy.css";

const LeavePolicy = () => {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [downloadLoading, setDownloadLoading] = useState(null);

    useEffect(() => {
        fetchPolicies();
    }, []);

    const fetchPolicies = async () => {
        try {
            setLoading(true);
            // Updated endpoint to use port 5000
            const response = await fetch(
                "http://localhost:5005/api/leave-policies"
            );

            if (!response.ok) {
                throw new Error("Failed to fetch policies");
            }

            const data = await response.json();
            // Set policies directly without grouping
            setPolicies(data);
        } catch (err) {
            setError("Error loading leave policies");
            console.error("Error fetching policies:", err);
        } finally {
            setLoading(false);
        }
    };

    // Generic helper function to format category names if needed in the card body
    const formatCategoryName = (category) => {
        return category
            .replace(/_/g, " ")
            .toLowerCase()
            .replace(/\b\w/g, (l) => l.toUpperCase());
    };

    // Download handler remains the same, using the download endpoint
    const handleDownload = async (policy) => {
        try {
            setDownloadLoading(policy.id);
            const response = await fetch(
                `http://localhost:5005/api/leave-policies/${policy.id}/download`
            );

            if (!response.ok) {
                throw new Error("Failed to download document");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${policy.policyName}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            setError("Error downloading document");
            console.error("Error downloading document:", err);
        } finally {
            setDownloadLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <FaSpinner className="spinner" />
                <p>Loading policies...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p className="error-message">{error}</p>
                <button className="retry-button" onClick={fetchPolicies}>
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="leave-policy-container">
            <div className="leave-policy-header">
                <div>
                    <h2 className="leave-policy-title">Leave Policies</h2>
                    <p className="leave-policy-subtitle">
                        View and manage leave policy documents.
                    </p>
                </div>
            </div>

            <div className="policy-grid">
                {policies.map((policy) => (
                    <div className="policy-card" key={policy.id}>
                        <div className="policy-card-header">
                            <h2 className="policy-card-title">
                                {policy.policyName}
                            </h2>
                            <div className="policy-card-icon">
                                <FaFileAlt />
                            </div>
                        </div>
                        <div className="policy-card-body">
                            <p className="policy-card-description">
                                Category:{" "}
                                {formatCategoryName(policy.policyCategory)}
                            </p>
                        </div>
                        <div className="policy-card-footer">
                            <button
                                className="download-button"
                                onClick={() => handleDownload(policy)}
                                disabled={downloadLoading === policy.id}
                            >
                                {downloadLoading === policy.id ? (
                                    <FaSpinner className="spinner" />
                                ) : (
                                    <FaDownload />
                                )}
                            </button>
                            <p className="upload-date">
                                Created:{" "}
                                {new Date(
                                    policy.createdAt
                                ).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {policies.length === 0 && (
                <div className="no-policies">
                    <p>No leave policies found.</p>
                </div>
            )}
        </div>
    );
};

export default LeavePolicy;
