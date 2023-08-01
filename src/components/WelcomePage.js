import React, { useEffect, useState } from "react";
import axios from "axios";

function WelcomePage() {
  const [usernames, setUsernames] = useState([]);

  useEffect(() => {
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
  }, []);

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
