import React, { useState } from 'react';
import {
    GraduationCap,
    Users,
    Calendar,
    Clock,
    Award,
    Plus,
    BookOpen,
    FileText,
    Video,
    Link as LinkIcon,
    MoreVertical,
    CheckCircle,
    AlertCircle,
} from 'lucide-react';
import './TrainingAndLearning.css';

const TrainingAndLearning = () => {
    const [showAddTraining, setShowAddTraining] = useState(false);
    const [selectedTraining, setSelectedTraining] = useState(null);
    const [showParticipants, setShowParticipants] = useState(null);

    const summary = {
        activeTrainings: 5,
        completedTrainings: 12,
        totalParticipants: 45,
        upcomingSessions: 3,
    };

    const mockTrainings = [
        {
            id: '1',
            title: 'Advanced React Development',
            description: 'Master modern React concepts including hooks, context, and performance optimization',
            trainer: {
                id: 't1',
                name: 'Manager',
                expertise: 'Senior React Developer',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
            },
            startDate: '2025-02-01',
            endDate: '2025-03-15',
            duration: '6 weeks',
            status: 'In Progress',
            participants: [
                { id: 'e1', name: 'John Doe', department: 'Engineering', email: 'john@example.com', phone: '123-456-7890' },
                { id: 'e2', name: 'Jane Smith', department: 'Engineering', email: 'jane@example.com', phone: '123-456-7891' },
            ],
            progress: 65,
            resources: [
                { title: 'Course Material', url: '#', type: 'pdf' },
                { title: 'Video Lectures', url: '#', type: 'video' },
                { title: 'Additional Resources', url: '#', type: 'link' },
            ],
            certificationAvailable: true,
        },
        {
            id: '2',
            title: 'Cloud Architecture Fundamentals',
            description: 'Learn the basics of cloud architecture and AWS services',
            trainer: {
                id: 't2',
                name: 'Manager',
                expertise: 'Cloud Architect',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
            },
            startDate: '2025-03-01',
            endDate: '2025-04-15',
            duration: '6 weeks',
            status: 'Upcoming',
            participants: [
                { id: 'e3', name: 'Alice Johnson', department: 'DevOps', email: 'alice@example.com', phone: '123-456-7892' },
            ],
            progress: 0,
            resources: [
                { title: 'AWS Documentation', url: '#', type: 'link' },
                { title: 'Architecture Diagrams', url: '#', type: 'pdf' },
            ],
            certificationAvailable: true,
        },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'In Progress':
                return 'status-in-progress';
            case 'Completed':
                return 'status-completed';
            case 'Upcoming':
                return 'status-upcoming';
            default:
                return 'status-default';
        }
    };

    const getResourceIcon = (type) => {
        switch (type) {
            case 'pdf':
                return <FileText className="icon" />;
            case 'video':
                return <Video className="icon" />;
            case 'link':
                return <LinkIcon className="icon" />;
            default:
                return null;
        }
    };

    return (
        <div className="training-container">
            <div className="header-section">
                <div className="header-title">



                    <div className="page-header">
                        <h2 className="page-title">Training & Learning</h2>
                        <p className="page-description">
                            Enhance skills and track learning progress with tailored training programs.
                        </p>
                    </div>




                </div>
                <button
                    onClick={() => setShowAddTraining(true)}
                    className="add-training-btn"
                >
                    <Plus className="button-icon" />
                    Add Training
                </button>
            </div>

            <div className="summary-cards">
                <div className="summary-card active-trainings">
                    <p>Active Trainings</p>
                    <h2>{summary.activeTrainings}</h2>
                    <BookOpen className="card-icon" />
                </div>
                <div className="summary-card completed-trainings">
                    <p>Completed Training</p>
                    <h2>{summary.completedTrainings}</h2>
                    <CheckCircle className="card-icon" />
                </div>
                <div className="summary-card total-participants">
                    <p>Total Participants</p>
                    <h2>{summary.totalParticipants}</h2>
                    <Users className="card-icon" />
                </div>
                <div className="summary-card upcoming-sessions">
                    <p>Upcoming Sessions</p>
                    <h2>{summary.upcomingSessions}</h2>
                    <Calendar className="card-icon" />
                </div>
            </div>

            <div className="training-list">
                <h2>Current Training Programs</h2>
                {mockTrainings.map((training) => (
                    <div key={training.id} className="training-card">
                        <div className="training-header">
                            <h3>{training.title}</h3>
                            <span className={`training-status ${getStatusColor(training.status)}`}>
                                {training.status}
                            </span>
                        </div>
                        <p className="training-description">{training.description}</p>























                        {/* <div className="training-details">
                            <div>
                                <p>Trainer</p>
                                <div className="trainer-info">
                                    <img
                                        src={training.trainer.avatar}
                                        alt={training.trainer.name}
                                        className="trainer-avatar"
                                    />
                                    <span>{training.trainer.name}</span>
                                </div>
                            </div>
                            <div>
                                <p>Duration</p>
                                <span>{training.duration}</span>
                            </div>
                            <div>
                                <p>Participants</p>
                                <button
                                    onMouseEnter={() => setShowParticipants(training.id)}
                                    onMouseLeave={() => setShowParticipants(null)}
                                    className="participant-button"
                                >
                                    {training.participants.length} enrolled
                                </button>
                                {showParticipants === training.id && (
                                    <div className="participant-tooltip">
                                        {training.participants.map((participant) => (
                                            <div key={participant.id}>{participant.name}</div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div>
                                <p>Progress</p>
                                <div className="progress-bar">
                                    <div
                                        className="progress-filled"
                                        style={{ width: `${training.progress}%` }}
                                    ></div>
                                </div>
                                <span>{training.progress}%</span>
                            </div>
                        </div> */}




                        <div className="training-details-row">
                            <div className="training-detail-item">
                                <p className="detail-title">Trainer</p>
                                <div className="trainer-info">
                                    <img src={training.trainer.avatar} alt={training.trainer.name} className="trainer-avatar" />
                                    <p className="detail-value">{training.trainer.name}</p>
                                </div>
                            </div>

                            <div className="training-detail-item">
                                <p className="detail-title">Duration</p>
                                <div className='detail-value-container'>
                                    <p className="detail-value">{training.startDate}</p>
                                    <p className="detail-value">{training.endDate}</p>
                                </div>
                            </div>

                            <div className="training-detail-item">
                                <p className="detail-title">Participants</p>
                                <p className="detail-value">{training.participants.length} enrolled</p>
                            </div>

                            {/* <div className="training-detail-item">
                                <p className="detail-title">Progress</p>
                                <div className="progress-bar-container">
                                    <div className="progress-bar" style={{ width: `${training.progress}%` }} />
                                    <p className="progress-percentage">{training.progress}%</p>
                                </div>
                            </div> */}





                            <div className="training-detail-item">
                                <p className="detail-title">Progress</p>
                                <div className="progress-bar-container">
                                    <div className="progress-bar">
                                        <div className="progress-filled" style={{ width: `${training.progress}%` }} />
                                    </div>
                                    <p className="progress-percentage">{training.progress}%</p>
                                </div>
                            </div>
















                        </div>








                        <div className="training-resources">
                            {training.resources.map((resource, index) => (
                                <a key={index} href={resource.url} className="resource-link">
                                    {getResourceIcon(resource.type)}
                                    <span>{resource.title}</span>
                                </a>
                            ))}
                            {training.certificationAvailable && (
                                <div className="certification-available">
                                    <Award className="icon" />
                                    Certification Available
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {showAddTraining && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Add New Training Program</h3>
                            <button
                                onClick={() => setShowAddTraining(false)}
                                className="modal-close-btn"
                            >
                                <AlertCircle className="icon" />
                            </button>
                        </div>
                        <form>
                            <input type="text" placeholder="Program Title" />
                            <textarea placeholder="Program Description"></textarea>
                            <input type="date" />
                            <input type="date" />
                            <select>
                                <option>Select Trainer</option>
                                <option>Manager</option>
                                <option>Michael Chen</option>
                            </select>
                            <div>
                                <input type="checkbox" />
                                <label>Certification Available</label>
                            </div>
                            <div className="modal-actions">
                                <button onClick={() => setShowAddTraining(false)}>Cancel</button>
                                <button>Create Training</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrainingAndLearning;
