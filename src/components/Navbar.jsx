import React from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { FaShoppingCart } from "react-icons/fa"; // <- cart icon
import "./Navbar.css";

const NavigationBar = ({ onLogout }) => {
  
  const role = window.localStorage.getItem("userRole")?.toUpperCase();
  const isLoggedIn = window.localStorage.getItem("isLoggedIn") === "true";

  return (
    <Navbar expand="lg" bg="dark" variant="dark" sticky="top" className="shadow-sm">
      <Container>
        {/* Brand Logo */}
        <div className="brand-logo">
          <FaShoppingCart className="brand-icon" />
          <span className="brand-text">StockMart</span>
        </div>

        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar" className="justify-content-end">
          <Nav className="align-items-center">


            {!isLoggedIn && (
              <>
                <NavLink
                  to="/"
                  className={({ isActive }) => `nav-hover nav-link ${isActive ? "active-link" : ""}`}
                >
                  Home
                </NavLink>
                <NavLink
                  to="/login"
                  className={({ isActive }) => `nav-hover nav-link ${isActive ? "active-link" : ""}`}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) => `nav-hover nav-link ${isActive ? "active-link" : ""}`}
                >
                  Register
                </NavLink>
              </>
            )}

            {isLoggedIn && role === "USER" && (
              <>
                <NavLink
                  to="/user-dashboard"
                  className={({ isActive }) => `nav-hover nav-link ${isActive ? "active-link" : ""}`}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/search"
                  className={({ isActive }) => `nav-hover nav-link ${isActive ? "active-link" : ""}`}
                >
                  Search
                </NavLink>
              </>
            )}

            {isLoggedIn && role === "ADMIN" && (
              <>
                <NavLink
                  to="/admin-dashboard"
                  className={({ isActive }) => `nav-hover nav-link ${isActive ? "active-link" : ""}`}
                >
                  Admin_dashbord
                </NavLink>
                <NavLink
                  to="/Category"
                  className={({ isActive }) => `nav-hover nav-link ${isActive ? "active-link" : ""}`}
                >
                  Categories
                </NavLink>
              </>
            )}

            {isLoggedIn && (
              <div className=" mt-2 w-100 d-flex justify-content-center align-items-center">
              <Button
                variant="outline-light"
                size="sm"
                onClick={() => {
                  onLogout();
                  handleNavItemClick(); // Close sidebar on logout
                }}
              >
                Logout
              </Button>
            </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
