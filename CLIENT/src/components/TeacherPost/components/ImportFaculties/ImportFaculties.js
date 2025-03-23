import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  padding: 10px;
  border-bottom: 1px solid #ddd;
  font-size: 1rem;
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Button = styled.button`
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  background: #007bff;
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s;

  &:hover {
    background: #0056b3;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const Message = styled.p`
  font-size: 1rem;
  font-weight: bold;
  margin-top: 10px;
  color: ${({ success }) => (success ? "green" : "red")};
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 350px;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

export default function ImportFaculties() {
  const { classroomId } = useParams();
  const [faculties, setFaculties] = useState([]);
  const [addedFaculties, setAddedFaculties] = useState(new Set());
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [division, setDivision] = useState("A"); // Default Division
  const [maxStudents, setMaxStudents] = useState(22);

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/faculties", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch faculties");
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          setFaculties(data);
        } else {
          console.error("Unexpected response format:", data);
        }
      } catch (error) {
        console.error("Error fetching faculties:", error);
      }
    };

    const fetchAddedFaculties = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/classroom-faculties/classroom/${classroomId}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch assigned faculties");
        }

        const data = await response.json();
        if (Array.isArray(data.faculties)) {
          setAddedFaculties(new Set(data.faculties.map((f) => f._id)));
        } else {
          console.error("Unexpected response format:", data);
        }
      } catch (error) {
        console.error("Error fetching assigned faculties:", error);
      }
    };

    fetchFaculties();
    fetchAddedFaculties();
  }, [classroomId]);

  const handleOpenModal = (faculty) => {
    setSelectedFaculty(faculty);
  };

  const handleAddFaculty = async () => {
    if (!selectedFaculty) return;
    try {
      const response = await fetch("http://localhost:5000/api/classroom-faculties/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          classroomId,
          faculty: selectedFaculty._id,
          division,
          max_students: maxStudents, // Send max_students value
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Faculty added successfully!");
        setSuccess(true);
        setAddedFaculties((prev) => new Set([...prev, selectedFaculty._id]));
        setSelectedFaculty(null); // Close modal
      } else {
        setMessage(data.error || "Failed to add faculty.");
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
        <h2>Assign Faculty to Classroom</h2>
        {message && <Message success={success}>{message}</Message>}
        <List>
          {faculties.length > 0 ? (
            faculties.map((faculty) => (
              (faculty.role!="admin")?(
              <ListItem key={faculty._id}>
                {faculty.firstname} {faculty.lastname}
                <Button
                  onClick={() => handleOpenModal(faculty)}
                  disabled={addedFaculties.has(faculty._id)}
                >
                  {addedFaculties.has(faculty._id) ? "Added" : "Add"}
                </Button>
              </ListItem>
              ):""
            ))
          ) : (
            <p>No faculties found.</p>
          )}
        </List>
      </FormWrapper>

      {/* ✅ MODAL FORM FOR ADDING FACULTY */}
      {selectedFaculty && (
        <ModalOverlay>
          <ModalContent>
            <h3>Add Faculty to Classroom</h3>
            <p>
              <strong>Faculty:</strong> {selectedFaculty.firstname} {selectedFaculty.lastname}
            </p>

            {/* Dropdown for Division */}
            Division
            <Select value={division} onChange={(e) => setDivision(e.target.value)}>
              <option value="A">A</option>
              <option value="B">B</option>
            </Select>

            {/* Input for Max Students */}
            Max. Students
            <Input
              type="number"
              placeholder="Max Students"
              value={maxStudents}
              onChange={(e) => setMaxStudents(e.target.value)}
            />

            <Button onClick={handleAddFaculty}>Confirm</Button>
            <Button onClick={() => setSelectedFaculty(null)}>Cancel</Button>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
}
    