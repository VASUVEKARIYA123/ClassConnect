import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import styled from "styled-components";
import Header from "../../../Header";

// Styled Components
const FormWrapper = styled.div`
  max-width: 50vw;
  margin: 40px auto;
  padding: 20px;
  background: snow;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: center;
`;

const Input = styled.input`
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
  font-size: 1rem;
  font-weight: bold;
  margin-top: 10px;
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
    // console.log(classroomId);
    
    try {
      const response = await fetch("http://localhost:5000/api/faculties/import-in-classroom", {
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
        setTimeout(() => history.push(`/tasks/${classroomId}`), 1500);
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
        <h2>Import Faculty</h2>
        <form onSubmit={handleUpload}>
          <Input type="file" accept=".xlsx" onChange={handleFileChange} />
          <Button type="submit">Upload</Button>
        </form>
        {message && <Message success={success}>{message}</Message>}
      </FormWrapper>
    </>
  );
}
 