import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function WelcomePage() {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [usernames, setUsernames] = useState([]);
  const [teams, setTeams] = useState([]);

  const fetchTeams = async () => {
    try {
      const response = await axios.get("http://localhost:8080/get-teams");

      if (response.data.success) {
        setTeams(response.data.teams);
      }
    } catch (error) {
      console.error(error);
    }
  };

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
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div>
        <h2>Usernames</h2>
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
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
        }}
      >
        {Array.isArray(teams) ? (
          teams.map((team, index) => (
            <div key={index} style={{ marginLeft: "16px" }}>
              <h3>Team {index + 1}</h3>
              {Array.isArray(team) ? (
                team.map((player, i) => <p key={i}>{player.username}</p>)
              ) : (
                <p>No players in this team.</p>
              )}
            </div>
          ))
        ) : (
          <div>
            <button onClick={fetchTeams}>Create Teams</button>
            <p>No teams created.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default WelcomePage;
