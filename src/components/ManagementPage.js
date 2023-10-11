//src\components\ManagementPage.js:

import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
import "./WelcomePage.css";

function ManagementPage() {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [usernames, setUsernames] = useState([]);
  const [selectedUsernames, setSelectedUsernames] = useState([]);
  const [enlistedUsernames, setEnlistedUsernames] = useState([]);
  const [unenlistedUsernames, setUnenlistedUsernames] = useState([]);

  // New state variable for checkbox
  const [isTierMethod, setIsTierMethod] = useState(false);

  const handleCheckboxChange = (e, username) => {
    if (e.target.checked) {
      // Remove from unenlistedUsernames if it's there
      if (unenlistedUsernames.includes(username)) {
        setUnenlistedUsernames(prev => prev.filter(u => u !== username));
      }
      // Add to selected usernames
      if (!selectedUsernames.includes(username) && !enlistedUsernames.includes(username)) {
        setSelectedUsernames([...selectedUsernames, username]);
      }
    } else {
      // Remove from selectedUsernames if it's there
      if (selectedUsernames.includes(username)) {
        setSelectedUsernames(prev => prev.filter(u => u !== username));
      }
      // Add to unenlistedUsernames if it was already enlisted
      if (enlistedUsernames.includes(username) && !unenlistedUsernames.includes(username)) {
        setUnenlistedUsernames([...unenlistedUsernames, username]);
      }
    }
  };


  const handleEnlistUsers = async () => {
    try {
      // Enlist usernames from selectedUsernames

      await axios.post("http://localhost:8080/enlist-users", {
        usernames: selectedUsernames,
        isTierMethod, // Include the method selection in payload
      });


      // Unenlist usernames from unenlistedUsernames
      if (unenlistedUsernames.length > 0) {
        await axios.post("http://localhost:8080/delete-enlist", {
          usernames: unenlistedUsernames,
          isTierMethod,
        });
      }

      alert("Users updated successfully!");

      // Update local state to reflect the changes
      setEnlistedUsernames(prevState => [
        ...prevState.filter(username => !unenlistedUsernames.includes(username)),
        ...selectedUsernames
      ]);
      setSelectedUsernames([]);
      setUnenlistedUsernames([]);

    } catch (error) {
      console.error(error);
    }
  };



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
        const enlistedResponse = await axios.get("http://localhost:8080/enlist");
        if (enlistedResponse.data.success) {
          setEnlistedUsernames(enlistedResponse.data.usernames);
        }

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [isAuthenticated, user]);

  const currentPlayingCount = enlistedUsernames.length
    - unenlistedUsernames.length
    + selectedUsernames.length;

  return (
    <div className="welcome-page">
      <div className="welcome-section">
        <label>
          <input
            type="checkbox"
            checked={isTierMethod}
            onChange={(e) => setIsTierMethod(e.target.checked)}
          />
          Use Tier Method
        </label>
        <div>
          <h3>Playing now: {currentPlayingCount}</h3>
        </div>
        <button onClick={handleEnlistUsers}>Update Players</button>
        <div className="usernames-list">
          {usernames.map((username) => (
            <div key={username} className="team-averages">
              <input
                type="checkbox"
                checked={(selectedUsernames.includes(username) || enlistedUsernames.includes(username)) && !unenlistedUsernames.includes(username)}
                onChange={(e) => handleCheckboxChange(e, username)}
              />
              {username}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

}

export default ManagementPage;
