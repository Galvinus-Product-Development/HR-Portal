import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Play,
  CheckCircle,
  Users,
  Monitor,
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
  Award
} from 'lucide-react';
import './TrainingAndLearning.css';

export default function TrainingAndLearning() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');
  const [trainings, setTrainings] = useState([]);
  const [summary, setSummary] = useState({
    activeTrainings: 0,
    completedTrainings: 0,
    upcomingSessions: 0
  });

  useEffect(() => {
    fetchTrainingData();
  }, []);

  const fetchTrainingData = async () => {
    try {
      const response = await fetch('http://localhost:5004/trainings/FormattedTrainings');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();

      // Transform the admin training data to match employee portal format
      const transformedTrainings = data.trainings.map(training => ({
        id: training.id,
        name: training.title,
        trainer: training.trainer.name,
        startDate: training.startDate,
        endDate: training.endDate,
        duration: `${training.duration} weeks`,
        sessionTiming: 'Flexible',
        status: training.status,
        progress: training.progress || 0,
        description: training.description,
        resources: training.resources || [],
        certificationAvailable: training.certificationAvailable,
        mode: 'Online'
      }));

      setTrainings(transformedTrainings);
      setSummary({
        activeTrainings: data.summary.activeTrainings,
        completedTrainings: data.summary.completedTrainings,
        upcomingSessions: data.summary.upcomingSessions
      });
    } catch (error) {
      console.error('Error fetching training data:', error);
    }
  };

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

  const filteredPrograms = trainings.filter(program => {
    switch (activeTab) {
      case 'active':
        return program.status === 'In Progress';
      case 'completed':
        return program.status === 'Completed';
      case 'upcoming':
        return program.status === 'Upcoming';
      default:
        return true;
    }
  });

  return (
    <div className='emp'>
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
              <p className="training-stat-value">{summary.activeTrainings}</p>
            </div>
            <div className="training-icon-wrapper active-icon">
              <BookOpen className="training-icon" />
            </div>
          </div>
        </div>

        <div className="training-stat-card">
          <div className="training-stat-content">
            <div>
              <p className="training-stat-label">Completed Trainings</p>
              <p className="training-stat-value">{summary.completedTrainings}</p>
            </div>
            <div className="training-icon-wrapper completed-icon">
              <CheckCircle className="training-icon" />
            </div>
          </div>
        </div>

        <div className="training-stat-card">
          <div className="training-stat-content">
            <div>
              <p className="training-stat-label">Upcoming Trainings</p>
              <p className="training-stat-value">{summary.upcomingSessions}</p>
            </div>
            <div className="training-icon-wrapper upcoming-icon">
              <Clock className="training-icon" />
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
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`training-tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
          >
            Upcoming Trainings
          </button>
        </div>

        <div className="training-program-list">
          {filteredPrograms.map((program) => (
            <div
              key={program.id}
              className="training-program-card"
              onClick={() => navigate(`${program.id}`)}
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
                  <span>{program.startDate}</span>
                  <span>{program.endDate}</span>
                </div>
                <div className="training-detail-item">
                  <Clock className="detail-icon" />
                  <span>{program.sessionTiming}</span>
                </div>
              </div>

              {program.status !== 'Upcoming' && (
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

              {program.certificationAvailable && (
                <div className="certification-badge">
                  <Award className="certification-icon" />
                  <span>Certification Available</span>
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
    </div>
  );
}