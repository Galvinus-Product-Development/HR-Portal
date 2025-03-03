// import React, { useState } from 'react';
// import { format } from 'date-fns';
// import { FaAward, FaCalendarAlt, FaEye, FaUpload, FaTimes } from 'react-icons/fa';
// import './Certification.css';

// const CertificationsPage = () => {
//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const [selectedCertificate, setSelectedCertificate] = useState(null);

//   const mockCertifications = [
//     {
//       id: '1',
//       name: 'AWS Solutions Architect',
//       issuer: 'Amazon Web Services',
//       type: 'Technical',
//       issue_date: '2024-03-01',
//       expiry_date: '2025-03-01',
//       certificate_file: 'https://example.com/cert1.pdf',
//       badge_visibility: true,
//     },
//     {
//       id: '2',
//       name: 'Scrum Master',
//       issuer: 'Scrum Alliance',
//       type: 'Management',
//       issue_date: '2024-02-15',
//       expiry_date: undefined,
//       certificate_file: 'https://example.com/cert2.pdf',
//       badge_visibility: true,
//     },
//   ];

//   return (
//     <div className="cert-page-container">
//       <div className="cert-page-header">
//         <h2>Certifications & Badges</h2>
//         <button className="cert-upload-btn" onClick={() => setShowUploadModal(true)}>
//           <FaUpload /> Upload Certificate
//         </button>
//       </div>

//       <div className="cert-grid">
//         {mockCertifications.map((cert) => (
//           <div key={cert.id} className="cert-card">
//             <div className="cert-card-header">
//               <h3>{cert.name}</h3>
//               <FaAward className={`cert-badge ${cert.badge_visibility ? 'visible' : 'hidden'}`} />
//             </div>
//             <p className="cert-issuer">{cert.issuer}</p>
//             <div className="cert-dates">
//               <span><FaCalendarAlt /> Issued: {format(new Date(cert.issue_date), 'dd MMM yyyy')}</span>
//               {cert.expiry_date && <span><FaCalendarAlt /> Expires: {format(new Date(cert.expiry_date), 'dd MMM yyyy')}</span>}
//             </div>
//             <button className="cert-view-btn" onClick={() => setSelectedCertificate(cert)}>
//               <FaEye /> View Certificate
//             </button>
//           </div>
//         ))}
//       </div>

//       {showUploadModal && (
//         <div className="cert-modal-overlay">
//           <div className="cert-modal-content">
//             <div className="cert-modal-header">
//               <h3>Upload New Certification</h3>
//               <button className="cert-close-btn" onClick={() => setShowUploadModal(false)}>
//                 <FaTimes />
//               </button>
//             </div>
//             <form>
//               <div className="cert-input-group">
//                 <label>Certification Name</label>
//                 <input type="text" placeholder="Enter certification name" required />
//               </div>

//               <div className="cert-input-row">
//                 <div className="cert-input-group">
//                   <label>Issue Date</label>
//                   <input type="date" required />
//                 </div>
//                 <div className="cert-input-group">
//                   <label>Expiry Date (Optional)</label>
//                   <input type="date" />
//                 </div>
//               </div>

//               <div className="cert-file-upload">
//                 <label className="cert-file-label">
//                   <FaUpload /> Upload Certificate File
//                   <input type="file" />
//                 </label>
//                 <p>Accepted formats: PDF, PNG, JPG (Max 10MB)</p>
//               </div>

//               <div className="cert-checkbox">
//                 <input type="checkbox" defaultChecked />
//                 <label>Make badge visible in public profile</label>
//               </div>

//               <div className="cert-modal-actions">
//                 <button type="button" className="cert-cancel-btn" onClick={() => setShowUploadModal(false)}>Cancel</button>
//                 <button type="submit" className="cert-submit-btn">Upload</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CertificationsPage;

// import React, { useState } from 'react';
// import { format } from 'date-fns';
// import { FaAward, FaCalendarAlt, FaEye, FaUpload, FaTimes } from 'react-icons/fa';
// import './Certification.css';

// const CertificationsPage = () => {
//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const [selectedCertificate, setSelectedCertificate] = useState(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     issuer: '',
//     issue_date: '',
//     expiry_date: '',
//     badge_visibility: true,
//   });
//   const [file, setFile] = useState(null);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file) {
//       alert('Please upload a file.');
//       return;
//     }

//     const data = new FormData();
//     data.append('name', formData.name);
//     data.append('issuer', formData.issuer);
//     data.append('issue_date', formData.issue_date);
//     data.append('expiry_date', formData.expiry_date);
//     data.append('badge_visibility', formData.badge_visibility);
//     data.append('certificate_file', file);

//     try {
//       const response = await fetch('http://localhost:5001/api/certifications/upload', {
//         method: 'POST',
//         body: data,
//       });

//       if (response.ok) {
//         alert('Certificate uploaded successfully!');
//         setShowUploadModal(false);
//       } else {
//         alert('Error uploading certificate.');
//       }
//     } catch (error) {
//       console.error(error);
//       alert('Error uploading certificate.');
//     }
//   };

//   const mockCertifications = [
//     {
//       id: '1',
//       name: 'AWS Solutions Architect',
//       issuer: 'Amazon Web Services',
//       type: 'Technical',
//       issue_date: '2024-03-01',
//       expiry_date: '2025-03-01',
//       certificate_file: 'https://example.com/cert1.pdf',
//       badge_visibility: true,
//     },
//     {
//       id: '2',
//       name: 'Scrum Master',
//       issuer: 'Scrum Alliance',
//       type: 'Management',
//       issue_date: '2024-02-15',
//       expiry_date: undefined,
//       certificate_file: 'https://example.com/cert2.pdf',
//       badge_visibility: true,
//     },
//   ];

//   return (
//     <div className="cert-page-container">
//       <div className="cert-page-header">
//         <h2>Certifications & Badges</h2>
//         <button className="cert-upload-btn" onClick={() => setShowUploadModal(true)}>
//           <FaUpload /> Upload Certificate
//         </button>
//       </div>

//       <div className="cert-grid">
//         {mockCertifications.map((cert) => (
//           <div key={cert.id} className="cert-card">
//             <div className="cert-card-header">
//               <h3>{cert.name}</h3>
//               <FaAward className={`cert-badge ${cert.badge_visibility ? 'visible' : 'hidden'}`} />
//             </div>
//             <p className="cert-issuer">{cert.issuer}</p>
//             <div className="cert-dates">
//               <span><FaCalendarAlt /> Issued: {format(new Date(cert.issue_date), 'dd MMM yyyy')}</span>
//               {cert.expiry_date && <span><FaCalendarAlt /> Expires: {format(new Date(cert.expiry_date), 'dd MMM yyyy')}</span>}
//             </div>
//             <button className="cert-view-btn" onClick={() => setSelectedCertificate(cert)}>
//               <FaEye /> View Certificate
//             </button>
//           </div>
//         ))}
//       </div>

//       {showUploadModal && (
//         <div className="cert-modal-overlay">
//           <div className="cert-modal-content">
//             <div className="cert-modal-header">
//               <h3>Upload New Certification</h3>
//               <button className="cert-close-btn" onClick={() => setShowUploadModal(false)}>
//                 <FaTimes />
//               </button>
//             </div>
//             <form onSubmit={handleSubmit}>
//               <div className="cert-input-group">
//                 <label>Certification Name</label>
//                 <input type="text" name="name" placeholder="Enter certification name" onChange={handleChange} required />
//               </div>

//               <div className="cert-input-group">
//                 <label>Issuing Authority</label>
//                 <input type="text" name="issuer" placeholder="Enter issuing authority" onChange={handleChange} required />
//               </div>

//               <div className="cert-input-row">
//                 <div className="cert-input-group">
//                   <label>Issue Date</label>
//                   <input type="date" name="issue_date" onChange={handleChange} required />
//                 </div>
//                 <div className="cert-input-group">
//                   <label>Expiry Date (Optional)</label>
//                   <input type="date" name="expiry_date" onChange={handleChange} />
//                 </div>
//               </div>

//               <div className="cert-file-upload">
//                 <label className="cert-file-label">
//                   <FaUpload /> Upload Certificate File
//                   <input type="file" onChange={handleFileChange} required />
//                 </label>
//                 <p>Accepted formats: PDF, PNG, JPG (Max 10MB)</p>
//               </div>

//               <div className="cert-checkbox">
//                 <input type="checkbox" name="badge_visibility" checked={formData.badge_visibility} onChange={() => setFormData({ ...formData, badge_visibility: !formData.badge_visibility })} />
//                 <label>Make badge visible in public profile</label>
//               </div>

//               <div className="cert-modal-actions">
//                 <button type="button" className="cert-cancel-btn" onClick={() => setShowUploadModal(false)}>Cancel</button>
//                 <button type="submit" className="cert-submit-btn">Upload</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CertificationsPage;

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  FaAward,
  FaCalendarAlt,
  FaEye,
  FaUpload,
  FaTimes,
} from "react-icons/fa";
import "./Certification.css";

const CertificationsPage = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [certifications, setCertifications] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    issuer: "",
    issue_date: "",
    expiry_date: "",
    badge_visibility: true,
  });
  const [file, setFile] = useState(null);

  // Fetch certifications from the backend
  const fetchCertifications = async () => {
    try {
      const signedUserId = localStorage.getItem("signedUserId");
      const response = await fetch(
        `http://localhost:5001/api/certifications/${signedUserId}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setCertifications(data);
      } else {
        console.error("Error fetching certifications");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    fetchCertifications();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload a file.");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("issuer", formData.issuer);
    data.append("issue_date", formData.issue_date);
    data.append("expiry_date", formData.expiry_date);
    data.append("badge_visibility", formData.badge_visibility);
    data.append("certificate_file", file);

    try {
      const signedUserId = localStorage.getItem("signedUserId");
      data.append("signedUserId", signedUserId);
      const response = await fetch(
        "http://localhost:5001/api/certifications/upload",
        {
          method: "POST",
          body: data,
        }
      );

      if (response.ok) {
        alert("Certificate uploaded successfully!");
        setShowUploadModal(false);
        // Refresh certifications after upload
        const updatedCertifications = await response.json();
        setCertifications([...certifications, updatedCertifications]);
        fetchCertifications();
      } else {
        alert("Error uploading certificate.");
      }
    } catch (error) {
      console.error(error);
      alert("Error uploading certificate.");
    }
  };

  return (
    <div className="cert-page-container">
      <div className="cert-page-header">
        <h2>Certifications & Badges</h2>
        <button
          className="cert-upload-btn"
          onClick={() => setShowUploadModal(true)}
        >
          <FaUpload /> Upload Certificate
        </button>
      </div>

      <div className="cert-grid">
        {certifications.map((cert) => (
          <div key={cert.certification_id} className="cert-card">
            <div className="cert-card-header">
              <h3>{cert.certificate_name}</h3>
              <FaAward
                className={`cert-badge ${
                  cert.badge_visibility ? "visible" : "hidden"
                }`}
              />
            </div>
            <p className="cert-issuer">{cert.issuing_authority}</p>
            <div className="cert-dates">
              {/* <span><FaCalendarAlt /> Issued: {format(new Date(cert.issue_date), 'dd MMM yyyy')}</span>
              {cert.expiry_date && <span><FaCalendarAlt /> Expires: {format(new Date(cert.expiry_date), 'dd MMM yyyy')}</span>} */}

              <span>
                <FaCalendarAlt /> Issued:
                {cert.issue_date
                  ? format(new Date(cert.issue_date), "dd MMM yyyy")
                  : "N/A"}
              </span>
              {cert.expiry_date && cert.expiry_date !== "" ? (
                <span>
                  <FaCalendarAlt /> Expires:{" "}
                  {format(new Date(cert.expiry_date), "dd MMM yyyy")}
                </span>
              ) : null}
              
            </div>
            <button
              className="cert-view-btn"
              onClick={() => setSelectedCertificate(cert)}
            >
              <FaEye /> View Certificate
            </button>
          </div>
        ))}
      </div>

      {showUploadModal && (
        <div className="cert-modal-overlay">
          <div className="cert-modal-content">
            <div className="cert-modal-header">
              <h3>Upload New Certification</h3>
              <button
                className="cert-close-btn"
                onClick={() => setShowUploadModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="cert-input-group">
                <label>Certification Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter certification name"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="cert-input-group">
                <label>Issuing Authority</label>
                <input
                  type="text"
                  name="issuer"
                  placeholder="Enter issuing authority"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="cert-input-row">
                <div className="cert-input-group">
                  <label>Issue Date</label>
                  <input
                    type="date"
                    name="issue_date"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="cert-input-group">
                  <label>Expiry Date (Optional)</label>
                  <input
                    type="date"
                    name="expiry_date"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="cert-file-upload">
                <label className="cert-file-label">
                  <FaUpload /> Upload Certificate File
                  <input type="file" onChange={handleFileChange} required />
                </label>
                <p>Accepted formats: PDF, PNG, JPG (Max 10MB)</p>
              </div>

              <div className="cert-checkbox">
                <input
                  type="checkbox"
                  name="badge_visibility"
                  checked={formData.badge_visibility}
                  onChange={() =>
                    setFormData({
                      ...formData,
                      badge_visibility: !formData.badge_visibility,
                    })
                  }
                />
                <label>Make badge visible in public profile</label>
              </div>

              <div className="cert-modal-actions">
                <button
                  type="button"
                  className="cert-cancel-btn"
                  onClick={() => setShowUploadModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="cert-submit-btn">
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificationsPage;
