import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function GradePage() {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [grading, setGrading] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    } else {
      const fetchUsernames = async () => {
        try {
          const response = await axios.get("http://localhost:8080/usernames");
          console.log("\n response12", response, "\n");

          if (response.data.success && user) {
            const filteredUsernames = response.data.usernames.filter(
              (username) => username.username !== user.username
            );
            console.log("\n filteredUsernames", filteredUsernames, "\n");

            const initialGradingPromises = filteredUsernames.map((username) =>
              axios.get(`http://localhost:8080/rankings/${username.username}`)
            );
            const rankingsResponses = await Promise.all(initialGradingPromises);
            console.log("\n rankingsResponses", rankingsResponses, "\n");

            const initialGrading = rankingsResponses.map((response, index) => {
              if (
                response.data.success &&
                response.data.rankings &&
                response.data.rankings.length > 0
              ) {
                // If rankings exist for the user, initialize with the existing values
                return response.data.rankings[0];
              } else {
                // If no rankings exist, initialize with 5 for each category
                console.log(
                  "\n filteredUsernames[index].username",
                  filteredUsernames[index],
                  "\n"
                );

                return {
                  username: filteredUsernames[index],
                  skillLevel: 5,
                  scoringAbility: 5,
                  defensiveSkills: 5,
                  speedAndAgility: 5,
                  shootingRange: 5,
                  reboundSkills: 5,
                };
              }
            });

            setGrading(initialGrading);
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchUsernames();
    }
  }, [isAuthenticated, navigate, user]);

  const submitGrading = async () => {
    try {
      console.log("\n xxx", user.username, "\n");
      console.log("\n grading", grading, "\n");

      const response = await axios.post("http://localhost:8080/rankings", {
        rater_username: user.username,
        rankings: grading,
      });
      if (response.data.success) {
        alert("Successfully submitted grading!");
      } else {
        alert("Failed to submit grading.");
      }
    } catch (error) {
      alert("Failed to submit grading.");
    }
  };
  const handleInputChange = (playerUsername, category) => (event) => {
    setGrading((prevGrading) =>
      prevGrading.map((gradingPlayer) =>
        gradingPlayer.username === playerUsername
          ? {
              ...gradingPlayer,
              [category]: Number(event.target.value),
            }
          : gradingPlayer
      )
    );
  };

  // You can add a submit function here to send the grading data back to the server
  console.log("\n grading1", grading, "\n");

  return (
    <div>
      <h2>Your grades are shown here</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Skill Level</th>
            <th>Scoring Ability</th>
            <th>Defensive Skills</th>
            <th>Speed and Agility</th>
            <th>Shooting Range</th>
            <th>Rebound Skills</th>
          </tr>
        </thead>
        <tbody>
          {grading.map((player, index) => (
            <tr key={index}>
              <td>{player.username}</td>
              <td>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={player.skillLevel}
                  onChange={handleInputChange(player.username, "skillLevel")}
                />
              </td>
              <td>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={player.scoringAbility}
                  onChange={handleInputChange(
                    player.username,
                    "scoringAbility"
                  )}
                />
              </td>
              <td>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={player.defensiveSkills}
                  onChange={handleInputChange(
                    player.username,
                    "defensiveSkills"
                  )}
                />
              </td>
              <td>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={player.speedAndAgility}
                  onChange={handleInputChange(
                    player.username,
                    "speedAndAgility"
                  )}
                />
              </td>
              <td>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={player.shootingRange}
                  onChange={handleInputChange(player.username, "shootingRange")}
                />
              </td>
              <td>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={player.reboundSkills}
                  onChange={handleInputChange(player.username, "reboundSkills")}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={submitGrading}>Submit</button>
      {/* You can add a submit button here */}
    </div>
  );
}

export default GradePage;
