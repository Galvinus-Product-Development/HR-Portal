import React, { useState } from 'react';
import { Upload } from 'lucide-react';

export default function Leave() {
    const [leaveType, setLeaveType] = useState('annual');
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };

}