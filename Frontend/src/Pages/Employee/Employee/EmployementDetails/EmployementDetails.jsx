import React from "react";
import "./EmployementDetails.css"; 

const EmploymentDetails = () => {
    // Dummy data for now, will add reall data
    const formData = {
        name: "Subham Roy",
        employeeId: "GAL0005",
        jobTitle: "Analyst",
        department: "Technical",
        lineManager: "Dino Singha",
        location: "Silchar",
        email: "subham.roy@galvinus.in",
        dateOfJoining: "23/11/2023",
        employementType: "Permanent",
        uan: "62456178",
        pf: "13385743296",
        esic: "123456789012",
     
    };

    return (
        <div className="employment-details-container">
    
            <div className="employment-details-grid">
                {/* Name */}
                <div className="employment-details-item">
                    <label>Employee Name:</label>
                    <p>{formData.name}</p>
                </div>

                {/* Gender */}
                <div className="employment-details-item">
                    <label>Employee ID:</label>
                    <p>{formData.employeeId}</p>
                </div>

                {/* Location */}
                <div className="employment-details-item">
                    <label>Job Title:</label>
                    <p>{formData.jobTitle}</p>
                </div>

                {/* Date of Birth */}
                <div className="employment-details-item">
                    <label>Line Manager:</label>
                    <p>{formData.lineManager}</p>
                </div>

                {/* Blood Group */}
                <div className="employment-details-item">
                    <label>Location:</label>
                    <p>{formData.location}</p>
                </div>

                {/* Email */}
                <div className="employment-details-item">
                    <label>Office Email ID:</label>
                    <p>{formData.email}</p>
                </div>

                {/* Phone */}
                <div className="employment-details-item">
                    <label>Date of Joining:</label>
                    <p>{formData.dateOfJoining}</p>
                </div>

                {/* Alternate Phone */}
                <div className="employment-details-item">
                    <label>Employement Type:</label>
                    <p>{formData.employementType}</p>
                </div>

                {/* Marital Status */}
                <div className="employment-details-item">
                    <label>UAN:</label>
                    <p>{formData.uan}</p>
                </div>

                {/* Aadhaar */}
                <div className="employment-details-item">
                    <label>PF Account Number:</label>
                    <p>{formData.pf}</p>
                </div>

                {/* PAN */}
                <div className="employment-details-item">
                    <label>ESIC Number:</label>
                    <p>{formData.esic}</p>
                </div>
            </div>

         
            {/* <div className="employment-details-grid">
                <div className="employment-details-item">
                    <label>Current Address:</label>
                    <p>{formData.currentAddress}</p>
                </div>
                <div className="employment-details-item">
                    <label>Permanent Address:</label>
                    <p>{formData.permanentAddress}</p>
                </div>
            </div> */}
        </div>
    );
};

export default EmploymentDetails;
