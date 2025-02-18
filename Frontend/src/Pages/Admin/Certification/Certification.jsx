import React, { useState } from 'react';
import { format } from 'date-fns';
import { Award, Building, Filter } from 'lucide-react';
import '../Certification/Certification.css'

const Certification = () => {
    const [selectedCertificate, setSelectedCertificate] = useState(null);
    const [filters, setFilters] = useState({
        department: '',
        training: ''
    });

    // Mock data
    const mockCertifications = [
        {
            id: '1',
            employee_id: 'emp1',
            certification_id: 'cert1',
            issue_date: '2024-03-01',
            expiry_date: '2025-03-01',
            certificate_file: 'https://example.com/cert1.pdf',
            badge_visibility: true,
            certification: {
                id: 'cert1',
                name: 'AWS Solutions Architect',
                issuer: 'Amazon Web Services',
                type: 'Technical'
            },
            employee: {
                id: 'EMP001',
                name: 'Salma Shirin',
                department: 'Engineering'
            },
            training: {
                name: 'Cloud Architecture Fundamentals',
                completedDate: '2024-02-28'
            }
        },
        {
            id: '2',
            employee_id: 'emp2',
            certification_id: 'cert2',
            issue_date: '2024-02-15',
            certificate_file: 'https://example.com/cert2.pdf',
            badge_visibility: true,
            certification: {
                id: 'cert2',
                name: 'Scrum Master',
                issuer: 'Scrum Alliance',
                type: 'Management'
            },
            employee: {
                id: 'EMP002',
                name: 'Bhaskar R',
                department: 'Product'
            },
            training: {
                name: 'Agile Project Management',
                completedDate: '2024-02-14'
            }
        }
    ];

    const departments = Array.from(new Set(mockCertifications.map(cert => cert.employee.department)));
    const trainings = Array.from(new Set(mockCertifications.map(cert => cert.training.name)));

    const filteredCertifications = mockCertifications.filter(cert => {
        return (
            (!filters.department || cert.employee.department === filters.department) &&
            (!filters.training || cert.training.name === filters.training)
        );
    });

    const CertificateModal = ({ cert }) => (
        <div className="certification-modal">
            <div className="certification-modal-content">
                <div className="certification-header">
                    <div>
                        <h3 className="certification-title">{cert.certification.name}</h3>
                        <p className="certification-issuer">Issued by {cert.certification.issuer}</p>
                    </div>
                    <button
                        onClick={() => setSelectedCertificate(null)}
                        className="certification-close-btn"
                    >
                        ×
                    </button>
                </div>

                <div className="certification-body">
                    <div className="certification-image">
                        <Award className="certification-icon" />
                    </div>

                    <div className="certification-details">
                        <div className="employee-info">
                            <h4>Employee Details</h4>
                            <div className="employee-details">
                                <p className="employee-name">{cert.employee.name}</p>
                                <p className="employee-id">ID: {cert.employee.id}</p>
                                <p className="employee-department">Department: {cert.employee.department}</p>
                            </div>
                        </div>

                        <div className="training-info">
                            <h4>Training Program</h4>
                            <div className="training-details">
                                <p className="training-name">{cert.training.name}</p>
                                <p className="training-date">
                                    Completed: {format(new Date(cert.training.completedDate), 'dd MMM yyyy')}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="certificate-info">
                        <h4>Certificate Details</h4>
                        <div className="certificate-details">
                            <p><span className="font-bold">Issue Date:</span> {format(new Date(cert.issue_date), 'dd MMM yyyy')}</p>
                            {cert.expiry_date && (
                                <p><span className="font-bold">Expiry Date:</span> {format(new Date(cert.expiry_date), 'dd MMM yyyy')}</p>
                            )}
                            <p><span className="font-bold">Type:</span> {cert.certification.type}</p>
                        </div>
                    </div>

                    <div className="badge-status">
                        <h4>Badge Status</h4>
                        <div className="badge-status-info">
                            <Award className={`badge-icon ${cert.badge_visibility ? 'visible' : 'hidden'}`} />
                            <span className="badge-status-text">
                                {cert.badge_visibility ? 'Visible in profile' : 'Hidden from profile'}
                            </span>
                        </div>
                    </div>

                    <div className="certification-actions">
                        <button
                            onClick={() => window.open(cert.certificate_file, '_blank')}
                            className="download-btn"
                        >
                            Download Certificate
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="certifications-page">
            <div className="certifications-container">
                <div className="page-header">
                    <h2 className="page-title">Certifications & Badges</h2>
                    <p className="page-description">
                        View and manage certificates issued upon training completion
                    </p>
                </div>

                {/* Filters */}
                <div className="filters">
                    <div className="filter-item">
                        <label className="filter-label">
                            <Building className="filter-icon" />
                            Department
                        </label>
                        <select
                            value={filters.department}
                            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                            className="filter-select"
                        >
                            <option value="">All Departments</option>
                            {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-item">
                        <label className="filter-label">
                            <Filter className="filter-icon" />
                            Training Program
                        </label>
                        <select
                            value={filters.training}
                            onChange={(e) => setFilters({ ...filters, training: e.target.value })}
                            className="filter-select"
                        >
                            <option value="">All Programs</option>
                            {trainings.map(training => (
                                <option key={training} value={training}>{training}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Certificates List */}
                <div className="certifications-list">
                    <table className="certifications-table">
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Department</th>
                                <th>Training Program</th>
                                <th>Certificate</th>
                                <th>Issue Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCertifications.map((cert) => (
                                <tr key={cert.id}>
                                    <td>{cert.employee.name}</td>
                                    <td>{cert.employee.department}</td>
                                    <td>{cert.training.name}</td>
                                    <td>
                                        <Award className={`badge-icon ${cert.badge_visibility ? 'visible' : 'hidden'}`} />
                                        {cert.certification.name}
                                    </td>
                                    <td>{format(new Date(cert.issue_date), 'dd MMM yyyy')}</td>
                                    <td>
                                        <button
                                            onClick={() => setSelectedCertificate(cert)}
                                            className="view-btn"
                                        >
                                            View Certificate
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {selectedCertificate && <CertificateModal cert={selectedCertificate} />}
            </div>
        </div>
    );
};

export default Certification;
