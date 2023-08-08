import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./WelcomePage.css";
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
  console.log("\n teMS", teams, "\n");

  return (
    <div className="welcome-page">
      <div className="welcome-section">
        <h2>Usernames</h2>
        <div className="usernames-list">
          {usernames.map((username, index) => (
            <div key={index} className="team-averages">
              {username}
            </div>
          ))}
        </div>
      </div>
      <div className="welcome-section">
        <h2>Teams and Averages</h2>
        {Array.isArray(teams) && teams.length > 0 ? (
          teams.map((team, index) => {
            const averages = {
              skill_level: 0,
              scoring_ability: 0,
              defensive_skills: 0,
              speed_and_agility: 0,
              shooting_range: 0,
              rebound_skills: 0,
            };
            team.forEach((player) => {
              for (const attr in averages) {
                averages[attr] += Number(player[attr]);
              }
            });
            for (const attr in averages) {
              averages[attr] /= team.length;
            }
            //
            return (
              <div key={index} className="team-averages">
                <div>
                  <h3>Team {index + 1}</h3>
                  {Array.isArray(team) ? (
                    team.map((player, i) => <p key={i}>{player.username}</p>)
                  ) : (
                    <p>No players in this team.</p>
                  )}
                </div>
                <div>
                  <h3>Averages:</h3>
                  <p>Skill Level: {averages.skill_level}</p>
                  <p>Scoring Ability: {averages.scoring_ability}</p>
                  <p>Defensive Skills: {averages.defensive_skills}</p>
                  <p>Speed and Agility: {averages.speed_and_agility}</p>
                  <p>Shooting Range: {averages.shooting_range}</p>
                  <p>Rebound Skills: {averages.rebound_skills}</p>
                </div>
              </div>
            );
          })
        ) : (
          <p>No teams created.</p>
        )}
      </div>
    </div>
  );
}
export default WelcomePage;
