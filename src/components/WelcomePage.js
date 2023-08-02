import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function WelcomePage() {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [usernames, setUsernames] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    } else {
      const fetchUsernames = async () => {
        try {
          const response = await axios.get("http://localhost:8080/usernames");

          if (response.data.success) {
            setUsernames(response.data.usernames);
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchUsernames();
    }
  }, [isAuthenticated, navigate, user]);

  return (
    <div>
      <h2>Welcome Page</h2>
      <p>Welcome to the app!</p>
      <table>
        <thead>
          <tr>
            <th>Usernames</th>
          </tr>
        </thead>
        <tbody>
          {usernames.map((username, index) => (
            <tr key={index}>
              <td>{username}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default WelcomePage;
