import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../Header";
import styled from "styled-components";

// Styled Components
const PageWrapper = styled.div`
  max-width: 60vw;
  margin: 40px auto;
  padding: 25px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Section = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h3`
  font-size: 1.8rem;
  color: #007bff;
  margin-bottom: 12px;
`;

const Title1 = styled.h4`
  margin-top: 15px;
  font-size: 1.4rem;
  color: #007bff;
  margin-bottom: 12px;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const Button = styled.button`
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  margin: 3px;
  transition: 0.3s ease;
  background: #007bff;
  color: white;

  &:hover {
    transform: translateY(-3px);
    background: linear-gradient(135deg, #0056b3, #003d80);
  }
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

const ButtonWrapper = styled.div`
  display: flex;
  gap: 10px;  
  align-items: center;
`;

const InfoButton = styled(Button)`
  background: #17a2b8;
  &:hover {
    background: #138496;
  }
`;

const DeleteButton = styled(Button)`
  background: #dc3545;
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
  &:hover {
    background: #218838;
  }
`;

const Input = styled.input`
  width: 95%;
  padding: 12px;
  margin-top: 5px;
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
          `http://localhost:5000/api/classroom-students/classroom-student/${classId}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        const studentData = await studentRes.json();
  
        const facultyRes = await fetch(
          `http://localhost:5000/api/classroom-faculties/classroom-faculty/${classId}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        const facultyData = await facultyRes.json();

        
        if (studentRes.ok){
          const len=studentData.noofcs
         let sdivA=[]
         let sdivB=[]
         for(let i=0;i<len;i++){
            if(studentData.classroomStudents[i].division=="A"){
              sdivA.push(studentData.classroomStudents[i])
            }
         }
         for(let i=0;i<len;i++){
          if(studentData.classroomStudents[i].division=="B"){
            sdivB.push(studentData.classroomStudents[i])
          }
       }
      setStudents([...sdivA,...sdivB]|| [])
        }
  
        if (facultyRes.ok) {
          // ✅ Separate faculties by division
         const len=facultyData.noofcf
         let divA=[]
         let divB=[]
         for(let i=0;i<len;i++){
            if(facultyData.classroomFaculties[i].division=="A" && facultyData.classroomFaculties[i].facultyId.role!="admin"){
              divA.push(facultyData.classroomFaculties[i])
            }
         }
         for(let i=0;i<len;i++){
          if(facultyData.classroomFaculties[i].division=="B" && facultyData.classroomFaculties[i].facultyId.role!="admin"){
            divB.push(facultyData.classroomFaculties[i])
          }
       }
         
          // ✅ Merge arrays → First "A", then "B"
          setFaculties([...divA, ...divB]);
        }
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
      localStorage.setItem("cpi",classroomStudent.cpi)
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
       window.location.reload()
      } else {
        console.error("Failed to update student details");
      }
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const handleDeleteFaculty = async (facultyId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this faculty?"
    );
    if (!confirmDelete) return;
  
    try {
      const classroomId = localStorage.getItem("classroomId");
  
      if (!classroomId) {
        console.error("Classroom ID is missing from localStorage");
        return;
      }
  
      // ✅ Step 1: Fetch classroom faculties
      const response = await fetch(
        `http://localhost:5000/api/classroom-faculties/classroom-faculty/${classroomId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      if (!response.ok) {
        console.error("Failed to fetch classroom faculties");
        return;
      }
  
      const data = await response.json();
      // console.log("Hi");
      
      
      // ✅ Step 2: Find the correct classroomFacultyId
      let classroomFacultyId;
      const datalen = data.noofcf;
      for (let i = 0; i < datalen; i++) {
        classroomFacultyId = data.classroomFaculties[i]._id;
        if (data.classroomFaculties[i].facultyId === facultyId) {
          break;
        }
      }
      // console.log(classroomFacultyId);
      
      // ✅ Step 3: Send DELETE request
      const deleteResponse = await fetch(
        `http://localhost:5000/api/classroom-faculties/${classroomFacultyId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      if (deleteResponse.ok) {
        setFaculties(faculties.filter((f) => f._id !== facultyId));
        console.log("Faculty removed from classroom successfully!");
      } else {
        console.error("Failed to delete faculty");
      }
    } catch (error) {
      console.error("Error deleting faculty:", error);
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


  const handleChangeFacultyDivision = async (classroomFaculty, currentDivision) => {
    const newDivision = currentDivision === "A" ? "B" : "A";
    console.log(classroomFaculty);
    
    try {
      const response = await fetch(
        `http://localhost:5000/api/classroom-faculties/${classroomFaculty._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({classroomId:classroomFaculty.classroomId, division: newDivision,faculty:classroomFaculty.facultyId._id,max_students:classroomFaculty.max_students }),
        }
      );
      // console.log(response);
      
      if (response.ok) {
        setFaculties((prevFaculties) =>
          prevFaculties.map((f) =>
            f._id === classroomFaculty._id ? { ...f, division: newDivision } : f
          )
        );
        console.log("Faculty division updated successfully!");
        window.location.reload(); // ✅ Refresh UI
      } else {
        console.error("Failed to update faculty division");
      }
    } catch (error) {
      console.error("Error updating faculty division:", error);
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
           {/* 🔹 Filter faculties based on division A */}
           <Title1>Division A</Title1>
           {faculties
             .filter((classroomFaculties) => classroomFaculties.division === "A")
             .map((classroomFaculties) =>
               classroomFaculties.facultyId.role !== "admin" ? (
                 <ListItem key={classroomFaculties._id}>
                   {classroomFaculties.facultyId.firstname} {classroomFaculties.facultyId.lastname}
                   {(role === "admin") && (
                     <ButtonWrapper>
                      <InfoButton
            onClick={() => handleChangeFacultyDivision(classroomFaculties, classroomFaculties.division)}
          >
            Change Division
          </InfoButton>
                       <DeleteButton onClick={() => handleDeleteFaculty(classroomFaculties.facultyId._id)}>
                         Delete
                       </DeleteButton>
                     </ButtonWrapper>
                   )}
                 </ListItem>
               ) : null
             )}
         
           {/* 🔹 Filter faculties based on division B */}
           <Title1>Division B</Title1>
           {faculties
             .filter((classroomFaculties) => classroomFaculties.division === "B")
             .map((classroomFaculties) =>
               classroomFaculties.facultyId.role !== "admin" ? (
                 <ListItem key={classroomFaculties._id}>
                   {classroomFaculties.facultyId.firstname} {classroomFaculties.facultyId.lastname}
                   {(role === "admin") && (
                     <ButtonWrapper>
                      <InfoButton
            onClick={() => handleChangeFacultyDivision(classroomFaculties, classroomFaculties.division)}
          >
            Change Division
          </InfoButton>
                       <DeleteButton onClick={() => handleDeleteFaculty(classroomFaculties.facultyId._id)}>
                         Delete
                       </DeleteButton>
                     </ButtonWrapper>
                   )}
                 </ListItem>
               ) : null
             )}
         </List>
         
          ) : (
            <p>No faculties found.</p>
          )}
        </Section>

        <Section>
          <Title>Students</Title>
          {students.length > 0 ? (
          <List>
          {/* 🔹 Students in Division A */}
          <Title1>Division A</Title1>
          {students
            .filter((classroomStudent) => classroomStudent.division === "A")
            .map((classroomStudent) => (
              <ListItem key={classroomStudent.studentId._id}>
                {classroomStudent.studentId.firstname} {classroomStudent.studentId.lastname}
                {(role === "teacher" || role === "admin") && (
                  <ButtonWrapper>
                    <InfoButton onClick={() => handleStudentInfo(classroomStudent.studentId._id)}>Info</InfoButton>
                    <DeleteButton onClick={() => handleDeleteStudent(classroomStudent.student._id)}>Delete</DeleteButton>
                  </ButtonWrapper>
                )}
              </ListItem>
            ))}
        
          {/* 🔹 Students in Division B */}
          <Title1>Division B</Title1>
          {students
            .filter((classroomStudent) => classroomStudent.division === "B")
            .map((classroomStudent) => (
              <ListItem key={classroomStudent.studentId._id}>
                {classroomStudent.studentId.firstname} {classroomStudent.studentId.lastname}
                {(role === "teacher" || role === "admin") && (
                  <ButtonWrapper>
                    <InfoButton onClick={() => handleStudentInfo(classroomStudent.studentId._id)}>Info</InfoButton>
                    <DeleteButton onClick={() => handleDeleteStudent(classroomStudent.student._id)}>Delete</DeleteButton>
                  </ButtonWrapper>
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
          
          {role === "admin" && (
            <p><strong>CPI:</strong> {localStorage.getItem("cpi")}</p>
            /* <Input type="number" value={selectedStudent.cpi} onChange={(e) => setSelectedStudent({ ...selectedStudent, cpi: e.target.value })} /> */
          )}
      
          {/* 🔹 Division Dropdown */}
          <p><strong>Division:</strong></p>
          <select
            value={selectedStudent.division} // Default value is the current division
            onChange={(e) => setSelectedStudent({ ...selectedStudent, division: e.target.value })}
          >
            <option value="A">A</option>
            <option value="B">B</option>
          </select>
          
          <ApplyButton onClick={handleApplyChanges}>Apply Changes</ApplyButton>
          <CloseButton onClick={() => setSelectedStudent(null)}>Close</CloseButton>
        </ModalContent>
      </ModalOverlay>      
      )}
    </>
  );
}
