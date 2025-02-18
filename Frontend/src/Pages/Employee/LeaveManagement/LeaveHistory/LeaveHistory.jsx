import React, { useState } from 'react';
import { ChevronDown, Download } from 'lucide-react';
import './LeaveHistory.css';

const LeaveHistory = () => {
  const [selectedMonth, setSelectedMonth] = useState('2024-03');

  const leaveHistory = [
    {
      id: '1',
      date: '2024-03-15',
      type: 'CL',
      reason: 'Personal work',
      duration: 1,
      status: 'approved',
      attachments: ['document1.pdf'],
    },
    {
      id: '2',
      date: '2024-03-10',
      type: 'SL',
      reason: 'Not feeling well',
      duration: 2,
      status: 'approved',
      attachments: ['medical_certificate.pdf'],
    },
    {
      id: '3',
      date: '2024-03-05',
      type: 'Comp-off',
      reason: 'Worked on weekend',
      duration: 1,
      status: 'rejected',
    },
    {
      id: '4',
      date: '2024-03-01',
      type: 'CL',
      reason: 'Family function',
      duration: 3,
      status: 'pending',
    },
  ];

  const getMonthOptions = () => {
    const options = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      options.push({ value, label, key: `${value}-${i}` });
    }
    return options;
  };

  return (
    <div className="leave-history-container">
      <div className="leave-history-header">
        <h2 className="leave-history-title">Leave History</h2>
        <div className="leave-history-select-wrapper">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="leave-history-select"
          >
            {getMonthOptions().map((option) => (
              <option key={option.key} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="leave-history-dropdown-icon" />
        </div>
      </div>

      <div className="leave-history-table-container">
        <table className="leave-history-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Leave Type</th>
              <th>Reason</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Attachments</th>
            </tr>
          </thead>
          <tbody>
            {leaveHistory.map((record) => (
              <tr key={record.id}>
                <td>{new Date(record.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                <td>
                  <span className={`leave-type-badge ${record.type.toLowerCase()}`}>{record.type}</span>
                </td>
                <td>{record.reason}</td>
                <td>{record.duration} {record.duration === 1 ? 'day' : 'days'}</td>
                <td>
                  <span className={`leave-status-badge ${record.status}`}>{record.status.charAt(0).toUpperCase() + record.status.slice(1)}</span>
                </td>
                <td>
                  {record.attachments && record.attachments.length > 0 ? (
                    <button className="leave-history-attachment">
                      <Download className="leave-history-attachment-icon" />
                      View
                    </button>
                  ) : (
                    <span className="leave-history-no-attachment">None</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveHistory;
