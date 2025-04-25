import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaUser, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";
import { loginUser } from "../services/userService";
import "./Login.css";



const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!username || !password) {
      setError("Please enter both username and password.");
      setLoading(false);
      return;
    }

    try {
      const role = (await loginUser(username, password)).toUpperCase();


      window.localStorage.setItem("userRole", role);
      window.localStorage.setItem("isLoggedIn", "true");
      window.localStorage.setItem("username", username);

      if (role === "ADMIN") {
        navigate("/admin-dashboard");
      } else if (role === "USER") {
        navigate("/user-dashboard");
      } else {
        setError("Unknown role received from server.");
      }
    } catch (err) {
      console.error(err);
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="d-flex">
        <motion.div
          className="login-box"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <h2 className="text-center mb-4">Login</h2>

          <form className="login-form" onSubmit={handleLogin}>
            {/* Username Field with Icon */}
            <div className="mb-3 position-relative">
              <FaUser className="input-icon" />
              <input
                type="text"
                className="form-control login-input ps-5"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Password Field with Icon & Toggle */}
            <div className="mb-3 position-relative">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                className="form-control login-input ps-5 pe-5"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="password-toggle-icon"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="btn btn-primary w-100 login-btn"
              disabled={loading}
            >
              {loading ? "Loading..." : "Login"}
            </button>

            {/* Error Message */}
            {error && <p className="text-danger mt-3 text-center">{error}</p>}

            {/* Register & Forgot Password */}
            <div className="mt-4 text-center">
              <p className="mb-2">
                Not registered?{" "}
                <span
                  className="chnage"
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                  onClick={() => navigate("/register")}
                >
                  Register here
                </span>
              </p>
              <p>
                <span
                  className="chnage"
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot Password?
                </span>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;