"use client";

import React, { useState } from "react";
import { redirect } from "next/navigation"; // Import redirect for navigation
import "@styles/auth/authpage.css"; // Reuse the same CSS styles

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("0"); // Default to "user" role
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const SERVER_IP = process.env.NEXT_PUBLIC_SERVER_IP;

  const handleRegister = async () => {
    try {
      setErrorMessage(""); // Clear previous error message
      setSuccessMessage(""); // Clear previous success message
  
      // Construct the request payload
      const payload = {
        username,
        password,
        role: parseInt(role), // Convert role to an integer (0 for User, 1 for Admin)
      };
  
      // Send the request with the payload in the body
      const response = await fetch(`https://${SERVER_IP}/api/User/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload), // Send data in the body
      });
  
      if (response.ok) {
        setSuccessMessage("Registration successful! Redirecting to login...");
        setTimeout(() => {
          redirect("/login"); // Redirect to login after 1 second
        }, 1000);
      } else {
        const errorData = await response.json(); // Parse the error response as JSON
        setErrorMessage(errorData.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error registering:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <h2>Register</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="role-select"
        style={{ margin: "0.5rem", width: "90%", border: "1px solid #ccc" }}
      >
        <option value="0">User</option>
        <option value="1">Admin</option>
      </select>
      <button onClick={handleRegister}>Register</button>

      {/* Button to go back to login */}
      <div className="register-redirect">
        <p>Already have an account?</p>
        <button onClick={() => redirect("/login")}>Back to Login</button>
      </div>
    </div>
  );
};

export default RegisterPage;