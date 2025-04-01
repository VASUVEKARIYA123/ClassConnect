import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../Header"; // Assuming this is the path

const FacultyGroups = () => {
  const [faculties, setFaculties] = useState([]);
  const [groups, setGroups] = useState([]);
  const classroomId = localStorage.getItem("classroomId");
  const token = localStorage.getItem("token");
  const [projects, setProjects] = useState([]);
  const [students, setStudents] = useState({}); // To store student data by ID

  useEffect(() => {
    const fetchFacultiesAndGroups = async () => {
      try {
        const facultyRes = await fetch(
          `http://localhost:5000/api/classroom-faculties/classroom-faculty/${classroomId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const facultyData = await facultyRes.json();
        setFaculties(facultyData.classroomFaculties);

        const groupRes = await fetch(
          `http://localhost:5000/api/groups/classroom/${classroomId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const groupData = await groupRes.json();
        setGroups(groupData);

        const projectRes = await fetch(`http://localhost:5000/api/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const projectData = await projectRes.json();
        setProjects(projectData);

        // Fetch students' data (assuming the group includes student IDs)
        const studentIds = groupData.flatMap(group =>
          group.students.map(student => student.studentId)
        );
        const uniqueStudentIds = [...new Set(studentIds)];

        const studentPromises = uniqueStudentIds.map(studentId =>
          fetch(`http://localhost:5000/api/students/${studentId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }).then(res => res.json())
        );
        const studentData = await Promise.all(studentPromises);
        
        // Map student data by _id for easy lookup
        const studentMap = studentData.reduce((map, student) => {
          map[student._id] = student;
          return map;
        }, {});
        setStudents(studentMap);
        console.log(studentMap);
        
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (classroomId && token) {
      fetchFacultiesAndGroups();
    }
  }, [classroomId, token]);

  const getFacultyPerformance = (facultyId) => {
    const facultyGroups = groups.filter((group) => {
      return group.facultyprojectId.facultyId === facultyId;
    });

    if (facultyGroups.length === 0) return "No Groups";
    console.log(students);
    const avgMark =
      facultyGroups.reduce((sum, group) => sum + group.avg_mark, 0) /
      facultyGroups.length;

    if (avgMark >= 9) return "Excellent";
    if (avgMark >= 8) return "Very Good";
    if (avgMark >= 7) return "Good";
    if (avgMark >= 6) return "Not Good";
    return "Poor";
  };

  return (
    <FacultyGroupsWrapper>
      <Header />
      <FacultyGroupsContent>
        <h2>Faculty and Groups</h2>
        {faculties.map((faculty) => (
          <FacultySection key={faculty._id}>
            <FacultyTitle>
              {faculty.facultyId.firstname} {faculty.facultyId.lastname} (
              {getFacultyPerformance(faculty.facultyId._id)})
            </FacultyTitle>
            <br />
            {groups
              .filter(
                (group) =>
                  group.facultyprojectId.facultyId === faculty.facultyId._id
              )
              .map((group) => {
                const projectId = group.facultyprojectId.projectId;
                const project = projects.find((proj) => proj._id === projectId);

                return (
                  <GroupDetails key={group._id}>
                    <p>
                      <strong>Group Name:</strong> {group.name}
                    </p>
                    <p>
                      <strong>Avg Mark:</strong> {group.avg_mark}
                    </p>
                    <p>
                      <strong>Project domain:</strong>{" "}
                      {project ? project.domain : "N/A"}
                    </p>
                    <p>
                      <strong>Project defination:</strong>{" "}
                      {project ? project.defination : "N/A"}
                    </p>
                    <br />
                    <h4>Students:</h4>
                    {group.students.map((studentData) => {
                      // Now map using student._id instead of studentId
                      const student = students[studentData._id]; // Access student by _id
                      return (
                        <StudentInfo key={studentData._id}>
                          <p>
                            <strong>First Name:</strong> {student?.firstname}
                          </p>
                          <p>
                            <strong>Last Name:</strong> {student?.lastname}
                          </p>
                        </StudentInfo>
                      );
                    })}
                  </GroupDetails>
                );
              })}
          </FacultySection>
        ))}
      </FacultyGroupsContent>
    </FacultyGroupsWrapper>
  );
};

// Styled components for FacultyGroups
const FacultyGroupsWrapper = styled.div`
  margin-top: 80px; /* Adjust this if the header height is different */
`;

const FacultyGroupsContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background: #f7f7f7;
  text-align: center;
`;

const FacultySection = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
`;

const FacultyTitle = styled.h3`
  font-size: 1.8rem;
  color: #007bff;
  margin-bottom: 12px;
`;

const GroupDetails = styled.div`
  padding: 15px;
  background: #fff;
  border-radius: 6px;
  margin-bottom: 15px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

const StudentInfo = styled.div`
  padding: 10px;
  background: #e9ecef;
  border-radius: 5px;
  margin-bottom: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

export default FacultyGroups;
