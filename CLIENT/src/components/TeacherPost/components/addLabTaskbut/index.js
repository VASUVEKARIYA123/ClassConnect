import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";

// Styled Components
const Wrapper = styled.div`
  position: relative;
  padding: 20px;
`;

const StyledAddLabTaskButton = styled.button`
  padding: 12px 18px;
  border: none;
  border-radius: 6px;
  background: #007bff;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 15px;
  display: block;
  width: fit-content;

  &:hover {
    background: #0056b3;
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
