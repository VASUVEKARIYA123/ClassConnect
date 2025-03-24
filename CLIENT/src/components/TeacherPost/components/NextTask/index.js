import React from 'react';
import { Link } from "react-router-dom";
import styled from 'styled-components'
import AddLabTaskButton from "../addLabTaskbut"; 
import AddStudentButton from "../AddStudentButton/addStudentButton";
import AddFacultyButton from "../AddFacultyButton/addfacultybutton"; 
import { Link } from "react-router-dom";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 22vw;
  max-width: 250px;
  height: max-content;

  border: 1px solid #ccc;
  padding: 25px;
  border-radius: 8px;

  @media (max-width: 780px){
    display: none;
  }

`;

const Title = styled.p`
  color: #242424;
  font-size: 1.2rem;
`;

const Informations = styled.p`
  margin-top: 20px;
  color: #4e4e4e;
  font-size: 0.8rem;
  line-height: 20px;
`;

const SeeAllTasks = styled.a`
  text-decoration: none;
  color: #3b3838;
  font-weight: 600;
  position: relative;

  text-align: end;
  font-size: 0.9rem;
  margin-top: 20px;

  :hover{
    text-decoration: underline;
  }
`
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



export default () => {
  const role=localStorage.getItem("role")
  return (
  <Wrapper>
  <AddLabTaskButton/>
  <AddStudentButton/>
  <AddFacultyButton/>
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
  {role === "admin" && (
  <StyledLink to="/temp">
     Add Projects To Classroom
  </StyledLink>
  )}
  </Wrapper>
  )
}
