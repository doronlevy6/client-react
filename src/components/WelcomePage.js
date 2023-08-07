import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function WelcomePage() {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [usernames, setUsernames] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    } else {
      const fetchData = async () => {
        try {
          const usernamesResponse = await axios.get(
            "http://localhost:8080/usernames"
          );

          if (usernamesResponse.data.success) {
            setUsernames(usernamesResponse.data.usernames);
          }

          const teamsResponse = await axios.get(
            "http://localhost:8080/get-teams"
          );

          if (teamsResponse.data.success) {
            setTeams(teamsResponse.data.teams);
          }
        } catch (error) {
          console.error(error);
        }
      };

      fetchData();
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
      <div>
        <h2>Teams</h2>
        {Array.isArray(teams) && teams.length > 0 ? (
          teams.map((team, index) => (
            <div key={index}>
              <h3>Team {index + 1}</h3>
              {Array.isArray(team) ? (
                team.map((player, i) => <p key={i}>{player.username}</p>)
              ) : (
                <p>No players in this team.</p>
              )}
            </div>
          ))
        ) : (
          <p>No teams created.</p>
        )}
      </div>
    </div>
  );
}

export default WelcomePage;
