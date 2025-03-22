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

export default function LabTaskForm() {
  const history = useHistory();

  // Retrieve `classroomId` and `facultiesId` from localStorage
  const classroomId = localStorage.getItem("classroomId");
  console.log(classroomId);
  
  const facultiesId = localStorage.getItem("facultiesId");
console.log(facultiesId);

  // ✅ Fix: Move hooks above conditional checks
  const [labTask, setLabTask] = useState({
    labNumber: "",
    title: "",
    description: "",
    total_marks: 10,
    due_date: "",
  });

  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);

  // ✅ Fix: Handle missing classroomId/facultiesId after hooks are initialized
  if (!classroomId || !facultiesId) {
    console.error("Missing classroomId or facultiesId in localStorage.");
    return (
      <>
        <Header />
        <Message success={false}>Error: Missing classroom or faculty information.</Message>
      </>
    );
  }

  const handleChange = (e) => {
    setLabTask({ ...labTask, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const requestBody = {
      classroomId,
      facultiesId,
      ...labTask,
    };

    try {
      console.log("Request Body:", requestBody);

      const response = await fetch("http://localhost:5000/api/lab-tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Lab Task Created Successfully!");
        setSuccess(true);
        setLabTask({
          labNumber: "",
          title: "",
          description: "",
          total_marks: 10,
          due_date: "",
        });

        setTimeout(() => {
          history.push("/tasks/" + classroomId);
          window.location.reload();
        }, 1500);
      } else {
        setMessage(data.message || "Error creating Lab Task");
        setSuccess(false);
      }
    } catch (error) {
      setMessage("Error while adding Lab Task");
      setSuccess(false);
    }
  };

  return (
    <>
      <Header />
      <FormWrapper>
        <h2>Add Lab Task</h2>
        <form onSubmit={handleSubmit}>
          <Input type="number" name="labNumber" placeholder="Lab Number" value={labTask.labNumber} onChange={handleChange} required />
          <Input type="text" name="title" placeholder="Title" value={labTask.title} onChange={handleChange} required />
          <TextArea name="description" placeholder="Description" value={labTask.description} onChange={handleChange} />
          <Input type="number" name="total_marks" placeholder="Total Marks" value={labTask.total_marks} onChange={handleChange} />
          <Input type="date" name="due_date" value={labTask.due_date} onChange={handleChange} required />
          <Button type="submit">Add Task</Button>
        </form>
        {message && <Message success={success}>{message}</Message>}
      </FormWrapper>
      <DoubtButton />
    </>
  );
}
