// import React from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import {
//     ArrowLeft,
//     User,
//     Mail,
//     Phone,
//     Building,
//     MapPin,
//     Calendar,
//     CreditCard,
//     Building2,
//     Edit,
//     UserCog,
//     Home,
//     UserCircle,
//     Briefcase
// } from 'lucide-react';
// import './EmployeeDetails.css';

// const EmployeeDetails = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();

//     // Mock employee data
    // const employee = {
    //     id: 'GAL0001',
    //     name: 'Subham Roy',
    //     personalDetails: {
    //         gender: 'Male',
    //         location: 'Mumbai',
    //         dateOfBirth: '1990-05-15',
    //         bloodGroup: 'B+',
    //         personalEmail: 'subham.roy@gmail.com',
    //         phoneNumber: '+91 98765 43210',
    //         emergencyContact: '+91 98765 43211',
    //         maritalStatus: 'Single',
    //         aadharNumber: '****-****-1234',
    //         panNumber: '******1234',
    //         currentAddress: '123, Silicon Valley Apartments, Whitefield, Bangalore - 560066',
    //         permanentAddress: '456, Green Valley, Mumbai - 400001'
    //     },
    //     employmentDetails: {
    //         employeeId: 'GAL0001',
    //         jobTitle: 'Senior Software Engineer',
    //         lineManager: 'Sarah Johnson',
    //         location: 'Bangalore',
    //         officeEmail: 'Sarah@company.com',
    //         dateOfJoining: '2023-01-15',
    //         employmentType: 'Full-time',
    //         uan: '******7890',
    //         pfAccountNumber: '******5678'
    //     },
    //     bankDetails: {
    //         accountHolder: 'Subham Roy',
    //         bankName: 'HDFC Bank',
    //         accountNumber: '****6789',
    //         ifscCode: 'HDFC0001234',
    //         accountStatus: 'Active',
    //         esicNumber: '********3456'
    //     },
    //     status: 'Active',
    //     avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e'
    // };

//     if (!employee) {
//         return <div>Employee not found</div>;
//     }

//     return (
//         <div className="employee-details-container">
//             {/* Header */}
//             <div className="employee-details-header">
//                 <button
//                     onClick={() => navigate('/employee')}
//                     className="back-button"
//                 >
//                     <ArrowLeft className="icon" />
//                     Back to Employee List
//                 </button>
//                 <div className="action-buttons">
//                     <button className="action-button">
//                         <Edit className="icon" />
//                         Edit Profile
//                     </button>
//                     <button className="action-button">
//                         <UserCog className="icon" />
//                         Manage Access
//                     </button>
//                 </div>
//             </div>

//             {/* Employee Overview */}
//             <div className="overview-card">
//                 <div className="overview-content">
//                     <img
//                         src={employee.avatar}
//                         alt={employee.name}
//                         className="employee-avatar"
//                     />
//                     <div className="employee-info">
//                         <div className="employee-header">
//                             <div>
//                                 <h1 className="employee-name">{employee.name}</h1>
//                                 <p className="employee-job-title">{employee.employmentDetails.jobTitle}</p>
//                             </div>
//                             <span className={`status-badge ${employee.status.toLowerCase()}`}>
//                                 {employee.status}
//                             </span>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Personal Details */}
//             <div className="details-card">
//                 <h2 className="details-title">
//                     <UserCircle className="icon" />
//                     Personal Details
//                 </h2>
//                 <div className="details-grid">
//                     <div>
//                         <p className="detail-label">Employee Name</p>
//                         <p className="detail-value">{employee.name}</p>
//                     </div>
//                     <div>
//                         <p className="detail-label">Gender</p>
//                         <p className="detail-value">{employee.personalDetails.gender}</p>
//                     </div>
//                     <div>
//                         <p className="detail-label">Location</p>
//                         <p className="detail-value">{employee.personalDetails.location}</p>
//                     </div>
//                     <div>
//                         <p className="detail-label">Date of Birth</p>
//                         <p className="detail-value">{employee.personalDetails.dateOfBirth}</p>
//                     </div>
//                     <div>
//                         <p className="detail-label">Blood Group</p>
//                         <p className="detail-value">{employee.personalDetails.bloodGroup}</p>
//                     </div>
//                     <div>
//                         <p className="detail-label">Personal Email</p>
//                         <p className="detail-value">{employee.personalDetails.personalEmail}</p>
//                     </div>
//                     <div>
//                         <p className="detail-label">Phone Number</p>
//                         <p className="detail-value">{employee.personalDetails.phoneNumber}</p>
//                     </div>
//                     <div>
//                         <p className="detail-label">Emergency Contact</p>
//                         <p className="detail-value">{employee.personalDetails.emergencyContact}</p>
//                     </div>
//                     <div>
//                         <p className="detail-label">Marital Status</p>
//                         <p className="detail-value">{employee.personalDetails.maritalStatus}</p>
//                     </div>
//                     <div>
//                         <p className="detail-label">Aadhar Number</p>
//                         <p className="detail-value">{employee.personalDetails.aadharNumber}</p>
//                     </div>
//                     <div>
//                         <p className="detail-label">Pan Number</p>
//                         <p className="detail-value">{employee.personalDetails.panNumber}</p>
//                     </div>
//                     <div>
//                         <p className="detail-label">Current Address</p>
//                         <p className="detail-value">{employee.personalDetails.currentAddress}</p>
//                     </div>
//                     <div>
//                         <p className="detail-label">Permanent Address</p>
//                         <p className="detail-value">{employee.personalDetails.permanentAddress}</p>
//                     </div>
//                 </div>
//             </div>

//             {/* Employment Details */}
//             <div className="details-card">
//                 <h2 className="details-title">
//                     <Briefcase className="icon" />
//                     Employment Details
//                 </h2>
//                 <div className="details-grid">
//                     <div>
//                         <p className="detail-label">Employee ID</p>
//                         <p className="detail-value">{employee.employmentDetails.employeeId}</p>
//                     </div>
//                     <div>
//                         <p className="detail-label">Job Title</p>
//                         <p className="detail-value">{employee.employmentDetails.jobTitle}</p>
//                     </div>
//                     <div>
//                         <p className="detail-label">Line Manager</p>
//                         <p className="detail-value">{employee.employmentDetails.lineManager}</p>
//                     </div>
//                     <div>
//                         <p className="detail-label">Location</p>
//                         <p className="detail-value">{employee.employmentDetails.location}</p>
//                     </div>
//                     <div>
//                         <p className="detail-label">Office Email</p>
//                         <p className="detail-value">{employee.employmentDetails.officeEmail}</p>
//                     </div>
//                     <div>
//                         <p className="detail-label">Date of Joining</p>
//                         <p className="detail-value">{employee.employmentDetails.dateOfJoining}</p>
//                     </div>
//                     <div>
//                         <p className="detail-label">Employment Type</p>
//                         <p className="detail-value">{employee.employmentDetails.employmentType}</p>
//                     </div>
//                     <div>
//                         <p className="detail-label">UAN</p>
//                         <p className="detail-value">{employee.employmentDetails.uan}</p>
//                     </div>
//                     <div>
//                         <p className="detail-label">PF Account Number</p>
//                         <p className="detail-value">{employee.employmentDetails.pfAccountNumber}</p>
//                     </div>
//                 </div>
//             </div>

//             {/* Bank Details */}
//             <div className="details-card">
//                 <h2 className="details-title">
//                     <CreditCard className="icon" />
//                     Bank Details
//                 </h2>
//                 <div className="details-grid">
//                     <div>
//                         <p className="detail-label">Account Holder's Name</p>
//                         <p className="detail-value">{employee.bankDetails.accountHolder}</p>
//                     </div>
//                     <div>
//                         <p className="detail-label">Bank Name</p>
//                         <p className="detail-value">{employee.bankDetails.bankName}</p>
//                     </div>
//                     <div>
//                         <p className="detail-label">Account Number</p>
//                         <p className="detail-value">{employee.bankDetails.accountNumber}</p>
//                     </div>
//                     <div>
//                         <p className="detail-label">IFSC Code</p>
//                         <p className="detail-value">{employee.bankDetails.ifscCode}</p>
//                     </div>
//                     <div>
//                         <p className="detail-label">Account Status</p>
//                         <p className="detail-value">{employee.bankDetails.accountStatus}</p>
//                     </div>
//                     <div>
//                         <p className="detail-label">ESIC Number</p>
//                         <p className="detail-value">{employee.bankDetails.esicNumber}</p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EmployeeDetails;



import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    Building,
    MapPin,
    Calendar,
    CreditCard,
    Building2,
    Edit,
    UserCog,
    Home,
    UserCircle,
    Briefcase
} from 'lucide-react';
import './EmployeeDetails.css';

const EmployeeDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // State to store employee data
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/employeeRoutes/fetchEmployeeDetailsById/${id}`);
                if (!response.ok) {
                    throw new Error('Employee not found');
                }
                const data = await response.json();
                setEmployee(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployeeData();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!employee) {
        return <div>Employee not found</div>;
    }

    return (
        <div className="employee-details-container">
            {/* Header */}
            <div className="employee-details-header">
                <button
                    onClick={() => navigate('/employee')}
                    className="back-button"
                >
                    <ArrowLeft className="icon" />
                    Back to Employee List
                </button>
                <div className="action-buttons">
                    <button className="action-button">
                        <Edit className="icon" />
                        Edit Profile
                    </button>
                    <button className="action-button">
                        <UserCog className="icon" />
                        Manage Access
                    </button>
                </div>
            </div>

            {/* Employee Overview */}
            <div className="overview-card">
                <div className="overview-content">
                    <img
                        src={employee.avatar}
                        alt={employee.name}
                        className="employee-avatar"
                    />
                    <div className="employee-info">
                        <div className="employee-header">
                            <div>
                                <h1 className="employee-name">{employee.name}</h1>
                                <p className="employee-job-title">{employee.employmentDetails.jobTitle}</p>
                            </div>
                            <span className={`status-badge ${employee.status.toLowerCase()}`}>
                                {employee.status}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Personal Details */}
            <div className="details-card">
                <h2 className="details-title">
                    <UserCircle className="icon" />
                    Personal Details
                </h2>
                <div className="details-grid">
                    <div>
                        <p className="detail-label">Employee Name</p>
                        <p className="detail-value">{employee.name}</p>
                    </div>
                    <div>
                        <p className="detail-label">Gender</p>
                        <p className="detail-value">{employee.personalDetails.gender}</p>
                    </div>
                    <div>
                        <p className="detail-label">Location</p>
                        <p className="detail-value">{employee.personalDetails.location}</p>
                    </div>
                    <div>
                        <p className="detail-label">Date of Birth</p>
                        <p className="detail-value">{employee.personalDetails.dateOfBirth}</p>
                    </div>
                    <div>
                        <p className="detail-label">Blood Group</p>
                        <p className="detail-value">{employee.personalDetails.bloodGroup}</p>
                    </div>
                    <div>
                        <p className="detail-label">Personal Email</p>
                        <p className="detail-value">{employee.personalDetails.personalEmail}</p>
                    </div>
                    <div>
                        <p className="detail-label">Phone Number</p>
                        <p className="detail-value">{employee.personalDetails.phoneNumber}</p>
                    </div>
                    <div>
                        <p className="detail-label">Emergency Contact</p>
                        <p className="detail-value">{employee.personalDetails.emergencyContact}</p>
                    </div>
                    <div>
                        <p className="detail-label">Marital Status</p>
                        <p className="detail-value">{employee.personalDetails.maritalStatus}</p>
                    </div>
                    <div>
                        <p className="detail-label">Aadhar Number</p>
                        <p className="detail-value">{employee.personalDetails.aadharNumber}</p>
                    </div>
                    <div>
                        <p className="detail-label">Pan Number</p>
                        <p className="detail-value">{employee.personalDetails.panNumber}</p>
                    </div>
                    <div>
                        <p className="detail-label">Current Address</p>
                        <p className="detail-value">{employee.personalDetails.currentAddress}</p>
                    </div>
                    <div>
                        <p className="detail-label">Permanent Address</p>
                        <p className="detail-value">{employee.personalDetails.permanentAddress}</p>
                    </div>
                </div>
            </div>

            {/* Employment Details */}
            <div className="details-card">
                <h2 className="details-title">
                    <Briefcase className="icon" />
                    Employment Details
                </h2>
                <div className="details-grid">
                    <div>
                        <p className="detail-label">Employee ID</p>
                        <p className="detail-value">{employee.employmentDetails.employeeId}</p>
                    </div>
                    <div>
                        <p className="detail-label">Job Title</p>
                        <p className="detail-value">{employee.employmentDetails.jobTitle}</p>
                    </div>
                    <div>
                        <p className="detail-label">Line Manager</p>
                        <p className="detail-value">{employee.employmentDetails.lineManager}</p>
                    </div>
                    <div>
                        <p className="detail-label">Location</p>
                        <p className="detail-value">{employee.employmentDetails.location}</p>
                    </div>
                    <div>
                        <p className="detail-label">Office Email</p>
                        <p className="detail-value">{employee.employmentDetails.officeEmail}</p>
                    </div>
                    <div>
                        <p className="detail-label">Date of Joining</p>
                        <p className="detail-value">{employee.employmentDetails.dateOfJoining}</p>
                    </div>
                    <div>
                        <p className="detail-label">Employment Type</p>
                        <p className="detail-value">{employee.employmentDetails.employmentType}</p>
                    </div>
                    <div>
                        <p className="detail-label">UAN</p>
                        <p className="detail-value">{employee.employmentDetails.uan}</p>
                    </div>
                    <div>
                        <p className="detail-label">PF Account Number</p>
                        <p className="detail-value">{employee.employmentDetails.pfAccountNumber}</p>
                    </div>
                </div>
            </div>

            {/* Bank Details */}
            <div className="details-card">
                <h2 className="details-title">
                    <CreditCard className="icon" />
                    Bank Details
                </h2>
                <div className="details-grid">
                    <div>
                        <p className="detail-label">Account Holder's Name</p>
                        <p className="detail-value">{employee.bankDetails.accountHolder}</p>
                    </div>
                    <div>
                        <p className="detail-label">Bank Name</p>
                        <p className="detail-value">{employee.bankDetails.bankName}</p>
                    </div>
                    <div>
                        <p className="detail-label">Account Number</p>
                        <p className="detail-value">{employee.bankDetails.accountNumber}</p>
                    </div>
                    <div>
                        <p className="detail-label">IFSC Code</p>
                        <p className="detail-value">{employee.bankDetails.ifscCode}</p>
                    </div>
                    <div>
                        <p className="detail-label">Account Status</p>
                        <p className="detail-value">{employee.bankDetails.accountStatus}</p>
                    </div>
                    <div>
                        <p className="detail-label">ESIC Number</p>
                        <p className="detail-value">{employee.bankDetails.esicNumber}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDetails;
