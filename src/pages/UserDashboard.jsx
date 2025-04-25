// src/pages/UserDashboard.jsx
import React from "react";
import { Navbar } from "react-bootstrap";
import Footer from "../components/Footer";

const UserDashboard = () => {
  return (
    <>
    <Navbar></Navbar>
    <div className="p-4">
      <h2>User Dashboard</h2>
      <p>Welcome! Check your bills, stock, and reports here.</p>
    </div>
    
    </>
  );
};

export default UserDashboard;
