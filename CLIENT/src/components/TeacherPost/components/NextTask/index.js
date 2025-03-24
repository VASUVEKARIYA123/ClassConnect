import React from 'react';
import { Link } from "react-router-dom";
import styled from 'styled-components'
import AddLabTaskButton from "../addLabTaskbut"; 
import AddStudentButton from "../AddStudentButton/addStudentButton";
import AddFacultyButton from "../AddFacultyButton/addfacultybutton"; 
// import AddProject from "../addProject";
// STYLES
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


export default () => {
  const role=localStorage.getItem("role")
  return (
  <Wrapper>
    {/* <Title>upcoming activities</Title>
    <Informations>No activity for next week!</Informations>
    <br/>
    <SeeAllTasks href="">View everything</SeeAllTasks> */}
  <AddLabTaskButton/>
  <AddStudentButton/>
  <AddFacultyButton/>
  {role === "teacher" && (
          <Link to="/addfaculty-projects">
            Add Projects
          </Link>
        )}
  </Wrapper>
  )
}
