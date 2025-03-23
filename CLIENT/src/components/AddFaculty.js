import React, { useState } from "react";
import styled from "styled-components";

const FormWrapper = styled.div`
  max-width: 400px;
  margin: auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  color: #007bff;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 1rem;
  margin-bottom: 5px;
  color: #333;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
`;

const SubmitButton = styled.button`
  padding: 10px;
  font-size: 1rem;
  color: white;
  background: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
  
  &:hover {
    background: #0056b3;
  }
`;

export default function AddFaculty() {
  const [faculty, setFaculty] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    role: "teacher",
  });

  const handleChange = (e) => {
    setFaculty({ ...faculty, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/faculties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(faculty),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Faculty added successfully!");
        setFaculty({ firstname: "", lastname: "", email: "", password: "", role: "teacher" });
      } else {
        alert(data.message || "Error adding faculty");
      }
    } catch (error) {
      console.error("Error adding faculty:", error);
    }
  };

  return (
    <FormWrapper>
      <Title>Add Faculty</Title>
      <Form onSubmit={handleSubmit}>
        <Label>First Name:</Label>
        <Input type="text" name="firstname" value={faculty.firstname} onChange={handleChange} required />

        <Label>Last Name:</Label>
        <Input type="text" name="lastname" value={faculty.lastname} onChange={handleChange} required />

        <Label>Email:</Label>
        <Input type="email" name="email" value={faculty.email} onChange={handleChange} required />

        <Label>Password:</Label>
        <Input type="password" name="password" value={faculty.password} onChange={handleChange} required />

        <SubmitButton type="submit">Add Faculty</SubmitButton>
      </Form>
    </FormWrapper>
  );
}
