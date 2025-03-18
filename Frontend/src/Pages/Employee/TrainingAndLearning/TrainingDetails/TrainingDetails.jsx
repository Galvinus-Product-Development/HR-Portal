import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Users,
  Monitor,
  Calendar,
  Clock,
  Play,
  CheckCircle,
  FileText,
  Link as LinkIcon,
  Video,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import "./TrainingDetails.css";

export default function TrainingDetails() {
  const { id } = useParams();
  const [training, setTraining] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrainingDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5004/trainings/${id}`);
        if (!response.ok) throw new Error("Failed to fetch training details");
        const data = await response.json();
        console.log(data);
        setTraining(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainingDetails();
  }, [id]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    training?.participants?.map((participant) => {
      if (participant.id == userId) {
        setIsEnrolled(true);
      }
    });
  }, [training]);

  // const handleEnroll = () => setIsEnrolled(true);

  const handleEnroll = async () => {
    try {
      // const participantEmail = 'johndoe@example.com';
      const signedUserId = localStorage.getItem("signedUserId");
      const response = await fetch(`http://localhost:5004/enroll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ trainingId: id, signedUserId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to enroll");
      }

      // Update state after successful enrollment
      setIsEnrolled(true);
    } catch (error) {
      console.error("Enrollment Error:", error);
    }
  };

  const getResourceIcon = (type) => {
    switch (type) {
      case "video":
        return <Video className="td-icon-red" />;
      case "document":
        return <FileText className="td-icon-blue" />;
      case "meeting":
        return <LinkIcon className="td-icon-green" />;
      default:
        return null;
    }
  };

  const getResourceTypeLabel = (type) => {
    switch (type) {
      case "video":
        return "Video Tutorial";
      case "document":
        return "Documentation";
      case "meeting":
        return "Live Session";
      default:
        return "";
    }
  };

  if (loading) return <p>Loading training details...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="td-container">
      <div className="td-header">
        <div>
          <h1 className="td-title">{training.name}</h1>
          <p className="td-description">{training.description}</p>
        </div>
        {!isEnrolled ? (
          <button onClick={handleEnroll} className="td-enroll-btn">
            Enroll Now
          </button>
        ) : (
          <div className="td-enrolled-status">
            <CheckCircle className="td-check-icon" />
            Enrolled
          </div>
        )}
      </div>

      <div className="td-content-grid">
        <div className="td-main-section">
          <div className="td-card">
            <h2 className="td-section-title">Training Information</h2>
            <div className="td-info-grid">
              <div className="td-info-item">
                <Users className="td-icon-gray" />
                <div>
                  <p className="td-info-label">Trainer</p>
                  <p className="td-info-text">{training.trainer}</p>
                </div>
              </div>
              <div className="td-info-item">
                <Monitor className="td-icon-gray" />
                <div>
                  <p className="td-info-label">Mode</p>
                  <p className="td-info-text">{training.mode}</p>
                </div>
              </div>
              <div className="td-info-item">
                <Calendar className="td-icon-gray" />
                <div>
                  <p className="td-info-label">Duration</p>
                  <p className="td-info-text">
                    {new Date(training.startDate).toLocaleDateString()} -{" "}
                    {new Date(training.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="td-info-item">
                <Clock className="td-icon-gray" />
                <div>
                  <p className="td-info-label">Timing</p>
                  <p className="td-info-text">{training.sessionTiming}</p>
                </div>
              </div>
            </div>

            <div className="td-progress-section">
              <div className="td-progress-header">
                <h3 className="td-progress-label">Training Progress</h3>
                <span className="td-progress-percent">
                  {training.progress}%
                </span>
              </div>
              <div className="td-progress-bar-bg">
                <div
                  className="td-progress-bar-fill"
                  style={{ width: `${training.progress}%` }}
                />
              </div>
            </div>
          </div>

          {isEnrolled && (
            <div className="td-card td-resources-section">
              <h2 className="td-section-title">Training Resources</h2>
              <div className="td-resource-list">
                {training.resources.map((resource) => (
                  <div key={resource.id} className="td-resource-item">
                    <div className="td-resource-info">
                      {getResourceIcon(resource.type)}
                      <div>
                        <p className="td-resource-name">{resource.name}</p>
                        <p className="td-resource-type">
                          {getResourceTypeLabel(resource.type)}
                        </p>
                      </div>
                    </div>
                    <div className="td-resource-actions">
                      {resource.completed && (
                        <CheckCircle className="td-check-icon" />
                      )}
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="td-open-link"
                      >
                        <ExternalLink className="td-external-icon" /> Open
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="td-sidebar">
          <div className="td-card">
            <h2 className="td-section-title">Training Status</h2>
            <div className="td-status-info">
              {/* <div className="td-status-item">
                                <span className="td-status-label">Resources Completed</span>
                                <span className="td-status-value">
                                    {training.resources.filter(r => r.completed).length} / {training.resources.length}
                                </span>
                            </div> */}
              <div className="td-status-item">
                <span className="td-status-label">Days Remaining</span>
                <span className="td-status-value">
                  {(() => {
                    const today = new Date();
                    const startDate = new Date(training.startDate);
                    const endDate = new Date(training.endDate);

                    if (today < startDate) {
                      return "Training Not Started"; // Before start date
                    } else if (today > endDate) {
                      return "Training Completed"; // After end date
                    } else {
                      const remainingDays = Math.ceil(
                        (endDate - today) / (1000 * 60 * 60 * 24)
                      );
                      return `${remainingDays} days `; // Ongoing training
                    }
                  })()}
                </span>
              </div>

              <div className="td-status-item">
                <span className="td-status-label">Enrollment Status</span>
                <span
                  className={`td-status-value ${
                    isEnrolled ? "td-enrolled" : ""
                  }`}
                >
                  {isEnrolled ? "Enrolled" : "Not Enrolled"}
                </span>
              </div>
            </div>
          </div>

          <div className="td-notice">
            <AlertTriangle className="td-alert-icon" />
            <p className="td-notice-text">
              Please complete all assigned resources before the end date. Your
              progress is automatically tracked.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
