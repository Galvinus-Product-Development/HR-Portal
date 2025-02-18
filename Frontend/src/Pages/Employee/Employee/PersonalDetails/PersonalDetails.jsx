import React, { useState } from "react";
import { Save } from "lucide-react";
import "./PersonalDetails.css";

export default function PersonalDetails() {
    const [formData, setFormData] = useState({
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

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name) newErrors.name = "Name is required";
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
        if (formData.emergencyContact && !/^\d{10}$/.test(formData.emergencyContact)) {
            newErrors.emergencyContact = "Emergency phone number must be 10 digits";
        }

        if (formData.aadhaar && !/^\d{12}$/.test(formData.aadhaar)) {
            newErrors.aadhaar = "Aadhaar number must be 12 digits";
        }
        if (formData.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan)) {
            newErrors.pan = "Invalid PAN format";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log("Form submitted:", formData);
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
                {/* Name */}
                <div>
                    <label>
                        Employee Name <span className="required">*</span>
                    </label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} />
                    {errors.name && <p className="error">{errors.name}</p>}
                </div>

                {/* Gender */}
                <div>
                    <label>Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange}>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>

                {/* Location */}
                <div>
                    <label>Location</label>
                    <select name="location" value={formData.location} onChange={handleChange}>
                        <option value="">Select Location</option>
                        <option value="bengaluru">Bengaluru</option>
                        <option value="silchar">Silchar</option>
                        <option value="remote">Remote</option>
                    </select>
                </div>

                {/* Date of Birth */}
                <div>
                    <label>Date of Birth</label>
                    <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
                </div>

                {/* Blood Group */}
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




                {/* Email */}
                <div>
                    <label>
                        Personal Email ID <span className="required">*</span>
                    </label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} />
                    {errors.email && <p className="error">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                    <label>
                        Phone Number <span className="required">*</span>
                    </label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
                    {errors.phone && <p className="error">{errors.phone}</p>}
                </div>

                {/* Alternate Phone */}
                <div>
                    <label>Alternate Contact Details</label>
                    <input type="tel" name="alternatePhone" value={formData.alternatePhone} onChange={handleChange} />
                    {errors.alternatePhone && <p className="error">{errors.alternatePhone}</p>}
                </div>

                {/*Emergency Contact*/}
                <div>
                    <label>Emergency Contact</label>
                    <input type="tel" name='emergencyContact' value={formData.emergencyContact} onChange={handleChange} />
                    {errors.emergencyContact && <p classname='error'>{errors.emergencyContact}</p>}
                </div>

                {/* Marital Status */}
                <div>
                    <label>Marital Status</label>
                    <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange}>
                        <option value="">Select Status</option>
                        <option value="married">Married</option>
                        <option value="unmarried">Unmarried</option>
                    </select>
                </div>

                {/* Aadhaar */}
                <div>
                    <label>Aadhaar Number</label>
                    <input type="text" name="aadhaar" value={formData.aadhaar} onChange={handleChange} />
                    {errors.aadhaar && <p className="error">{errors.aadhaar}</p>}
                </div>

                {/* PAN */}
                <div>
                    <label>PAN Number</label>
                    <input type="text" name="pan" value={formData.pan} onChange={handleChange} />
                    {errors.pan && <p className="error">{errors.pan}</p>}
                </div>
            </div>

            {/* Addresses */}
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

            {/* Submit Button */}
            <div className="button-container">
                <button type="submit">
                    <Save className="icon" />
                    Save Details
                </button>
            </div>
        </form>
    );
}
