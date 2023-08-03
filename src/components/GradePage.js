import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button, Container, Table, Row, Col, Form } from "react-bootstrap";

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
          if (response.data.success && user) {
            const filteredUsernames = response.data.usernames.filter(
              (username) => {
                return username !== user.username;
              }
            );

            const initialGradingPromises = filteredUsernames.map((username) => {
              return axios.get(`http://localhost:8080/rankings/${username}`);
            });

            const rankingsResponses = await Promise.all(initialGradingPromises);

            const initialGrading = rankingsResponses.map((response, index) => {
              if (
                response.data.success &&
                response.data.rankings &&
                response.data.rankings.length > 0
              ) {
                return {
                  username: response.data.rankings[0].rated_username,
                  skillLevel: response.data.rankings[0].skill_level,
                  scoringAbility: response.data.rankings[0].scoring_ability,
                  defensiveSkills: response.data.rankings[0].defensive_skills,
                  speedAndAgility: response.data.rankings[0].speed_and_agility,
                  shootingRange: response.data.rankings[0].shooting_range,
                  reboundSkills: response.data.rankings[0].rebound_skills,
                };
              } else {
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

  return (
    <Container className="mt-3">
      <Row className="justify-content-md-center">
        <Col xs lg="12">
          <h2>Your grades are shown here</h2>
          <Table striped bordered hover>
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
                    <Form.Control
                      type="number"
                      min="0"
                      max="10"
                      value={player.skillLevel}
                      onChange={handleInputChange(
                        player.username,
                        "skillLevel"
                      )}
                    />
                  </td>
                  <td>
                    <Form.Control
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
                    <Form.Control
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
                    <Form.Control
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
                    <Form.Control
                      type="number"
                      min="0"
                      max="10"
                      value={player.shootingRange}
                      onChange={handleInputChange(
                        player.username,
                        "shootingRange"
                      )}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      min="0"
                      max="10"
                      value={player.reboundSkills}
                      onChange={handleInputChange(
                        player.username,
                        "reboundSkills"
                      )}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button variant="primary" onClick={submitGrading}>
            Submit
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default GradePage;

// need to see that we get the grade that the login user gave
