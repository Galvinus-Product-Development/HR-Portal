import React, { useState } from 'react';
import './LeavePolicy.css';

const LeavePolicy = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const policies = [
        {
            id: 1,
            name: 'Annual Leave',
            description: 'Policies related to annual leave entitlements.',
            documents: [
                {
                    id: 1,
                    title: 'Annual Leave Policy 2025',
                    description: 'Guidelines for annual leave.',
                    uploadedBy: 'Admin',
                    date: '2024-01-15',
                },
            ],
        },
        {
            id: 2,
            name: 'Sick Leave',
            description: 'Policies for sick leave.',
            documents: [
                {
                    id: 2,
                    title: 'Sick Leave Policy 2025',
                    description: 'Rules for sick leave application.',
                    uploadedBy: 'Admin',
                    date: '2024-01-20',
                },
            ],
        },
        {
            id: 3,
            name: 'Maternity Leave',
            description: 'Policies for maternity leave entitlements.',
            documents: [
                {
                    id: 3,
                    title: 'Maternity Leave Policy 2025',
                    description: 'Details of maternity leave benefits.',
                    uploadedBy: 'HR',
                    date: '2024-02-05',
                },
            ],
        },
        {
            id: 4,
            name: 'Paternity Leave',
            description: 'Policies related to paternity leave.',
            documents: [
                {
                    id: 4,
                    title: 'Paternity Leave Policy 2025',
                    description: 'Guidelines for paternity leave.',
                    uploadedBy: 'HR',
                    date: '2024-02-10',
                },
            ],
        },

        {
            id: 6,
            name: 'Unpaid Leave',
            description: 'Policies for unpaid leave.',
            documents: [
                {
                    id: 6,
                    title: 'Unpaid Leave Policy 2025',
                    description: 'Rules for taking unpaid leave.',
                    uploadedBy: 'Finance',
                    date: '2024-03-10',
                },
            ],
        },
    ];

    const handleUploadClick = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    return (
        <div className="leave-policy-container">
            <div className="leave-policy-header">
                <div>
                    <h2 className="leave-policy-title">Leave Policies</h2>
                    <p className="leave-policy-subtitle">View and manage leave policy documents.</p>
                </div>
                <button className="upload-button" onClick={handleUploadClick}>
                    Upload Policy
                </button>
            </div>

            <div className="policy-category-grid">
                {policies.map((policy) => (
                    <div className="policy-category-card" key={policy.id}>
                        <div className="policy-category-header">
                            <h2 className="policy-category-name">{policy.name}</h2>
                            <div className="policy-category-icon">📄</div>
                        </div>
                        <p className="policy-category-description">{policy.description}</p>

                        {policy.documents.map((doc) => (
                            <div className="policy-document" key={doc.id}>
                                <div className="policy-document-header">
                                    <div>
                                        <h3 className="policy-document-title">{doc.title}</h3>
                                        <p className="policy-document-description">{doc.description}</p>
                                    </div>
                                    <div className="policy-document-actions">
                                        <button className="download-button">⬇️</button>
                                        <button className="delete-button">🗑️</button>
                                    </div>
                                </div>
                                <div className="policy-document-meta">
                                    <span>Uploaded by: {doc.uploadedBy}</span>
                                    <span>Date: {doc.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="upload-modal-overlay" onClick={handleCloseModal}>
                    <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="upload-modal-header">
                            <h2 className="upload-modal-title">Upload New Policy</h2>
                            <button className="close-modal-button" onClick={handleCloseModal}>✖️</button>
                        </div>
                        <form>
                            <div className="upload-form-group">
                                <label className="upload-form-label">Policy Name</label>
                                <input type="text" className="upload-form-input" placeholder="Enter policy name" />
                            </div>
                            <div className="upload-form-group">
                                <label className="upload-form-label">Description</label>
                                <textarea className="upload-form-textarea" placeholder="Enter description"></textarea>
                            </div>
                            <div className="upload-form-group">
                                <label className="upload-form-label">Upload File</label>
                                <input type="file" className="upload-form-input" />
                            </div>
                            <button type="submit" className="upload-submit-button">Upload</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeavePolicy;
