// import React from "react";
// import "./BankDetails.css"; 

// const BankDetails = () => {
//     // Dummy data for now, will replace it with actual data later
//     const bankFormData = {
//         accountHolderName: "Subham Roy",
//         bankName: "State Bank of India",
//         accountNumber: "1234567XXXXXXX",
//         ifscCode: "SBIN0001234",
//         accountStatus: "Active",
//     };

//     return (
//         <div className="bank-details-container">
           
//             <div className="bank-details-grid">
//                 {/* Account Holder's Name */}
//                 <div className="bank-details-item">
//                     <label>Account Holder's Name:</label>
//                     <p>{bankFormData.accountHolderName}</p>
//                 </div>

//                 {/* Bank Name */}
//                 <div className="bank-details-item">
//                     <label>Bank Name:</label>
//                     <p>{bankFormData.bankName}</p>
//                 </div>

//                 {/* Account Number */}
//                 <div className="bank-details-item">
//                     <label>Account Number:</label>
//                     <p>{bankFormData.accountNumber}</p>
//                 </div>

//                 {/* IFSC Code */}
//                 <div className="bank-details-item">
//                     <label>IFSC Code:</label>
//                     <p>{bankFormData.ifscCode}</p>
//                 </div>

//                 {/* Account Status */}
//                 <div className="bank-details-item">
//                     <label>Bank Account Status:</label>
//                     <p>{bankFormData.accountStatus}</p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default BankDetails;



import React, { useEffect, useState } from "react";
import "./BankDetails.css"; 

const API_BASE_URL_ED = import.meta.env.VITE_API_BASE_URL_ED;
const BankDetails = () => {
    const [bankDetails, setBankDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBankDetails = async () => {
            try {
                const signedUserId = localStorage.getItem("signedUserId"); // Fetch from localStorage

                if (!signedUserId) {
                  setError("Unauthorized: No signedUserId found.");
                  setLoading(false);
                  return;
                }
                const response = await fetch(`${API_BASE_URL_ED}/api/employeeRoutes/bank-details/${signedUserId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch bank details");
                }
                const data = await response.json();
                setBankDetails(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

            fetchBankDetails();
        
    }, []);

    if (loading) return <p>Loading bank details...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!bankDetails) return <p>No bank details found.</p>;

    return (
        <div className="bank-details-container">
            <div className="bank-details-grid">
                <div className="bank-details-item">
                    <label>Account Holder's Name:</label>
                    <p>{bankDetails.accountHolderName}</p>
                </div>
                <div className="bank-details-item">
                    <label>Bank Name:</label>
                    <p>{bankDetails.bankName}</p>
                </div>
                <div className="bank-details-item">
                    <label>Account Number:</label>
                    <p>{bankDetails.accountNumber}</p>
                </div>
                <div className="bank-details-item">
                    <label>IFSC Code:</label>
                    <p>{bankDetails.ifscCode}</p>
                </div>
                <div className="bank-details-item">
                    <label>Bank Account Status:</label>
                    <p>{bankDetails.accountStatus}</p>
                </div>
            </div>
        </div>
    );
};

export default BankDetails;

