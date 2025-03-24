import React, { useState } from "react";
import styled from "styled-components";

const ProjectAllocation = () => {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const classroomId = localStorage.getItem("classroomId");

  const startAllocation = async () => {
    setLoading(true);
    setStatus("");

    try {
      const response = await fetch(`http://localhost:5000/api/allocation/allocate/${classroomId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();
      console.log(data);
      
      if (response.ok) {
        setStatus(data.message);
      } else {
        setStatus(`Error: ${data.message}`);
      }
    } catch (error) {
      setStatus("Error: Failed to allocate projects.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Project Allocation</Title>
      <Button onClick={startAllocation} disabled={loading}>
        {loading ? "Allocating..." : "Start Allocation"}
      </Button>
      {status && <Message>{status}</Message>}
    </Container>
  );
};

export default ProjectAllocation;

// Styled Components
const Container = styled.div`
  max-width: 600px;
  margin: auto;
  padding: 20px;
  background: white;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 18px;
  color: white;
  background: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  &:hover:not(:disabled) {
    background: #0056b3;
  }
`;

const Message = styled.p`
  margin-top: 20px;
  font-size: 16px;
  font-weight: bold;
  color: #28a745;
`;
