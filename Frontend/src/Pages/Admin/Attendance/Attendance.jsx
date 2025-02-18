import React from 'react';
import { Outlet } from 'react-router-dom';

const Attendance = () => {
    return (
        <div>
            {/* <h1>Attendance Page</h1> */}
            {/* This is where the nested routes will render */}
            <Outlet />
        </div>
    );
};

export default Attendance;
