import React, { useState } from "react";
import { Save } from "lucide-react";
import "./PersonalDetails.css";

export default function PersonalDetails() {
    const [formData, setFormData] = useState({
        name: "",
        gender: "",
        dateOfBirth: "",
        bloodGroup: "",
        email: "",
        phone: "",
        alternatePhone: "",
        emergencyContact: "",
        currentAddress: "",
        permanentAddress: "",
        maritalStatus: "",
        aadhaar: "",
        pan: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // const validateForm = () => {
    //     const newErrors = {};

    //     if (!formData.name) newErrors.name = "Name is required";
    //     if (!formData.email) {
    //         newErrors.email = "Email is required";
    //     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    //         newErrors.email = "Invalid email format";
    //     }
    //     if (!formData.phone) {
    //         newErrors.phone = "Phone number is required";
    //     } else if (!/^\d{10}$/.test(formData.phone)) {
    //         newErrors.phone = "Phone number must be 10 digits";
    //     }
    //     if (formData.alternatePhone && !/^\d{10}$/.test(formData.alternatePhone)) {
    //         newErrors.alternatePhone = "Alternate phone number must be 10 digits";
    //     }
    //     if (formData.emergencyContact && !/^\d{10}$/.test(formData.emergencyContact)) {
    //         newErrors.emergencyContact = "Emergency phone number must be 10 digits";
    //     }
    //     if (formData.aadhaar && !/^\d{12}$/.test(formData.aadhaar)) {
    //         newErrors.aadhaar = "Aadhaar number must be 12 digits";
    //     }
    //     if (formData.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan)) {
    //         newErrors.pan = "Invalid PAN format";
    //     }

    //     setErrors(newErrors);
    //     return Object.keys(newErrors).length === 0;
    // };



    const validateForm = () => {
        const newErrors = {};
    
        if (!formData.name.trim()) newErrors.name = "Name is required";
    
        if (!formData.gender) newErrors.gender = "Gender is required";
    
        if (!formData.dateOfBirth) {
            newErrors.dateOfBirth = "Date of birth is required";
        } else {
            const today = new Date();
            const dob = new Date(formData.dateOfBirth);
            if (dob >= today) newErrors.dateOfBirth = "Date of birth must be in the past";
        }
    
        if (!formData.bloodGroup) newErrors.bloodGroup = "Blood group is required";
    
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }
    
        if (!formData.phone) {
            newErrors.phone = "Phone number is required";
        } else if (!/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = "Phone number must be 10 digits";
        }
    
        if (formData.alternatePhone && !/^\d{10}$/.test(formData.alternatePhone)) {
            newErrors.alternatePhone = "Alternate phone number must be 10 digits";
        }
    
        if (!formData.emergencyContact) {
            newErrors.emergencyContact = "Emergency contact is required";
        } else if (!/^\d{10}$/.test(formData.emergencyContact)) {
            newErrors.emergencyContact = "Emergency phone number must be 10 digits";
        }
    
        if (!formData.currentAddress.trim()) {
            newErrors.currentAddress = "Current address is required";
        } else if (formData.currentAddress.length < 5) {
            newErrors.currentAddress = "Current address must be at least 5 characters";
        }
    
        if (!formData.permanentAddress.trim()) {
            newErrors.permanentAddress = "Permanent address is required";
        } else if (formData.permanentAddress.length < 5) {
            newErrors.permanentAddress = "Permanent address must be at least 5 characters";
        }
    
        if (!formData.maritalStatus) newErrors.maritalStatus = "Marital status is required";
    
        if (formData.aadhaar && !/^\d{12}$/.test(formData.aadhaar)) {
            newErrors.aadhaar = "Aadhaar number must be 12 digits";
        }
    
        if (formData.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan)) {
            newErrors.pan = "Invalid PAN format";
        }
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    



    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setLoading(true);
            try {
                const signedUserId = localStorage.getItem("signedUserId");
                console.log(signedUserId);
                const requestData = { ...formData, signedUserId };
                console.log(requestData)
                const response = await fetch("http://localhost:5001/api/employeeRoutes/personal-details", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(requestData),
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("Response:", data);
                    alert("Form submitted successfully!");
                    setFormData({
                        name: "",
                        gender: "",
                        location: "",
                        dateOfBirth: "",
                        bloodGroup: "",
                        email: "",
                        phone: "",
                        alternatePhone: "",
                        emergencyContact: "",
                        currentAddress: "",
                        permanentAddress: "",
                        maritalStatus: "",
                        aadhaar: "",
                        pan: "",
                    });
                } else {
                    alert("Error submitting form");
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Something went wrong. Please try again.");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="personal-form">
            <div className="grid-container">
                <div>
                    <label>
                        Employee Name <span className="required">*</span>
                    </label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} />
                    {errors.name && <p className="error">{errors.name}</p>}
                </div>

                <div>
                    <label>Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange}>
                        <option value="">Select Gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                    </select>
                </div>

                <div>
                    <label>Date of Birth</label>
                    <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
                </div>

                <div>
                    <label>Blood Group</label>
                    <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
                        <option value="">Select Blood Group</option>
                        <option value="A-">A-</option>
                        <option value="A+">A+</option>
                        <option value="B-">B-</option>
                        <option value="B+">B+</option>
                        <option value="AB-">AB-</option>
                        <option value="AB+">AB+</option>
                        <option value="O-">O-</option>
                        <option value="O+">O+</option>
                    </select>
                </div>

                <div>
                    <label>
                        Personal Email ID <span className="required">*</span>
                    </label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} />
                    {errors.email && <p className="error">{errors.email}</p>}
                </div>

                <div>
                    <label>
                        Phone Number <span className="required">*</span>
                    </label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
                    {errors.phone && <p className="error">{errors.phone}</p>}
                </div>

                <div>
                    <label>Alternate Contact Details</label>
                    <input type="tel" name="alternatePhone" value={formData.alternatePhone} onChange={handleChange} />
                    {errors.alternatePhone && <p className="error">{errors.alternatePhone}</p>}
                </div>

                <div>
                    <label>Emergency Contact</label>
                    <input type="tel" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} />
                    {errors.emergencyContact && <p className="error">{errors.emergencyContact}</p>}
                </div>

                <div>
                    <label>Marital Status</label>
                    <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange}>
                        <option value="">Select Status</option>
                        <option value="MARRIED">MARRIED</option>
                        <option value="SINGLE">SINGLE</option>
                        <option value="DIVORCED">DIVORCED</option>
                        <option value="WIDOWED">WIDOWED</option>
                    </select>
                </div>

                <div>
                    <label>Aadhaar Number</label>
                    <input type="text" name="aadhaar" value={formData.aadhaar} onChange={handleChange} />
                    {errors.aadhaar && <p className="error">{errors.aadhaar}</p>}
                </div>

                <div>
                    <label>PAN Number</label>
                    <input type="text" name="pan" value={formData.pan} onChange={handleChange} />
                    {errors.pan && <p className="error">{errors.pan}</p>}
                </div>
            </div>

            <div className="grid-container">
                <div>
                    <label>Current Address</label>
                    <textarea name="currentAddress" value={formData.currentAddress} onChange={handleChange} rows="3" />
                </div>
                <div>
                    <label>Permanent Address</label>
                    <textarea name="permanentAddress" value={formData.permanentAddress} onChange={handleChange} rows="3" />
                </div>
            </div>

            <div className="button-container">
                <button type="submit" disabled={loading}>
                    {loading ? "Saving..." : <>
                        <Save className="icon" />
                        Save Details
                    </>}
                </button>
            </div>
        </form>
    );
}
