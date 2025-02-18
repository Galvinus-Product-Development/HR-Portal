import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import './AttendanceTracker.css';

export default function AttendanceTracker() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const handlePreviousMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1));
  };

  const generateAttendanceRecords = () => {
    const records = [];
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        const isLate = Math.random() > 0.7;
        const checkInTime = isLate
          ? `${10 + Math.floor(Math.random() * 2)}:${35 + Math.floor(Math.random() * 25)} AM`
          : `${10}:${Math.floor(Math.random() * 5) + 25} AM`;

        records.push({
          date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          checkIn: checkInTime,
          checkOut: `${7 + Math.floor(Math.random() * 2)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} PM`,
          status: isLate ? 'late' : 'on-time',
          workingHours: '9h 30m',
        });
      }
    }
    return records;
  };

  const attendanceRecords = generateAttendanceRecords();

  const handleDownloadReport = () => {
    let csvContent = 'Date,Status,Check In,Check Out,Working Hours,Overtime\n';
    attendanceRecords.forEach(record => {
      csvContent += `${record.date},${record.status === 'on-time' ? 'On Time' : 'Late'},${record.checkIn},${record.checkOut},${record.workingHours},${Math.random() > 0.7 ? '1h 30m' : '-'}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Attendance_Report_${selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}.csv`;
    link.click();
  };

  return (
    <div className="attendance-tracker-container">
      <div className="attendance-tracker-header">
        <div className="attendance-tracker-nav">
          <button onClick={handlePreviousMonth} className="attendance-tracker-nav-btn">
            <ChevronLeft className="attendance-tracker-icon" />
          </button>
          <span className="attendance-tracker-month">
            {selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={handleNextMonth} className="attendance-tracker-nav-btn">
            <ChevronRight className="attendance-tracker-icon" />
          </button>
        </div>
        {/* <button className="attendance-tracker-download-btn" onClick={handleDownloadReport}>
          <Download className="attendance-tracker-download-icon" />
          Download Report
        </button> */}
      </div>

      <div className="attendance-tracker-table-wrapper">
        <table className="attendance-tracker-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Working Hours</th>
              <th>Overtime</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.map((record, index) => (
              <tr key={index}>
                <td>{record.date}</td>
                <td>
                  <span className={`attendance-tracker-status ${record.status === 'on-time' ? 'on-time' : 'late'}`}>
                    {record.status === 'on-time' ? 'On Time' : 'Late'}
                  </span>
                </td>
                <td>{record.checkIn}</td>
                <td>{record.checkOut}</td>
                <td>{record.workingHours}</td>
                <td>{Math.random() > 0.7 ? '1h 30m' : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
