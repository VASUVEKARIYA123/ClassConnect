import React, { useState } from "react";
import styled from "styled-components";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { useEffect } from "react";
import Phase1 from "./phase1";
import Phase2 from "./phase2";
import Phase3 from "./phase3";

const AllocationStatus = () => {
  const classroomId = localStorage.getItem("classroomId");
  const [classroom, setClassroom] = useState("");
  const [groups, setGroups] = useState([]);
  const [studentsNotAllocatedOrNotConfirmed, setStudents] = useState([]);
  const [isAllocationComplete, setIsAllocationComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dataFetched, setDataFetched] = useState(false);
  const [projectSelectionStatus, setProjectSelectionStatus] = useState("");

  useEffect(() => {
    fetchClassroom();
  }, []);

  const fetchClassroom = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(
        `http://localhost:5000/api/classrooms/${classroomId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      setClassroom(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Container>
      <Title>Allocation Status</Title>
      { classroom.mode === "phase1" ? (
        <Phase1 />
        ) : (
        classroom.mode === "phase2" ? (
          <Phase2 />
        ) : (
        classroom.mode === "phase3" ? (
          <Phase3 />
        ) : (
          <p style={{color : "green" }}>
            Allocation has been done for all student.
          </p>
        ) )
      )
      }
      
    </Container>
  );
};

export default AllocationStatus;

// Styled Components
const Container = styled.div`
  max-width: 800px;
  margin: auto;
  padding: 20px;
  background: white;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Button = styled.button`
  display: block;
  width: 100%;
  padding: 10px;
  font-size: 18px;
  color: white;
  background: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
  margin-top: 10px;

  &:hover {
    background: #0056b3;
  }

  &.secondary {
    background: #28a745;

    &:hover {
      background: #218838;
    }
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  background: #007bff;
  color: white;
  padding: 10px;
  text-align: left;
`;

const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
  &:first-child {
    font-weight: bold;
  }
`;

const SectionTitle = styled.h3`
  margin-top: 20px;
  font-size: 20px;
  font-weight: bold;
  color: #333;
`;

const Message = styled.p`
  display: flex;
  align-items: center;
  font-size: 16px;
  margin-top: 10px;

  &.loading {
    color: #007bff;
  }

  &.error {
    color: #dc3545;
  }

  &.success {
    color: #28a745;
  }

  &.info {
    color: #17a2b8;
  }

  .icon {
    margin-right: 5px;
  }
`;
