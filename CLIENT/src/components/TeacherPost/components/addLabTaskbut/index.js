import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";

// Styled Components
const Wrapper = styled.div`
  position: relative;
  padding: 20px;
`;

const StyledAddLabTaskButton = styled.button`
  display: inline-block;
  padding: 10px 15px;
  margin-top: 10px;
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
  text-decoration: none;
  color: white;
  background-color: #007bff;
  border-radius: 8px;
  transition: background-color 0.3s ease-in-out, transform 0.2s;

  &:hover {
    background-color: #0056b3;
    transform: scale(1.05);
  }
`;

export default function AddLabTaskButton() {
  const history = useHistory();
  const location = useLocation();

  // Extract classroomId from URL
  const currentPath = location.pathname;
  const isClassroomPage = currentPath.startsWith("/tasks/");

  // Get role from localStorage (stored at login)
  const role = localStorage.getItem("role");

  // 🔍 Debugging
  console.log("Current Path:", currentPath);
  console.log("Is Classroom Page:", isClassroomPage);
  console.log("User Role:", role);

  const handleAddLabTask = () => {
    history.push("/create-labtask");
  };

  // Show button only if user is a teacher and inside a classroom (/tasks/:classId)
  if ((role !== "admin" && role !== "teacher") || !isClassroomPage) return null;


  return (
    <Wrapper>
      <StyledAddLabTaskButton onClick={handleAddLabTask}>Add Lab Task</StyledAddLabTaskButton>
    </Wrapper>
  );
}
