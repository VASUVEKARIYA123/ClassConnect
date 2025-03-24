import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import AddLabTaskButton from "../addLabTaskbut"; 
import AddStudentButton from "../AddStudentButton/addStudentButton";
import AddFacultyButton from "../AddFacultyButton/addfacultybutton"; 

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 22vw;
  max-width: 250px;
  height: max-content;
  border: 1px solid #ccc;
  padding: 25px;
  border-radius: 8px;
  
  @media (max-width: 780px) {
    display: none;
  }
`;

const StyledLink = styled(Link)`
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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  text-align: center;
`;

const CloseButton = styled.button`
  background: red;
  color: white;
  border: none;
  padding: 8px 12px;
  margin-top: 10px;
  cursor: pointer;
  border-radius: 5px;
  
  &:hover {
    background: darkred;
  }
`;

const StudentList = styled.ul`
  list-style: none;
  padding: 0;
`;

const StudentItem = styled.li`
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

export default () => {
  const role = localStorage.getItem("role");
  const classroomId = localStorage.getItem("classroomId");
  const studentId = localStorage.getItem("facultiesId");

  const [matches, setMatches] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchMatches = () => {
   
    
    if (!classroomId || !studentId) {
      alert("Missing classroom or student ID.");
      return;
    }

    fetch(`http://localhost:5000/api/groups/findmatch/${classroomId}/${studentId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setMatches(data); 
        console.log(data.matchingStudents[0].studentId);
        
        setShowModal(true); // Open pop-up
      })
      .catch((err) => console.error("Error fetching matches:", err));
  };

  return (
    <>
      <Wrapper>
        <AddLabTaskButton />
        <AddStudentButton />
        <AddFacultyButton />
        
        {role === "admin" && (
          <StyledLink to="/add-classroom-project">
            Add project to classroom
          </StyledLink>
        )}
        
        {role === "teacher" && (
          <StyledLink to="/addfaculty-projects">
            Add Projects
          </StyledLink>
        )}
        
        {role === "student" && (
          <StyledLink as="button" onClick={fetchMatches}>
            Find Matches
          </StyledLink>
        )}
      </Wrapper>

      {/* Pop-up Modal for Showing Matches */}
      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <h3>Matching Students</h3>
          
              <StudentList>
                {matches.matchingStudents.map((student) => (
                  <StudentItem key={student.studentId._id}>
                    {student.studentId.firstname} {student.studentId.lastname}
                  </StudentItem>
                ))}
              </StudentList>
            <CloseButton onClick={() => setShowModal(false)}>Close</CloseButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};
