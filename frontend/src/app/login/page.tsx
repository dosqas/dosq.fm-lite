"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "@styles/login/loginpage.css";
import { isLoggedIn, setToken } from "@utils/authUtils";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();
  const SERVER_IP = process.env.NEXT_PUBLIC_SERVER_IP;

  // Check if already logged in and redirect if needed
  useEffect(() => {
    console.log("Login page mounted, checking auth status");
    
    if (isLoggedIn()) {
      console.log("User is already logged in, redirecting to profile");
      router.replace("/profile");
    } else {
      console.log("User is not logged in, showing login form");
      setCheckingAuth(false);
    }
  }, [router]);

  const handleLogin = async () => {
    try {
      console.log("Login attempt for user:", username);
      setErrorMessage("");
      setSuccessMessage("");

      if (!username || !password) {
        setErrorMessage("Please enter both username and password.");
        return;
      }

      // Construct the request payload
      const payload = {
        username,
        password,
      };

      console.log("Sending login request");
      
      // Send the request with the payload in the body
      const response = await fetch(`http://${SERVER_IP}/api/User/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Login response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Login successful, received token");
        
        // Store the token using our utility function
        setToken(data.token);
        console.log("Token saved to localStorage");
        
        setSuccessMessage("Login successful! Redirecting to profile...");
        
        // Direct navigation after a brief delay to show success message
        setTimeout(() => {
          console.log("Redirecting to profile...");
          router.push("/profile");
        }, 1000);
      } else {
        try {
          const errorData = await response.json();
          console.log("Login error:", errorData);
          setErrorMessage(errorData.message || "Invalid username or password. Please try again.");
        } catch (e) {
          const errorText = await response.text();
          console.log("Login error (non-JSON):", errorText);
          setErrorMessage(errorText || "An unexpected error occurred. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  const handleRegister = () => {
    router.push("/register");
  };

  // If still checking authentication status, show loading
  if (checkingAuth) {
    return <div className="login-page loading">Checking login status...</div>;
  }

  // Otherwise show login form
  return (
    <div className="login-page">
      <h2>Welcome back</h2>
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
      <button onClick={handleLogin}>Login</button>

      <div className="register-redirect">
        <p>Don't have an account?</p>
        <button onClick={handleRegister}>Register</button>
      </div>
    </div>
  );
};

export default LoginPage;