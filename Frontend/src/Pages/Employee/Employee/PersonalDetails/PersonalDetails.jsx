// import React, { useState, useEffect } from "react";
// import { Save } from "lucide-react";
// import "./PersonalDetails.css";
// const API_BASE_URL_ED = import.meta.env.VITE_API_BASE_URL_ED;
// export default function PersonalDetails() {
//   const [formData, setFormData] = useState({
//     name: "",
//     gender: "",
//     dateOfBirth: "",
//     bloodGroup: "",
//     email: "",
//     phone: "",
//     alternatePhone: "",
//     emergencyContact: "",
//     currentAddress: "",
//     permanentAddress: "",
//     maritalStatus: "",
//     aadhaar: "",
//     pan: "",
//     email:""
//   });

//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   useEffect(() => {
//     const fetchEmployeeData = async () => {
//       const deviceId = localStorage.getItem("deviceId") || generateDeviceId();
//       const id = localStorage.getItem("userId") || "";
//       const userAgent = navigator.userAgent;
//       const headers = {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
//         "x-refresh-token": localStorage.getItem("refreshToken") || "",
//         "x-device-id": deviceId, // Send deviceId in headers
//         "user-agent": userAgent, // Send user agent in headers
//       };
//       try {
//         const response = await fetch(
//           `${API_BASE_URL_ED}/api/employeeRoutes/fetchEmployeeDetailsById/${id}`,
//           {
//             method: "GET",
//             headers,
//           }
//         );
//         if (!response.ok) {
//           throw new Error("Employee not found");
//         }
//         const data = await response.json();
//         console.log("This is personal details data:-", data);
//         setFormData({
//           name: data.personalDetails.name,
//           gender: data.personalDetails.gender,
//           location: data.personalDetails.location,
//           dateOfBirth: data.personalDetails.dateOfBirth,
//           bloodGroup: data.personalDetails.bloodGroup,
//           email: data.personalDetails.email,
//           phone: data.personalDetails.phoneNumber,
//           alternatePhone: data.personalDetails.alternatePhoneNumber,
//           emergencyContact: data.emergencyContact.phoneNumber,
//           currentAddress: data.personalDetails.currentAddress,
//           permanentAddress: data.personalDetails.permanentAddress,
//           maritalStatus: data.personalDetails.maritalStatus,
//           aadhaar: data.personalDetails.aadharNumber,
//           pan: data.personalDetails.panNumber,
//           email:data.personalDetails.personalEmail
//         });
//         // setEmployee(data);
//       } catch (err) {
//         console.log(err);
//       } finally {
//       }
//     };

//     fetchEmployeeData();
//   }, []);

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.name.trim()) newErrors.name = "Name is required";

//     if (!formData.gender) newErrors.gender = "Gender is required";

//     if (!formData.dateOfBirth) {
//       newErrors.dateOfBirth = "Date of birth is required";
//     } else {
//       const today = new Date();
//       const dob = new Date(formData.dateOfBirth);
//       if (dob >= today)
//         newErrors.dateOfBirth = "Date of birth must be in the past";
//     }

//     if (!formData.bloodGroup) newErrors.bloodGroup = "Blood group is required";

//     if (!formData.email) {
//       newErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Invalid email format";
//     }

//     if (!formData.phone) {
//       newErrors.phone = "Phone number is required";
//     } else if (!/^\d{10}$/.test(formData.phone)) {
//       newErrors.phone = "Phone number must be 10 digits";
//     }

//     if (formData.alternatePhone && !/^\d{10}$/.test(formData.alternatePhone)) {
//       newErrors.alternatePhone = "Alternate phone number must be 10 digits";
//     }

//     if (!formData.emergencyContact) {
//       newErrors.emergencyContact = "Emergency contact is required";
//     } else if (!/^\d{10}$/.test(formData.emergencyContact)) {
//       newErrors.emergencyContact = "Emergency phone number must be 10 digits";
//     }

//     if (!formData.currentAddress.trim()) {
//       newErrors.currentAddress = "Current address is required";
//     } else if (formData.currentAddress.length < 5) {
//       newErrors.currentAddress =
//         "Current address must be at least 5 characters";
//     }

//     if (!formData.permanentAddress.trim()) {
//       newErrors.permanentAddress = "Permanent address is required";
//     } else if (formData.permanentAddress.length < 5) {
//       newErrors.permanentAddress =
//         "Permanent address must be at least 5 characters";
//     }

//     if (!formData.maritalStatus)
//       newErrors.maritalStatus = "Marital status is required";

//     if (formData.aadhaar && !/^\d{12}$/.test(formData.aadhaar)) {
//       newErrors.aadhaar = "Aadhaar number must be 12 digits";
//     }

//     if (formData.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan)) {
//       newErrors.pan = "Invalid PAN format";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     const isConfirmed = window.confirm(
//       "Are you sure you want to save the changes?"
//     );
//     if (!isConfirmed) {
//       return;
//     }

//     e.preventDefault();
//     if (validateForm()) {
//       setLoading(true);
//       try {
//         const signedUserId = localStorage.getItem("signedUserId");
//         console.log(signedUserId);
//         const requestData = { ...formData, signedUserId };
//         console.log(requestData);
//         const response = await fetch(
//           `${API_BASE_URL_ED}/api/employeeRoutes/personal-details`,
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(requestData),
//           }
//         );

//         if (response.ok) {
//           const data = await response.json();
//           console.log("Response:", data);
//           alert("Form submitted successfully!");
//         } else {
//           alert("Error submitting form");
//         }
//       } catch (error) {
//         console.error("Error:", error);
//         alert("Something went wrong. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="personal-form">
//       <div className="grid-container">
//         <div>
//           <label>
//             Employee Name <span className="required">*</span>
//           </label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//           />
//           {errors.name && <p className="error">{errors.name}</p>}
//         </div>

//         <div>
//           <label>Gender</label>
//           <select name="gender" value={formData.gender} onChange={handleChange}>
//             <option value="">Select Gender</option>
//             <option value="MALE">Male</option>
//             <option value="FEMALE">Female</option>
//           </select>
//         </div>

//         <div>
//           <label>Date of Birth</label>
//           <input
//             type="date"
//             name="dateOfBirth"
//             value={formData.dateOfBirth}
//             onChange={handleChange}
//           />
//         </div>

//         <div>
//           <label>Blood Group</label>
//           <select
//             name="bloodGroup"
//             value={formData.bloodGroup}
//             onChange={handleChange}
//           >
//             <option value="">Select Blood Group</option>
//             <option value="A-">A-</option>
//             <option value="A+">A+</option>
//             <option value="B-">B-</option>
//             <option value="B+">B+</option>
//             <option value="AB-">AB-</option>
//             <option value="AB+">AB+</option>
//             <option value="O-">O-</option>
//             <option value="O+">O+</option>
//           </select>
//         </div>

//         <div>
//           <label>
//             Personal Email ID <span className="required">*</span>
//           </label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//           />
//           {errors.email && <p className="error">{errors.email}</p>}
//         </div>

//         <div>
//           <label>
//             Phone Number <span className="required">*</span>
//           </label>
//           <input
//             type="tel"
//             name="phone"
//             value={formData.phone}
//             onChange={handleChange}
//           />
//           {errors.phone && <p className="error">{errors.phone}</p>}
//         </div>

//         <div>
//           <label>Alternate Contact Details</label>
//           <input
//             type="tel"
//             name="alternatePhone"
//             value={formData.alternatePhone}
//             onChange={handleChange}
//           />
//           {errors.alternatePhone && (
//             <p className="error">{errors.alternatePhone}</p>
//           )}
//         </div>

//         <div>
//           <label>Emergency Contact</label>
//           <input
//             type="tel"
//             name="emergencyContact"
//             value={formData.emergencyContact}
//             onChange={handleChange}
//           />
//           {errors.emergencyContact && (
//             <p className="error">{errors.emergencyContact}</p>
//           )}
//         </div>

//         <div>
//           <label>Marital Status</label>
//           <select
//             name="maritalStatus"
//             value={formData.maritalStatus}
//             onChange={handleChange}
//           >
//             <option value="">Select Status</option>
//             <option value="MARRIED">MARRIED</option>
//             <option value="SINGLE">SINGLE</option>
//             <option value="DIVORCED">DIVORCED</option>
//             <option value="WIDOWED">WIDOWED</option>
//           </select>
//         </div>

//         <div>
//           <label>Aadhaar Number</label>
//           <input
//             type="text"
//             name="aadhaar"
//             value={formData.aadhaar}
//             onChange={handleChange}
//           />
//           {errors.aadhaar && <p className="error">{errors.aadhaar}</p>}
//         </div>

//         <div>
//           <label>PAN Number</label>
//           <input
//             type="text"
//             name="pan"
//             value={formData.pan}
//             onChange={handleChange}
//           />
//           {errors.pan && <p className="error">{errors.pan}</p>}
//         </div>
//       </div>

//       <div className="grid-container">
//         <div>
//           <label>Current Address</label>
//           <textarea
//             name="currentAddress"
//             value={formData.currentAddress}
//             onChange={handleChange}
//             rows="3"
//           />
//         </div>
//         <div>
//           <label>Permanent Address</label>
//           <textarea
//             name="permanentAddress"
//             value={formData.permanentAddress}
//             onChange={handleChange}
//             rows="3"
//           />
//         </div>
//       </div>

//       <div className="button-container">
//         <button type="submit" disabled={loading}>
//           {loading ? (
//             "Saving..."
//           ) : (
//             <>
//               <Save className="icon" />
//               Save Details
//             </>
//           )}
//         </button>
//       </div>
//     </form>
//   );
// }






import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";
import "./PersonalDetails.css";
const API_BASE_URL_ED = import.meta.env.VITE_API_BASE_URL_ED;
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
    currentStreet: "",
    currentCity: "",
    currentState: "",
    currentCountry: "",
    currentZip: "",
    permanentStreet: "",
    permanentCity: "",
    permanentState: "",
    permanentCountry: "",
    permanentZip: "",
    maritalStatus: "",
    aadhaar: "",
    pan: "",
    email:""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchEmployeeData = async () => {
      const deviceId = localStorage.getItem("deviceId") || generateDeviceId();
      const id = localStorage.getItem("userId") || "";
      const userAgent = navigator.userAgent;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
        "x-refresh-token": localStorage.getItem("refreshToken") || "",
        "x-device-id": deviceId, // Send deviceId in headers
        "user-agent": userAgent, // Send user agent in headers
      };
      try {
        const response = await fetch(
          `${API_BASE_URL_ED}/api/employeeRoutes/fetchEmployeeDetailsById/${id}`,
          {
            method: "GET",
            headers,
          }
        );
        if (!response.ok) {
          throw new Error("Employee not found");
        }
        const data = await response.json();
        console.log("This is personal details data:-", data);
        
        // Parse addresses if they exist
        let currentAddressObj = parseAddress(data.personalDetails.currentAddress);
        let permanentAddressObj = parseAddress(data.personalDetails.permanentAddress);
        console.log("This is parmanent address and current addresss object",currentAddressObj,permanentAddressObj)
        setFormData({
          name: data.personalDetails.name,
          gender: data.personalDetails.gender,
          location: data.personalDetails.location,
          dateOfBirth: data.personalDetails.dateOfBirth,
          bloodGroup: data.personalDetails.bloodGroup,
          email: data.personalDetails.email,
          phone: data.personalDetails.phoneNumber,
          alternatePhone: data.personalDetails.alternatePhoneNumber,
          emergencyContact: data.emergencyContact.phoneNumber,
          currentStreet: currentAddressObj.street,
          currentCity: currentAddressObj.city,
          currentState: currentAddressObj.state,
          currentCountry: currentAddressObj.country,
          currentZip: currentAddressObj.zipCode,
          permanentStreet: permanentAddressObj.street,
          permanentCity: permanentAddressObj.city,
          permanentState: permanentAddressObj.state,
          permanentCountry: permanentAddressObj.country,
          permanentZip: permanentAddressObj.zipCode,
          maritalStatus: data.personalDetails.maritalStatus,
          aadhaar: data.personalDetails.aadharNumber,
          pan: data.personalDetails.panNumber,
          email: data.personalDetails.personalEmail
        });
        // setEmployee(data);
      } catch (err) {
        console.error(err);
      } finally {
      }
    };

    fetchEmployeeData();
  }, []);

  // Helper function to parse address strings
  const parseAddress = (addressObj) => {
    if (!addressObj || typeof addressObj !== "object") {
      return { street: "", city: "", state: "", country: "", zip: "" };
    }
  
    return {
      street: addressObj.street || "",
      city: addressObj.city || "",
      state: addressObj.state || "",
      country: addressObj.country || "",
      zipCode: addressObj.zipCode || "",
    };
  };
  
  
  // Helper function to compose address from components
  const composeAddress = (street, city, state, country, zip) => {
    return [street, city, state, country, zip].filter(Boolean).join(", ");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";

    if (!formData.gender) newErrors.gender = "Gender is required";

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else {
      const today = new Date();
      const dob = new Date(formData.dateOfBirth);
      if (dob >= today)
        newErrors.dateOfBirth = "Date of birth must be in the past";
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

    // Validate current address fields
    if (!formData.currentStreet.trim()) {
      newErrors.currentStreet = "Street details are required";
    }
    
    if (!formData.currentCity.trim()) {
      newErrors.currentCity = "City is required";
    }
    
    if (!formData.currentState.trim()) {
      newErrors.currentState = "State is required";
    }
    
    if (!formData.currentCountry.trim()) {
      newErrors.currentCountry = "Country is required";
    }
    
    if (!formData.currentZip.trim()) {
      newErrors.currentZip = "Zip code is required";
    }

    // Validate permanent address fields
    if (!formData.permanentStreet.trim()) {
      newErrors.permanentStreet = "Street details are required";
    }
    
    if (!formData.permanentCity.trim()) {
      newErrors.permanentCity = "City is required";
    }
    
    if (!formData.permanentState.trim()) {
      newErrors.permanentState = "State is required";
    }
    
    if (!formData.permanentCountry.trim()) {
      newErrors.permanentCountry = "Country is required";
    }
    
    if (!formData.permanentZip.trim()) {
      newErrors.permanentZip = "Zip code is required";
    }

    if (!formData.maritalStatus)
      newErrors.maritalStatus = "Marital status is required";

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
    const isConfirmed = window.confirm(
      "Are you sure you want to save the changes?"
    );
    if (!isConfirmed) {
      return;
    }

    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        const signedUserId = localStorage.getItem("signedUserId");
        console.log(signedUserId);

        // Compose addresses before sending
        const submissionData = {
          ...formData,
          currentStreet:formData.currentStreet,
          currentCity:formData.currentCity,
          currentState:formData.currentState,
          currentCountry:formData.currentCountry,
          currentZip:formData.currentZip,
          permanentStreet:formData.permanentStreet,
          permanentCity:formData.permanentCity,
          permanentState:formData.permanentState,
          permanentCountry:formData.permanentCountry,
          permanentZip:formData.permanentZip,
          signedUserId
        };
        
        // Remove the individual address fields as they're not expected by the API
        // delete submissionData.currentStreet;
        // delete submissionData.currentCity;
        // delete submissionData.currentState;
        // delete submissionData.currentCountry;
        // delete submissionData.currentZip;
        // delete submissionData.permanentStreet;
        // delete submissionData.permanentCity;
        // delete submissionData.permanentState;
        // delete submissionData.permanentCountry;
        // delete submissionData.permanentZip;
        
        console.log("This is the submission data",submissionData);
        const response = await fetch(
          `${API_BASE_URL_ED}/api/employeeRoutes/personal-details`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(submissionData),
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Response:", data);
          alert("Form submitted successfully!");
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


  useEffect(()=>{
    console.log("this is fromData",formData);
  },[formData])

  return (
    <form onSubmit={handleSubmit} className="personal-form">
      <div className="grid-container">
        <div>
          <label>
            Employee Name <span className="required">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
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
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Blood Group</label>
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
          >
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
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div>
          <label>
            Phone Number <span className="required">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && <p className="error">{errors.phone}</p>}
        </div>

        <div>
          <label>Alternate Contact Details</label>
          <input
            type="tel"
            name="alternatePhone"
            value={formData.alternatePhone}
            onChange={handleChange}
          />
          {errors.alternatePhone && (
            <p className="error">{errors.alternatePhone}</p>
          )}
        </div>

        <div>
          <label>Emergency Contact</label>
          <input
            type="tel"
            name="emergencyContact"
            value={formData.emergencyContact}
            onChange={handleChange}
          />
          {errors.emergencyContact && (
            <p className="error">{errors.emergencyContact}</p>
          )}
        </div>

        <div>
          <label>Marital Status</label>
          <select
            name="maritalStatus"
            value={formData.maritalStatus}
            onChange={handleChange}
          >
            <option value="">Select Status</option>
            <option value="MARRIED">MARRIED</option>
            <option value="SINGLE">SINGLE</option>
            <option value="DIVORCED">DIVORCED</option>
            <option value="WIDOWED">WIDOWED</option>
          </select>
        </div>

        <div>
          <label>Aadhaar Number</label>
          <input
            type="text"
            name="aadhaar"
            value={formData.aadhaar}
            onChange={handleChange}
          />
          {errors.aadhaar && <p className="error">{errors.aadhaar}</p>}
        </div>

        <div>
          <label>PAN Number</label>
          <input
            type="text"
            name="pan"
            value={formData.pan}
            onChange={handleChange}
          />
          {errors.pan && <p className="error">{errors.pan}</p>}
        </div>
      </div>

      {/* Current Address Fields */}
      <div className="address-section">
        <h3>Current Address</h3>
        <div className="grid-container">
          <div>
            <label>Street Details <span className="required">*</span></label>
            <input
              type="text"
              name="currentStreet"
              value={formData.currentStreet}
              onChange={handleChange}
            />
            {errors.currentStreet && <p className="error">{errors.currentStreet}</p>}
          </div>
          
          <div>
            <label>City <span className="required">*</span></label>
            <input
              type="text"
              name="currentCity"
              value={formData.currentCity}
              onChange={handleChange}
            />
            {errors.currentCity && <p className="error">{errors.currentCity}</p>}
          </div>
          
          <div>
            <label>State <span className="required">*</span></label>
            <input
              type="text"
              name="currentState"
              value={formData.currentState}
              onChange={handleChange}
            />
            {errors.currentState && <p className="error">{errors.currentState}</p>}
          </div>
          
          <div>
            <label>Country <span className="required">*</span></label>
            <input
              type="text"
              name="currentCountry"
              value={formData.currentCountry}
              onChange={handleChange}
            />
            {errors.currentCountry && <p className="error">{errors.currentCountry}</p>}
          </div>
          
          <div>
            <label>Zip <span className="required">*</span></label>
            <input
              type="text"
              name="currentZip"
              value={formData.currentZip}
              onChange={handleChange}
            />
            {errors.currentZip && <p className="error">{errors.currentZip}</p>}
          </div>
        </div>
      </div>

      {/* Permanent Address Fields */}
      <div className="address-section">
        <h3>Permanent Address</h3>
        <div className="grid-container">
          <div>
            <label>Street Details <span className="required">*</span></label>
            <input
              type="text"
              name="permanentStreet"
              value={formData.permanentStreet}
              onChange={handleChange}
            />
            {errors.permanentStreet && <p className="error">{errors.permanentStreet}</p>}
          </div>
          
          <div>
            <label>City <span className="required">*</span></label>
            <input
              type="text"
              name="permanentCity"
              value={formData.permanentCity}
              onChange={handleChange}
            />
            {errors.permanentCity && <p className="error">{errors.permanentCity}</p>}
          </div>
          
          <div>
            <label>State <span className="required">*</span></label>
            <input
              type="text"
              name="permanentState"
              value={formData.permanentState}
              onChange={handleChange}
            />
            {errors.permanentState && <p className="error">{errors.permanentState}</p>}
          </div>
          
          <div>
            <label>Country <span className="required">*</span></label>
            <input
              type="text"
              name="permanentCountry"
              value={formData.permanentCountry}
              onChange={handleChange}
            />
            {errors.permanentCountry && <p className="error">{errors.permanentCountry}</p>}
          </div>
          
          <div>
            <label>Zip <span className="required">*</span></label>
            <input
              type="text"
              name="permanentZip"
              value={formData.permanentZip}
              onChange={handleChange}
            />
            {errors.permanentZip && <p className="error">{errors.permanentZip}</p>}
          </div>
        </div>
      </div>

      <div className="button-container">
        <button type="submit" disabled={loading}>
          {loading ? (
            "Saving..."
          ) : (
            <>
              <Save className="icon" />
              Save Details
            </>
          )}
        </button>
      </div>
    </form>
  );
}