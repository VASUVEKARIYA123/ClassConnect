import React, { useState } from "react";
import styled from "styled-components";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { useEffect } from "react";
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

  const fetchAllocationStatus = async () => {
    try {
      setLoading(true);
      setError("");
      setDataFetched(false);

      const response = await fetch(`http://localhost:5000/api/allocation/status/${classroomId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data = await response.json();
      setGroups(data.groups);
      setStudents(data.studentsNotAllocatedOrNotConfirmed);
      setIsAllocationComplete(data.isAllocationComplete);
      setDataFetched(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkProjectSelectionStatus = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`http://localhost:5000/api/allocation/project-selection-status/${classroomId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data = await response.json();
      setProjectSelectionStatus(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Button onClick={fetchAllocationStatus}>Check Allocation Status</Button>

      {loading && <Message className="loading">Loading...</Message>}
      {error && <Message className="error">Error: {error}</Message>}

      {dataFetched && !loading && !error && (
        <div>
          <SectionTitle>Unassigned or Unconfirmed Students</SectionTitle>
          {studentsNotAllocatedOrNotConfirmed.length === 0 ? (
            <Message className="success">
              <FaCheckCircle className="icon success" /> All students are allocated and confirmed.
            </Message>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Student ID</Th>
                </tr>
              </thead>
              <tbody>
                {studentsNotAllocatedOrNotConfirmed.map((studentid, index) => (
                  <tr key={index}>
                    <Td>{studentid}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          <SectionTitle>Status</SectionTitle>
          <Message className={isAllocationComplete ? "success" : "error"}>
            {isAllocationComplete ? (
              <>
                <FaCheckCircle className="icon success" /> Allocation process is complete.
              </>
            ) : (
              <>
                <FaExclamationCircle className="icon error" /> Allocation is not yet complete.
              </>
            )}
          </Message>

          {/* New Button for Checking Project Selection Choice */}
          <Button onClick={checkProjectSelectionStatus} className="secondary">
            Check Project Selection Status
          </Button>

          {projectSelectionStatus && (
            <Message className="info">
              <FaCheckCircle className="icon info" /> {projectSelectionStatus}
            </Message>
          )}
        </div>
      )}
      
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
