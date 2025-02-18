import React from 'react';
import { FaFileAlt, FaDownload } from 'react-icons/fa';
import './LeavePolicy.css';

const LeavePolicy = () => {
  const policies = [
    {
      id: 1,
      name: 'Casual Leave',
      description: 'Policies related to casual leave entitlements.',
      documents: [
        {
          id: 1,
          title: 'Casual Leave Policy 2025',
          description: 'Guidelines for casual leave.',
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

  return (
    <div className="leave-policy-container">
      <div className="leave-policy-header">
        <div>
          <h2 className="leave-policy-title">Leave Policies</h2>
          <p className="leave-policy-subtitle">View and manage leave policy documents.</p>
        </div>
      </div>

      <div className="policy-category-grid">
        {policies.map((policy) => (
          <div className="policy-category-card" key={policy.id}>
            <div className="policy-category-header">
              <h2 className="policy-category-name">{policy.name}</h2>
              <div className="policy-category-icon">
                <FaFileAlt />
              </div>
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
                    <button className="download-button">
                      <FaDownload />
                    </button>
                  </div>
                </div>
                <div className="policy-document-footer">
                  <p className="uploaded-by">Uploaded by: {doc.uploadedBy}</p>
                  <p className="upload-date">Date: {doc.date}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeavePolicy;
