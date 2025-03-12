import React, { useState, useEffect } from 'react';
import './LeavePolicy.css';

const LeavePolicy = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Simplified form state with only name and type.
    const [newPolicy, setNewPolicy] = useState({
        name: '',
        type: ''
    });
    const [file, setFile] = useState(null);

    // Fetch policies when the component mounts.
    useEffect(() => {
        fetchPolicies();
    }, []);

    const fetchPolicies = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5005/api/leave-policies');
            if (!response.ok) {
                throw new Error('Failed to fetch policies');
            }
            const data = await response.json();
            
            // Transform backend data for the frontend.
            const formattedPolicies = data.map(policy => {
                const fileName = policy.documentUrl ? policy.documentUrl.split('/').pop() : 'Document';
                return {
                    id: policy.id,
                    name: policy.policyName,
                    type: policy.policyCategory,
                    document: {
                        title: fileName,
                        url: policy.documentUrl,
                        date: policy.createdAt 
                            ? new Date(policy.createdAt).toLocaleDateString() 
                            : new Date().toLocaleDateString(),
                        uploadedBy: 'Admin'
                    }
                };
            });
            
            setPolicies(formattedPolicies);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching policies:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePolicy = async (id) => {
        try {
            const response = await fetch(`http://localhost:5005/api/leave-policies/${id}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete policy');
            }
            
            setPolicies(policies.filter(policy => policy.id !== id));
        } catch (err) {
            setError(err.message);
            console.error('Error deleting policy:', err);
        }
    };

    const handleUploadClick = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        setIsModalOpen(false);
        // Reset form state
        setNewPolicy({
            name: '',
            type: ''
        });
        setFile(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPolicy({
            ...newPolicy,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const formData = new FormData();
            formData.append('name', newPolicy.name);
            formData.append('type', newPolicy.type);
            
            if (file) {
                formData.append('policyFile', file);
            }

            const response = await fetch('http://localhost:5005/api/leave-policies/upload', {
                method: 'POST',
                body: formData,
            });
            
            if (!response.ok) {
                throw new Error('Failed to create policy');
            }
            
            const data = await response.json();
            
            const fileName = data.documentUrl ? data.documentUrl.split('/').pop() : 'Document';
            const newPolicyWithId = {
                id: data.id,
                name: data.policyName,
                type: data.policyCategory,
                document: {
                    title: fileName,
                    url: data.documentUrl,
                    date: data.createdAt 
                        ? new Date(data.createdAt).toLocaleDateString() 
                        : new Date().toLocaleDateString(),
                    uploadedBy: 'Admin'
                }
            };
            
            setPolicies([...policies, newPolicyWithId]);
            handleCloseModal();
        } catch (err) {
            setError(err.message);
            console.error('Error creating policy:', err);
        }
    };

    const handleDownload = (policyId) => {
        window.open(`http://localhost:5005/api/leave-policies/${policyId}/download`, '_blank');
    };

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

            {error && <div className="error-message">Error: {error}</div>}
            
            {loading ? (
                <div className="loading-message">Loading policies...</div>
            ) : (
                <div className="policy-category-grid">
                    {policies.length === 0 ? (
                        <div className="no-policies-message">No policies found. Click "Upload Policy" to add one.</div>
                    ) : (
                        policies.map((policy) => (
                            <div className="policy-category-card" key={policy.id}>
                                <div className="policy-category-header">
                                    <h2 className="policy-category-name">{policy.name}</h2>
                                    <div className="policy-category-icon">📄</div>
                                </div>

                                <div className="policy-document">
                                    <div className="policy-document-header">
                                        <div>
                                            <h3 className="policy-document-title">{policy.document.title}</h3>
                                            <p className="policy-document-description">Category: {policy.type}</p>
                                        </div>
                                        <div className="policy-document-actions">
                                            <button 
                                                className="download-button"
                                                onClick={() => handleDownload(policy.id)}
                                            >
                                                ⬇️
                                            </button>
                                            <button 
                                                className="delete-button"
                                                onClick={() => handleDeletePolicy(policy.id)}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                    <div className="policy-document-meta">
                                        <span>Uploaded by: {policy.document.uploadedBy}</span>
                                        <span>Date: {policy.document.date}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {isModalOpen && (
                <div className="upload-modal-overlay" onClick={handleCloseModal}>
                    <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="upload-modal-header">
                            <h2 className="upload-modal-title">Upload New Policy</h2>
                            <button className="close-modal-button" onClick={handleCloseModal}>✖️</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="upload-form-group">
                                <label className="upload-form-label">Policy Name</label>
                                <input 
                                    type="text" 
                                    name="name"
                                    value={newPolicy.name}
                                    onChange={handleInputChange}
                                    className="upload-form-input" 
                                    placeholder="Enter policy name" 
                                    required
                                />
                            </div>
                            <div className="upload-form-group">
                                <label className="upload-form-label">Policy Type</label>
                                <input 
                                    type="text" 
                                    name="type"
                                    value={newPolicy.type}
                                    onChange={handleInputChange}
                                    className="upload-form-input" 
                                    placeholder="Enter policy type" 
                                    required
                                />
                            </div>
                            <div className="upload-form-group">
                                <label className="upload-form-label">Upload File (PDF only)</label>
                                <input 
                                    type="file" 
                                    name="policyFile"
                                    onChange={handleFileChange}
                                    className="upload-form-input" 
                                    accept="application/pdf"
                                    required
                                />
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
