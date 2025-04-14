import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

import NavigationBar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRout from "./components/ProtectedRout";
import Serach from "./pages/user/Serach";
import Categories from "./pages/admin/Categories";

function App() {
  const navigate = useNavigate();
  const isLoggedIn = window.localStorage.getItem("isLoggedIn") === "true";
  const userRole = window.localStorage.getItem("userRole");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <NavigationBar role={userRole} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        {/* unotherize logedin */}

        {!isLoggedIn &&(
          <>
          <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
          </>
        )}
        



        <Route element={<ProtectedRout></ProtectedRout>}>
        <Route path="/login" element={<Navigate to="/" />} />
        <Route path="/register" element={<Navigate to="/" />} />
        {userRole !=="ADMIN" ?(
          <>
          <Route path="/user-dashboard" element={<UserDashboard /> }/>
          <Route path="/search" element={<Serach></Serach>} />
          </>
        ):(
          <>
          <Route path="/admin-dashboard" element={<AdminDashboard></AdminDashboard>}/>
          <Route pathe="/Categories" element={<Categories></Categories>} />
          </>
        )}
        
        
        </Route>
        <Route path="*" element={<div className="p-4">404 - Page Not Found</div>} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
