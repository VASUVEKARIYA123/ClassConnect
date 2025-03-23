import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";

// Styled Components
const Wrapper = styled.div`
  position: relative;
  padding: 20px;
`;

const StyledAddFacultiesButton = styled.button`
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

export default function AddfacultiesButton() {
  const history = useHistory();
  const location = useLocation();

  // Extract classroomId from URL
  const currentPath = location.pathname;
  const isClassroomPage = currentPath.startsWith("/tasks/");
  const classroomId = currentPath.split("/").pop();

  const handleAddFaculties = () => {
    history.push(`/import-faculties/${classroomId}`); // Navigate to import page
  };
  const role=localStorage.getItem("role")
  if ((role !== "admin") || !isClassroomPage) return null;

  return (
    <Wrapper>
      <StyledAddFacultiesButton onClick={handleAddFaculties}>
        Add Faculties
      </StyledAddFacultiesButton>
      
    </Wrapper>
  );
}
 