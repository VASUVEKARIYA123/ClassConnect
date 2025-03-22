import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../Header";
import styled from "styled-components";

// Styled Components
const PageWrapper = styled.div`
  max-width: 60vw;
  margin: 40px auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`;

const Section = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h3`
  font-size: 1.4rem;
  color: #007bff;
  margin-bottom: 12px;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  padding: 8px;
  border-bottom: 1px solid #ddd;
  font-size: 1rem;
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Button = styled.button`
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  margin-left: 5px;
`;

const InfoButton = styled(Button)`
  background: #17a2b8;
  color: white;
  &:hover {
    background: #138496;
  }
`;

const DeleteButton = styled(Button)`
  background: #dc3545;
  color: white;
  &:hover {
    background: #c82333;
  }
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

const CloseButton = styled(Button)`
  background: #6c757d;
  &:hover {
    background: #5a6268;
  }
`;

const ApplyButton = styled(Button)`
  background: #28a745;
  color: white;
  &:hover {
    background: #218838;
  }
`;

const Input = styled.input`
  width: 80%;
  padding: 5px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

export default function ClassroomDetails() {
  const { classId } = useParams(); 
  const [students, setStudents] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchClassroomData = async () => {
      try {
        const studentRes = await fetch(
          `http://localhost:5000/api/classroom-students/classroom/${classId}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );

        const studentData = await studentRes.json();
        const facultyRes = await fetch(
          `http://localhost:5000/api/classroom-faculties/classroom/${classId}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        const facultyData = await facultyRes.json();

        if (studentRes.ok) setStudents(studentData.students || []);
        if (facultyRes.ok) setFaculties(facultyData.faculties || []);
      } catch (error) {
        console.error("Error fetching classroom details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClassroomData();
  }, [classId]);

  // ✅ FUNCTION TO FETCH STUDENT INFO
  const handleStudentInfo = async (studentId) => {
    try {
      const classroomId = localStorage.getItem("classroomId");

      if (!classroomId) {
        console.error("Classroom ID is missing from localStorage");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/classroom-students/classroom-student/${classroomId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (!response.ok) {
        console.error("Failed to fetch classroom students");
        return;
      }

      const data = await response.json();
      let classroomStudent = data.classroomStudents.find((cs) => cs.studentId._id === studentId);

      if (!classroomStudent) {
        console.error("Student not found in classroom");
        return;
      }

      setSelectedStudent(classroomStudent);
    } catch (error) {
      console.error("Error fetching student info:", error);
    }
  };

  // ✅ FUNCTION TO UPDATE STUDENT DATA (ADMIN ONLY)
  const handleApplyChanges = async () => {
    if (!selectedStudent) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/classroom-students/${selectedStudent._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            cpi: selectedStudent.cpi,
            division: selectedStudent.division,
          }),
        }
      );

      if (response.ok) {
        setStudents((prevStudents) =>
          prevStudents.map((s) =>
            s._id === selectedStudent.studentId._id
              ? { ...s, cpi: selectedStudent.cpi, division: selectedStudent.division }
              : s
          )
        );
        setSelectedStudent(null);
        console.log("Student details updated successfully!");
      } else {
        console.error("Failed to update student details");
      }
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this student?"
    );
    if (!confirmDelete) return;

    try {
      const classroomId = localStorage.getItem("classroomId");

      if (!classroomId) {
        console.error("Classroom ID is missing from localStorage");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/classroom-students/classroom-student/${classroomId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to fetch classroom students");
        return;
      }

      const data = await response.json();

      let classroomStudentId;
      const datalen = data.noofcs;
      for (let i = 0; i < datalen; i++) {
        classroomStudentId = data.classroomStudents[i]._id;
        if (data.classroomStudents[i].studentId._id === studentId) {
          break;
        }
      }

      const deleteResponse = await fetch(
        `http://localhost:5000/api/classroom-students/${classroomStudentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (deleteResponse.ok) {
        setStudents(students.filter((s) => s._id !== studentId));
        console.log("Student removed from classroom successfully!");
      } else {
        console.error("Failed to delete student");
      }
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };


  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Header />
      <PageWrapper>
        <Section>
          <Title>Faculties</Title>
          {faculties.length > 0 ? (
            <List>
              {faculties.map((faculty) => (
                <ListItem key={faculty._id}>{faculty.firstname} {faculty.lastname}</ListItem>
              ))}
            </List>
          ) : (
            <p>No faculties found.</p>
          )}
        </Section>

        <Section>
          <Title>Students</Title>
          {students.length > 0 ? (
            <List>
              {students.map((student) => (
                <ListItem key={student._id}>
                  {student.firstname} {student.lastname}
                  {(role === "teacher" || role === "admin") && (
                    <>
                      <InfoButton onClick={() => handleStudentInfo(student._id)}>Info</InfoButton>
                      <DeleteButton onClick={() => handleDeleteStudent(student._id)}>
                        Delete
                      </DeleteButton>
                    </>
                  )}
                </ListItem>
              ))}
            </List>
          ) : (
            <p>No students found.</p>
          )}
        </Section>
      </PageWrapper>

      {/* ✅ MODAL FOR DISPLAYING & EDITING STUDENT INFO */}
      {selectedStudent && (
        <ModalOverlay>
          <ModalContent>
            <h3>Student Information</h3>
            <p><strong>First Name:</strong> {selectedStudent.studentId.firstname}</p>
            <p><strong>Last Name:</strong> {selectedStudent.studentId.lastname}</p>
            <p><strong>Division:</strong> 
              <Input type="text" value={selectedStudent.division} onChange={(e) => setSelectedStudent({ ...selectedStudent, division: e.target.value })} />
            </p>
            {role === "admin" && (
              <p><strong>CPI:</strong> 
                <Input type="number" value={selectedStudent.cpi} onChange={(e) => setSelectedStudent({ ...selectedStudent, cpi: e.target.value })} />
              </p>
            )}
            <ApplyButton onClick={handleApplyChanges}>Apply Changes</ApplyButton>
            <CloseButton onClick={() => setSelectedStudent(null)}>Close</CloseButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
}
