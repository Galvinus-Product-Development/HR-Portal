import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TrainingAndLearning.css';
import { Play, CheckCircle, Users, Monitor, Calendar, Clock, ArrowRight } from 'lucide-react';

export default function TrainingAndLearning() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');

  const trainingPrograms = [
    {
      id: '1',
      name: 'React Best Practices and Advanced Patterns',
      trainer: 'Team Lead',
      // mode: 'Online',
      startDate: '2024-03-15',
      endDate: '2024-04-15',
      duration: '30 days',
      sessionTiming: 'Flexible',
      status: 'In Progress',
      progress: 50,
      description: 'Learn advanced React patterns and best practices for building scalable applications'
    },
    {
      id: '2',
      name: 'Cloud Architecture Fundamentals',
      trainer: 'Team Lead',
      // mode: 'Online',
      startDate: '2024-03-20',
      endDate: '2024-04-20',
      duration: '30 days',
      sessionTiming: 'Flexible',
      status: 'Not Started',
      progress: 0,
      description: 'Understanding cloud architecture principles and best practices'
    },
    {
      id: '3',
      name: 'Agile Development Workshop',
      trainer: 'Team Lead',
      // mode: 'Online',
      startDate: '2024-02-01',
      endDate: '2024-02-28',
      duration: '28 days',
      sessionTiming: 'Flexible',
      status: 'Completed',
      progress: 100,
      description: 'Master Agile methodologies and Scrum practices'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="training-status-icon-completed" />;
      case 'In Progress':
        return <Play className="training-status-icon-progress" />;
      default:
        return <Clock className="training-status-icon-notstarted" />;
    }
  };

  const filteredPrograms = trainingPrograms.filter(program =>
    activeTab === 'active'
      ? program.status !== 'Completed'
      : program.status === 'Completed'
  );

  return (
    <div className="training-container">
      <div className="training-header">
        <h1 className="training-title">Training & Learning</h1>
        <p className="training-subtitle">Access your assigned training programs</p>
      </div>

      <div className="training-stats-grid">
        <div className="training-stat-card">
          <div className="training-stat-content">
            <div>
              <p className="training-stat-label">Active Trainings</p>
              <p className="training-stat-value">
                {trainingPrograms.filter(p => p.status === 'In Progress').length}
              </p>
            </div>
            <div className="training-icon-wrapper active-icon">
              <Play className="training-icon" />
            </div>
          </div>
        </div>

        <div className="training-stat-card">
          <div className="training-stat-content">
            <div>
              <p className="training-stat-label">Completed Trainings</p>
              <p className="training-stat-value">
                {trainingPrograms.filter(p => p.status === 'Completed').length}
              </p>
            </div>
            <div className="training-icon-wrapper completed-icon">
              <CheckCircle className="training-icon" />
            </div>
          </div>
        </div>
      </div>

      <div className="training-list-container">
        <div className="training-tabs">
          <button
            onClick={() => setActiveTab('active')}
            className={`training-tab-btn ${activeTab === 'active' ? 'active' : ''}`}
          >
            Active Trainings
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`training-tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
          >
            Completed Trainings
          </button>
        </div>

        <div className="training-program-list">
          {filteredPrograms.map((program) => (
            <div
              key={program.id}
              className="training-program-card"
              onClick={() => navigate(`/training/${program.id}`)}
            >
              <div className="training-program-header">
                <h3 className="program-name">{program.name}</h3>
                {getStatusIcon(program.status)}
              </div>

              <p className="program-description">{program.description}</p>

              <div className="training-details-grid">
                <div className="training-detail-item">
                  <Users className="detail-icon" />
                  <span>{program.trainer}</span>
                </div>
                <div className="training-detail-item">
                  <Monitor className="detail-icon" />
                  <span>{program.mode}</span>
                </div>
                <div className="training-detail-item">
                  <Calendar className="detail-icon" />
                  <span>{program.duration}</span>
                </div>
                <div className="training-detail-item">
                  <Clock className="detail-icon" />
                  <span>{program.sessionTiming}</span>
                </div>
              </div>

              {program.status !== 'Not Started' && (
                <div className="training-progress-section">
                  <div className="progress-labels">
                    <span>Progress</span>
                    <span>{program.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${program.progress}%` }}
                    />
                  </div>
                </div>
              )}

              <button className="view-details-btn">
                View Details <ArrowRight className="arrow-icon" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
