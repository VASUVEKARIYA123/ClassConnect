import React, { useState } from "react";
import styled from "styled-components";
import Header from "../Header";
import DoubtButton from "../common/ButtonDoubt";
import { useHistory } from "react-router-dom";

// Styled Components
const FormWrapper = styled.div`
  max-width: 50vw;
  margin: 40px auto;
  padding: 20px;
  background: snow;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  background: #007bff;
  color: white;
  cursor: pointer;
  width: 100%;
  font-size: 1rem;
  transition: background 0.3s;

  &:hover {
    background: #0056b3;
  }
`;

const Message = styled.p`
  text-align: center;
  font-size: 1rem;
  font-weight: bold;
  margin-top: 10px;
  color: ${({ success }) => (success ? "green" : "red")};
`;

export default function CreateClassroom() {
  const history = useHistory();
  const [classroom, setClassroom] = useState({
    name: "",
    description: "",
    semester: "",
    criteria: "67cc977005de27e4fe9f15bd",
  });
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setClassroom({ ...classroom, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      // Step 1: Create Classroom
      const response = await fetch("http://localhost:5000/api/classrooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(classroom),
      });

      const classroomData = await response.json();
      
      if (!response.ok) {
        setMessage("Error creating classroom. Please try again.");
        setSuccess(false);
        return;
      }

      const classroomId = classroomData.classroom._id; // Extract classroom ID from response
      
      localStorage.setItem("classroomId", classroomId); // Update localStorage with new classroom ID

      setMessage("Classroom Created Successfully!");
      setSuccess(true);

      const facultyId = localStorage.getItem("facultiesId"); // Retrieve facultyId from localStorage
      // Step 2: Add Classroom-Faculty Entry
      if (!classroomId || !facultyId) {
        console.error("Missing classroomId or facultyId.");
      } else {
        const classroomFacultyRequest = {
          classroomId: classroomId,
          division: "A", // Default division
          faculty: facultyId,
          max_students: 20,
        };

        const facultyResponse = await fetch(
          "http://localhost:5000/api/classroom-faculties",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(classroomFacultyRequest),
          }
        );

        const facultyData = await facultyResponse.json();

        if (facultyResponse.ok) {
          console.log("Classroom-Faculty entry added successfully!", facultyData);
        } else {
          console.error("Error adding faculty entry:", facultyData.message);
        }
      }

      // Redirect to the classroom list
      setTimeout(() => {
        history.push("/subject");
        window.location.reload();
      }, 1500);
    } catch (error) {
      setMessage("Error creating classroom. Please try again.");
      setSuccess(false);
      console.error("Server Error:", error);
    }
  };

  return (
    <>
      <Header />
      <FormWrapper>
        <h2>Create Classroom</h2>
        <form onSubmit={handleSubmit}>
          <Input type="text" name="name" placeholder="Classroom Name" required onChange={handleChange} />
          <TextArea name="description" placeholder="Description" onChange={handleChange} />
          <Input type="number" name="semester" placeholder="Semester" required onChange={handleChange} />
          <Button type="submit">Create</Button>
        </form>
        {message && <Message success={success}>{message}</Message>}
      </FormWrapper>
      <DoubtButton />
    </>
  );
}
