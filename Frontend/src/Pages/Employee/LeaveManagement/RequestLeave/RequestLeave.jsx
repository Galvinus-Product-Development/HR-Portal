import React, { useState } from 'react';
import { Upload, Calendar } from 'lucide-react';
import './RequestLeave.css'


export default function Leave() {
    const [leaveType, setLeaveType] = useState('annual');
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };

    return (
        <div className="leave-management-container">
            <header className="header">
                <h1 className="header-title">Leave Management</h1>
                <p className="header-subtitle">Request and manage your leaves</p>
            </header>

            <div className="form-and-summary">
                <div className="leave-form-container">
                    <div className="leave-request-form">
                        <h2 className="section-title">Request Leave</h2>
                        <form className="leave-form">
                            <div className="form-group">
                                <label className="label">Leave Type</label>
                                <select
                                    value={leaveType}
                                    onChange={(e) => setLeaveType(e.target.value)}
                                    className="input-field"
                                >
                                    <option value="annual">Annual Leave</option>
                                    <option value="sick">Sick Leave</option>
                                    <option value="personal">Personal Leave</option>
                                </select>
                            </div>

                            <div className="date-picker-container">
                                <div className="form-group">
                                    <label className="label">Start Date</label>
                                    <input type="date" className="input-field" />
                                </div>
                                <div className="form-group">
                                    <label className="label">End Date</label>
                                    <input type="date" className="input-field" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="label">Reason</label>
                                <textarea
                                    rows={4}
                                    className="input-field"
                                    placeholder="Please provide a reason for your leave request..."
                                />
                            </div>

                            <div className="form-group">
                                <label className="label">Supporting Documents</label>
                                <div className="file-upload-container">
                                    <Upload className="upload-icon" />
                                    <div className="upload-text">
                                        <label htmlFor="file-upload" className="upload-label">
                                            <span>Upload a file</span>
                                            <input
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                className="sr-only"
                                                onChange={handleFileChange}
                                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                            />
                                        </label>
                                        {/* <p>or drag and drop</p> */}
                                    </div>
                                    <p className="file-upload-info">PDF, DOC, DOCX, JPG up to 10MB</p>
                                    {selectedFile && (
                                        <p className="file-name">{selectedFile.name}</p>
                                    )}
                                </div>
                            </div>

                            <button type="submit" className="submit-btn">Submit Request</button>
                        </form>
                    </div>
                </div>

                <div className="leave-summary-container">
                    <div className="leave-balance">
                        <h2 className="section-title">Leave Balance</h2>
                        <div className="leave-item">
                            <div>
                                <p className="leave-type">Annual Leave</p>
                                <p className="leave-detail">Expires Dec 31, 2025</p>
                            </div>
                            <span className="leave-days">15 days</span>
                        </div>
                        <div className="leave-item">
                            <div>
                                <p className="leave-type">Sick Leave</p>
                                <p className="leave-detail">Yearly allocation</p>
                            </div>
                            <span className="leave-days">10 days</span>
                        </div>
                        <div className="leave-item">
                            <div>
                                <p className="leave-type">Personal Leave</p>
                                <p className="leave-detail">Yearly allocation</p>
                            </div>
                            <span className="leave-days">5 days</span>
                        </div>
                    </div>

                    <div className="recent-requests">
                        <h2 className="section-title">Recent Requests</h2>
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="request-item">
                                <div>
                                    <p className="request-type">Annual Leave</p>
                                    <p className="request-dates">Mar 15 - Mar 17, 2025</p>
                                </div>
                                <span className={`status ${i === 0 ? 'pending' : i === 1 ? 'approved' : 'rejected'}`}>
                                    {i === 0 ? 'Pending' : i === 1 ? 'Approved' : 'Rejected'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}