import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, GraduationCap, Users, Calendar, Clock, Award,
    FileText, Video, Link as LinkIcon, CheckCircle, BookOpen
} from 'lucide-react';
import './TrainingDetails.css';

const TrainingDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [training, setTraining] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTraining = async () => {
            try {
                console.log("This is admin side Id:-", id);
                const response = await fetch(`http://localhost:5004/trainings/FormattedTrainingById/${id}`);
                if (!response.ok) throw new Error("Failed to fetch training details.");
                const data = await response.json();
                console.log("adfasfafadssdasdfad", data);
                setTraining(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTraining();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!training) return <div>Training not found</div>;

    const getResourceIcon = (type) => {
        switch (type) {
            case 'pdf': return <FileText className="training-details-icon" />;
            case 'video': return <Video className="training-details-icon" />;
            case 'link': return <LinkIcon className="training-details-icon" />;
            default: return null;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'In Progress': return 'training-details-status-progress';
            case 'Completed': return 'training-details-status-completed';
            case 'Upcoming': return 'training-details-status-upcoming';
            default: return 'training-details-status-default';
        }
    };

    return (
        <div className="training-details-container">
            <div className="training-details-header">
                <button onClick={() => navigate('/training')} className="training-details-back-button">
                    <ArrowLeft className="training-details-icon" />
                    Back to Training List
                </button>
            </div>

            <div className="training-details-overview">
                <div className="training-details-overview-header">
                    <div>
                        <h1 className="training-details-title">{training?.title}</h1>
                        <p className="training-details-description">{training?.description}</p>
                    </div>
                    <span className={`training-details-status ${getStatusColor(training?.status)}`}>
                        {training?.status}
                    </span>
                </div>

                <div className="training-details-grid">
                    <div className="training-details-trainer">
                        <p className="training-details-label">Trainer</p>
                        <div className="training-details-trainer-info">
                            <img
                                src={training?.trainer.avatar}
                                alt={training?.title}
                                className="training-details-avatar"
                            />
                            <div className="training-details-trainer-text">
                                <p className="training-details-trainer-name">{training?.trainer.name}</p>
                                <p className="training-details-trainer-expertise">{training?.trainer.expertise}</p>
                            </div>
                        </div>
                    </div>

                    <div className="training-details-duration">
                        <p className="training-details-label">Duration</p>
                        <div className="training-details-info">
                            <Clock className="training-details-icon" />
                            <p>{training.startDate}</p>
                            <p>{training.endDate}</p>
                        </div>
                    </div>

                    <div className="training-details-dates">
                        <p className="training-details-label">Dates</p>
                        <div className="training-details-info">
                            <Calendar className="training-details-icon" />
                            <p>
                                {new Date(training.startDate).toLocaleDateString()} -
                                {new Date(training.endDate).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    <div className="training-details-progress">
                        <p className="training-details-label">Progress</p>
                        <div className="training-details-progress-bar-container">
                            <div className="training-details-progress-bar">
                                <div className="training-details-progress-fill" style={{ width: `${training.progress}%` }} />
                            </div>
                            <p className="training-details-progress-text">{training.progress}% Complete</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="training-details-content-grid">
                <div className="training-details-main-content">
                    {/* Resources */}
                    <div className="training-details-section">
                        <h2 className="training-details-section-title">
                            <BookOpen className="training-details-icon" />
                            Course Resources
                        </h2>
                        <div className="training-details-resources">
                            {training.resources.map((resource, index) => (
                                <a key={index} href={resource.url} className="training-details-resource">
                                    {getResourceIcon(resource.type)}
                                    <span>{resource.title}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="training-details-sidebar">
                    {/* Participants */}
                    <div className="training-details-section">
                        <h2 className="training-details-section-title">
                            <Users className="training-details-icon" />
                            Participants ({training.participants?.length})
                        </h2>
                        <div className="training-details-participants">
                            {training?.participants?.map((participant) => (
                                <div key={participant.id} className="training-details-participant">
                                    <div>
                                        <p className="training-details-participant-name">{participant.name}</p>
                                        <p className="training-details-participant-dept">{participant.department}</p>
                                    </div>
                                    <div className="training-details-participant-email">
                                        {participant.email}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Certification */}
                    {training.certificationAvailable && (
                        <div className="training-details-section">
                            <div className="training-details-certification-header">
                                <h2 className="training-details-section-title">
                                    <Award className="training-details-icon" />
                                    Certification
                                </h2>
                                <span className="training-details-certification-status">
                                    <CheckCircle className="training-details-icon" />
                                    Available
                                </span>
                            </div>
                            <p className="training-details-certification-text">
                                Complete this training to earn a certification in {training.title}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrainingDetails;
