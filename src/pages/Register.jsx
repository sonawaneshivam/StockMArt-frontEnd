import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaPhone, FaLock, FaIdBadge } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import userService from "../services/userService";
import "./Register.css";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const formik = useFormik({
    initialValues: {
      first_Name: "",
      last_Name: "",
      email: "",
      phone_number: "",
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      email: Yup.string().email("Invalid email").matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, "Must be a Gmail address").required("Email is required"),
      phone: Yup.string().matches(/^\d{10}$/, "Phone must be 10 digits").required("Phone is required"),
      username: Yup.string().required("Username is required"),
      password: Yup.string().min(6, "Minimum 6 characters").required("Password is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await userService(values);
        toast.success("Registered successfully!");
        resetForm();
      } catch (error) {
        toast.error("Registration failed: " + error.message);
      }
    },
  });

  // Clear the error and touched states after 2 seconds
  useEffect(() => {
    const hasErrors = Object.keys(formik.errors).length > 0;
    const hasTouched = Object.keys(formik.touched).length > 0;

    if (hasErrors && hasTouched) {
      const timer = setTimeout(() => {
        formik.setTouched({});
        formik.setErrors({});
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [formik.errors, formik.touched]);

  return (
    <div className="login-wrapper">
      <motion.div
        className="login-box"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <h2 className="text-center mb-4">Register</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="row mb-3">
            <div className="col">
              <div className="input-group-icon">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  name="first_Name"
                  className="form-control icon-input"
                  placeholder="First Name"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.firstName && formik.errors.firstName && (
                <div className="error-message">
                  <FaUser className="input-icon-error" />
                  <small className="text-danger" style={{fontWeight:"bold"}}>{formik.errors.firstName}</small>
                </div>
              )}
            </div>
            <div className="col">
              <div className="input-group-icon">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  name="last_Name"
                  className="form-control icon-input"
                  placeholder="Last Name"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.lastName && formik.errors.lastName && (
                <div className="error-message">
                  <FaUser className="input-icon-error" />
                  <small className="text-danger" style={{fontWeight:"bold"}}>{formik.errors.lastName}</small>
                </div>
              )}
            </div>
          </div>

          <div className="mb-3">
            <div className="input-group-icon">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                name="email"
                className="form-control icon-input"
                placeholder="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <div className="error-message">
                <FaEnvelope className="input-icon-error" />
                <small className="text-danger" style={{fontWeight:"bold"}}>{formik.errors.email}</small>
              </div>
            )}
          </div>

          <div className="mb-3">
            <div className="input-group-icon">
              <FaPhone className="input-icon" />
              <input
                type="text"
                name="phone_number"
                className="form-control icon-input"
                placeholder="Phone Number"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.phone && formik.errors.phone && (
              <div className="error-message">
                <FaPhone className="input-icon-error" />
                <small className="text-danger" style={{fontWeight:"bold"}}>{formik.errors.phone}</small>
              </div>
            )}
          </div>

          <div className="mb-3">
            <div className="input-group-icon">
              <FaIdBadge className="input-icon" />
              <input
                type="text"
                name="username"
                className="form-control icon-input"
                placeholder="Username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.username && formik.errors.username && (
              <div className="error-message">
                <FaIdBadge className="input-icon-error" />
                <small className="text-danger" style={{fontWeight:"bold"}}>{formik.errors.username}</small>
              </div>
            )}
          </div>

          <div className="mb-3 position-relative">
            <div className="input-group-icon">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-control icon-input pe-5"
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {formik.touched.password && formik.errors.password && (
              <div className="error-message">
                <FaLock className="input-icon-error" />
                <small className="text-danger" style={{fontWeight:"bold"}}  >{formik.errors.password}</small>
              </div>
            )}
          </div>
            
          <button type="submit" className="btn btn-primary w-100 login-btn">
            Register
          </button>
        </form>
      </motion.div>
      <ToastContainer position="top-center" autoClose={6000} />
    </div>
  );
};

export default Register;