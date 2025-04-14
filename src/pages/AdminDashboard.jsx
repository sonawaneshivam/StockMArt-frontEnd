// src/pages/AdminDashboard.jsx
import React from "react";
import { Navbar } from "react-bootstrap";
import Footer from "../components/Footer";

const AdminDashboard = () => {
  return (
    <>
    <Navbar></Navbar>
    <div className="p-4">
      <h2>Admin Dashboard</h2>
      <p>Welcome, Admin! Here you can manage users, inventory, billing, etc.</p>
    </div>
    
    </>
  );
};

export default AdminDashboard;
