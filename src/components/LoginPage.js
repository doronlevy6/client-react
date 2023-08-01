import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false); // Start with the login form
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/register", {
        username,
        password,
        email,
      });

      if (response.data.success) {
        const loginResponse = await axios.post("http://localhost:8080/login", {
          username,
          password,
        });

        if (loginResponse.data.success) {
          navigate("/welcome");
        } else {
          setErrorMessage(loginResponse.data.message);
        }
      } else {
        setErrorMessage(response.data.message);
      }
      setUsername("");
      setPassword("");
      setEmail("");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/login", {
        username,
        password,
      });

      if (response.data.success) {
        navigate("/welcome");
      } else {
        setErrorMessage(response.data.message);
      }
      setUsername("");
      setPassword("");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="login-page">
      {!isRegister ? (
        <React.Fragment>
          <button onClick={() => setIsRegister(true)}>Go to Register</button>
          <h2>Login </h2>
          <form className="login-form" onSubmit={handleLogin}>
            <input
              className="input-field"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="input-field"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="submit-button" type="submit">
              Login
            </button>
          </form>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <button onClick={() => setIsRegister(false)}>Go to Login</button>
          <h2>Register </h2>
          <form className="login-form" onSubmit={handleRegister}>
            <input
              className="input-field"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="input-field"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              className="input-field"
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="submit-button" type="submit">
              Register
            </button>
          </form>
        </React.Fragment>
      )}
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}

export default LoginPage;
