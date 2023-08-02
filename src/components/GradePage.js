import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function GradePage() {
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
          console.log("\n response", response.data.usernames, "\n");

          if (response.data.success && user) {
            const filteredUsernames = response.data.usernames.filter(
              (username) => username !== user.username
            );

            setUsernames(filteredUsernames);
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
      <h2>
        <div>Your grades are shown here</div>
      </h2>

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

export default GradePage;
