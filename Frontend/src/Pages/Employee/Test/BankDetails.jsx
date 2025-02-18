import React from "react";
import "./BankDetails.css";

const AddBankDetails = () => {

    const bankFormData = {
        accountHolderName: "Subham Roy",
        bankName: "State Bank of India",
        accountNumber: "1234567XXXXXXX",
        ifscCode: "SBIN0001234",
        accountStatus: "Active",
    };

    return (
        <div className="bank-details-container">
            <div className="header-container">
                <h2>Bank Details</h2>
                <button className="edit-button">Edit</button>
            </div>
            <div className="bank-details-grid">
                {/* Account Holder's Name */}
                <div className="bank-details-item">
                    <label>Account Holder's Name:</label>
                    <p>{bankFormData.accountHolderName}</p>
                </div>

                {/* Bank Name */}
                <div className="bank-details-item">
                    <label>Bank Name:</label>
                    <p>{bankFormData.bankName}</p>
                </div>

                {/* Account Number */}
                <div className="bank-details-item">
                    <label>Account Number:</label>
                    <p>{bankFormData.accountNumber}</p>
                </div>

                {/* IFSC Code */}
                <div className="bank-details-item">
                    <label>IFSC Code:</label>
                    <p>{bankFormData.ifscCode}</p>
                </div>

                {/* Account Status */}
                <div className="bank-details-item">
                    <label>Bank Account Status:</label>
                    <p>{bankFormData.accountStatus}</p>
                </div>
            </div>
        </div>
    );
};

export default AddBankDetails;