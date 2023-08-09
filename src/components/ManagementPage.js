import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
import "./WelcomePage.css";

function ManagementPage() {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [usernames, setUsernames] = useState([]);

  useEffect(() => {
    if (!isAuthenticated || user.username !== "doron") {
      alert("Access Denied!");
      // Redirect or do something to handle unauthorized access.
      return;
    }

    const fetchData = async () => {
      try {
        const usernamesResponse = await axios.get(
          "http://localhost:8080/usernames"
        );
        if (usernamesResponse.data.success) {
          setUsernames(usernamesResponse.data.usernames);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [isAuthenticated, user]);

  return (
    <div className="welcome-page">
      <div className="welcome-section">
        <h2>Usernames</h2>
        <div className="usernames-list">
          {usernames.map((username) => (
            <div key={username} className="team-averages">
              {username}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ManagementPage;
