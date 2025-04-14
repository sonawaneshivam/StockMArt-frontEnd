import React from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { FaShoppingCart } from "react-icons/fa"; // <- cart icon
import "./Navbar.css";

const NavigationBar = ({ onLogout }) => {
  // Get role and isLoggedIn from localStorage
  const role = window.localStorage.getItem("userRole");
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
            <NavLink
              to="/"
              className={({ isActive }) => `nav-hover nav-link ${isActive ? "active-link" : ""}`}
            >
              Home
            </NavLink>

            {!isLoggedIn && (
              <>
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
                  Admin Panel
                </NavLink>
                <NavLink
                  to="/categories"
                  className={({ isActive }) => `nav-hover nav-link ${isActive ? "active-link" : ""}`}
                >
                  Categories
                </NavLink>
              </>
            )}

            {isLoggedIn && (
              <Button variant="outline-light" size="sm" onClick={onLogout} className="ms-3">
                Logout
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
