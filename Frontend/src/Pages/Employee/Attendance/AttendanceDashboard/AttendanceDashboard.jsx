import React, { useState } from 'react';
import './AttendanceDashboard.css';

const AttendanceDashboard = () => {
  const [currentMonth, setCurrentMonth] = useState('February 2025');
  const [attendanceData, setAttendanceData] = useState({
    January: {
      totalDays: 31,
      presentDays: 22,
      absentDays: 3,
      halfDays: 2,
      paidLeaves: 1,
      unpaidLeaves: 1,
      overtime: '7 hours',
      days: [
        { day: 1, status: 'present', login: '9:00 AM', logout: '5:00 PM' },
        { day: 2, status: 'absent' },
        { day: 3, status: 'leave' },
        { day: 4, status: 'holiday' },
        { day: 5, status: 'present', login: '9:15 AM', logout: '5:15 PM' },
        { day: 6, status: 'absent' },
        { day: 7, status: 'present', login: '9:00 AM', logout: '5:00 PM' },
        { day: 8, status: 'holiday' },
        // More days...
      ],
    },
    February: {
      totalDays: 28,
      presentDays: 18,
      absentDays: 2,
      halfDays: 1,
      paidLeaves: 1,
      unpaidLeaves: 0,
      overtime: '5 hours',
      days: [
        { day: 1, status: 'present', login: '9:15 AM', logout: '5:30 PM' },
        { day: 2, status: 'absent' },
        { day: 3, status: 'leave' },
        { day: 4, status: 'holiday' },
        { day: 5, status: 'present', login: '9:00 AM', logout: '5:00 PM' },
        { day: 6, status: 'present', login: '9:00 AM', logout: '5:00 PM' },
        { day: 7, status: 'holiday' },
        { day: 8, status: 'absent' },
        { day: 9, status: 'leave' },
        { day: 10, status: 'present', login: '9:00 AM', logout: '5:00 PM' },
        // More days...
      ],
    },
    March: {
      totalDays: 31,
      presentDays: 20,
      absentDays: 5,
      halfDays: 3,
      paidLeaves: 2,
      unpaidLeaves: 1,
      overtime: '10 hours',
      days: [
        { day: 1, status: 'present', login: '9:00 AM', logout: '5:00 PM' },
        { day: 2, status: 'absent' },
        { day: 3, status: 'leave' },
        { day: 4, status: 'holiday' },
        { day: 5, status: 'present', login: '9:00 AM', logout: '5:00 PM' },
        { day: 6, status: 'absent' },
        { day: 7, status: 'present', login: '9:15 AM', logout: '5:00 PM' },
        { day: 8, status: 'leave' },
        { day: 9, status: 'holiday' },
        { day: 10, status: 'present', login: '9:00 AM', logout: '5:00 PM' },
        // More days...
      ],
    },
    April: {
      totalDays: 30,
      presentDays: 19,
      absentDays: 6,
      halfDays: 4,
      paidLeaves: 1,
      unpaidLeaves: 1,
      overtime: '8 hours',
      days: [
        { day: 1, status: 'present', login: '9:00 AM', logout: '5:00 PM' },
        { day: 2, status: 'absent' },
        { day: 3, status: 'leave' },
        { day: 4, status: 'holiday' },
        { day: 5, status: 'present', login: '9:00 AM', logout: '5:00 PM' },
        { day: 6, status: 'holiday' },
        { day: 7, status: 'present', login: '9:00 AM', logout: '5:00 PM' },
        { day: 8, status: 'absent' },
        { day: 9, status: 'present', login: '9:00 AM', logout: '5:30 PM' },
        { day: 10, status: 'halfday' },
        // More days...
      ],
    },
    May: {
      totalDays: 31,
      presentDays: 21,
      absentDays: 4,
      halfDays: 2,
      paidLeaves: 1,
      unpaidLeaves: 0,
      overtime: '12 hours',
      days: [
        { day: 1, status: 'present', login: '9:00 AM', logout: '5:00 PM' },
        { day: 2, status: 'absent' },
        { day: 3, status: 'present', login: '9:15 AM', logout: '5:30 PM' },
        { day: 4, status: 'holiday' },
        { day: 5, status: 'leave' },
        { day: 6, status: 'present', login: '9:00 AM', logout: '5:00 PM' },
        { day: 7, status: 'holiday' },
        { day: 8, status: 'absent' },
        { day: 9, status: 'present', login: '9:00 AM', logout: '5:00 PM' },
        { day: 10, status: 'halfday' },
        // More days...
      ],
    },
  });

  const changeMonth = (direction) => {
    const monthOrder = ['January', 'February', 'March', 'April', 'May'];
    const currentIndex = monthOrder.indexOf(currentMonth.split(' ')[0]);
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

    if (newIndex >= 0 && newIndex < monthOrder.length) {
      setCurrentMonth(`${monthOrder[newIndex]} 2025`);
    }
  };

  const renderCalendarDays = () => {
    const monthName = currentMonth.split(' ')[0];
    const days = attendanceData[monthName]?.days || [];
    return days.map((day, index) => {
      let classNames = 'calendar-day';
      let content = day.day;
      let attendanceTag = '';
      let timeInfo = '';

      switch (day.status) {
        case 'present':
          classNames += ' present';
          attendanceTag = 'Present';
          timeInfo = `Login: ${day.login} | Logout: ${day.logout}`;
          break;
        case 'absent':
          classNames += ' absent';
          attendanceTag = 'Absent';
          break;
        case 'leave':
          classNames += ' leave';
          attendanceTag = 'Leave';
          break;
        case 'holiday':
          classNames += ' holiday';
          attendanceTag = 'Holiday';
          break;
        case 'halfday':
          classNames += ' halfday';
          attendanceTag = 'Half Day';
          break;
        default:
          break;
      }

      return (
        <div key={index} className={classNames}>
          <span>{content}</span>
          <div className="attendance-tag">{attendanceTag}</div>
          {timeInfo && <div className="time-info">{timeInfo}</div>}
        </div>
      );
    });
  };

  return (
    <div className="attendance-dashboard-container">
      <div className="attendance-dashboard-header">
        {/* <h3>Attendance Dashboard</h3> */}
      </div>

      <div className="attendance-dashboard-stats">
        {/* Display the stats as before */}
      </div>

      <div className="attendance-calendar-container">
        <div className="attendance-calendar">
          <div className="calendar-header">
            <span className="month-year">{currentMonth}</span>
            <div className="calendar-navigation">
              <button onClick={() => changeMonth('prev')} className="calendar-nav-button">Previous</button>
              <button onClick={() => changeMonth('next')} className="calendar-nav-button">Next</button>
            </div>
          </div>

          <div className="calendar-days">
            {renderCalendarDays()}
          </div>
        </div>
      </div>

      <div className="attendance-dashboard-footer">
        <p>&copy; 2025 HR System. All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default AttendanceDashboard;
