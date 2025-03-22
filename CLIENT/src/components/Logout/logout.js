import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Header from "../Header";
import DoubtButton from "../common/ButtonDoubt";

// Styled Components
const CardWrapper = styled.div`
  max-width: 50vw;
  margin: 40px auto;
  padding: 20px;
  background: snow;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: center;
`;

const Button = styled.button`
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  background: #dc3545;
  color: white;
  cursor: pointer;
  width: 100%;
  font-size: 1rem;
  transition: background 0.3s;

  &:hover {
    background: #a71d2a;
  }
`;

const Message = styled.p`
  text-align: center;
  font-size: 1rem;
  font-weight: bold;
  margin-top: 10px;
  color: ${({ success }) => (success ? "green" : "red")};
`;

export default function Logout() {
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);
  const history = useHistory();

  const handleLogout = async () => {
    setMessage(null);

    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        // ✅ Remove specific keys to avoid clearing other localStorage data
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        console.log(localStorage.getItem("role"));
        localStorage.removeItem("facultiesId");
        localStorage.removeItem("classroomId");
        localStorage.removeItem("name");

        localStorage.clear(); // 🧹 Clear all localStorage data
        console.log("After logout:", localStorage.getItem("role")); // 🔥 Debugging

        setMessage("Logout Successful!");
        setSuccess(true);

        setTimeout(() => {
          history.push("/"); // ✅ Redirect to home/login
          window.location.reload(); // 🔄 Ensures complete refresh
        }, 1000);
      } else {
        const responseData = await response.json();
        setMessage(responseData.message || "Logout failed. Please try again.");
        setSuccess(false);
      }
    } catch (error) {
      setMessage("Error: " + error.message);
      setSuccess(false);
    }
  };

  return (
    <>
      <Header />
      <CardWrapper>
        <h2>Logout</h2>
        {message && <Message success={success}>{message}</Message>}
        <Button onClick={handleLogout}>Logout</Button>
      </CardWrapper>
      <DoubtButton />
    </>
  );
}
