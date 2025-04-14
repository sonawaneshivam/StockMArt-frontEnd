import React from 'react';
import { Navbar } from 'react-bootstrap';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRout = () => {
    const isLoggedIn = window.localStorage.getItem("isLoggedIn");
    return isLoggedIn==="true"?<Outlet></Outlet>:<Navigate to="/login"></Navigate>
    
}

export default ProtectedRout;
