import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import styled from "styled-components";
import Header from "../Header";

// Styled Components
const FormWrapper = styled.div`
  max-width: 50vw;
  margin: 40px auto;
  padding: 25px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Input = styled.input`
  width: 95%;
  padding: 12px;
  margin-bottom: 15px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #007bff;
    box-shadow: 0px 0px 8px rgba(0, 123, 255, 0.4);
  }
`;

const Button = styled.button`
  padding: 12px 15px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  cursor: pointer;
  width: 100%;
  font-size: 1rem;
  font-weight: bold;
  transition: transform 0.2s, background 0.3s;

  &:hover {
    transform: translateY(-3px);
    background: linear-gradient(135deg, #0056b3, #003d80);
  }
`;

const Message = styled.p`
  font-size: 1rem;
  font-weight: bold;
  margin-top: 15px;
  color: ${({ success }) => (success ? "green" : "red")};
`;


export default function ImportFaculties() {
  const { classroomId } = useParams();
  
  const history = useHistory();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file.");
      setSuccess(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("classroomId", classroomId);

    try {
      const response = await fetch("http://localhost:5000/api/faculties/import", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage(data.message);
        setSuccess(true);
        setTimeout(() => history.push(`/subject`), 1500);
      } else {
        setMessage(data.error || "Upload failed.");
        setSuccess(false);
      }
    } catch (error) {
      setMessage("Server error: " + error.message);
      setSuccess(false);
    }
  };

  return (
    <>
      <Header />
      <FormWrapper>
        <h2>Import Faculties</h2>
        <form onSubmit={handleUpload}>
          <Input type="file" accept=".xlsx" onChange={handleFileChange} />
          <Button type="submit">Upload</Button>
        </form>
        {message && <Message success={success}>{message}</Message>}
      </FormWrapper>
    </>
  );
}
 