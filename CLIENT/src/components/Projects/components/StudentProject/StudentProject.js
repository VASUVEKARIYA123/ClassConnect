import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  max-width: 1000px;
  margin: 40px auto;
  padding: 25px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Heading = styled.h2`
  margin-top: 35px;
  color: #333;
  font-size: 1.8rem;
  margin-bottom: 20px;
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
  padding: 12px;
  border-bottom: 2px solid #ddd;
  text-align: left;
`;

const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
  text-align: left;
`;

const Row = styled.tr`
  &:nth-child(even) {
    background: #f8f9fa;
  }
`;

const Message = styled.p`
  font-size: 1rem;
  font-weight: bold;
  margin-top: 15px;
  color: ${({ success }) => (success ? "green" : "red")};
`;

const Dropdown = styled.select`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
  outline: none;
`;

const Button = styled.button`
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: #007bff;
  color: white;
  cursor: pointer;
  width: 100%;
  font-size: 1rem;
  font-weight: bold;
  margin-top: 10px;

  &:hover {
    background: #0056b3;
  }
`;

function StudentProjects() {
  const [faculties, setFaculties] = useState([]);
  const [facultyProjectDetails, setFacultyProjectDetails] = useState({}); // Store full faculty project details
  const [facultyProjects, setFacultyProjects] = useState({});
  const [selectedChoices, setSelectedChoices] = useState([]);
  const [message, setMessage] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const studentId = localStorage.getItem("facultiesId");
  const classroomId = localStorage.getItem("classroomId");

  useEffect(() => {
    if (!classroomId || !studentId) {
        setMessage("No classroom or student ID found.");
        return;
    }

    fetch(`http://localhost:5000/api/groups/student/${studentId}/${classroomId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
        .then((res) => res.json())
        .then((data) => {
            if (!data._id) {
                setMessage("Group not found for this student.");
                return;
            }

            const groupId = data._id;
            localStorage.setItem("groupId", groupId);

            // ✅ Step 1: Fetch Student's Division from Classroom-Student
            fetch(`http://localhost:5000/api/classroom-students/${classroomId}/${studentId}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
                .then((res) => res.json())
                .then((studentData) => {
                    if (!studentData.division) {
                        setMessage("Student division not found.");
                        return;
                    }

                    const studentDivision = studentData.division; // ✅ Student's division

                    // ✅ Step 2: Fetch Faculties of the Classroom
                    fetch(`http://localhost:5000/api/classroom-faculties/faculties-of-classroom/${classroomId}`, {
                        method: "GET",
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                    })
                        .then((res) => res.json())
                        .then((facultiesData) => {
                            if (!Array.isArray(facultiesData.faculties)) {
                                setMessage("Invalid faculty data received.");
                                return;
                            }
                            // console.log(facultiesData.faculties[0].division);
                            
                            // ✅ Step 3: Filter faculties by division (exclude admins)
                            const filteredFaculties = facultiesData.faculties.filter(
                                faculty =>
                                    faculty.facultyId.role !== "admin" && 
                                    faculty.division === studentDivision // ✅ Match division
                            );

                            setFaculties(filteredFaculties);
                            
                            const updatedFacultyProjects = {};

                            // ✅ Step 4: Fetch Projects Only for These Faculties
                            Promise.all(
                                filteredFaculties.map((faculty) =>
                                    fetch(`http://localhost:5000/api/faculty-projects/${classroomId}/${faculty.facultyId._id}`, {
                                        method: "GET",
                                        headers: {
                                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                                            "Content-Type": "application/json",
                                        },
                                    })
                                        .then((res) => res.json())
                                        .then((projects) => {
                                            updatedFacultyProjects[faculty.facultyId._id] = projects;

                                            if (Array.isArray(projects)) {
                                                projects.forEach((project) => {
                                                    fetch(`http://localhost:5000/api/faculty-projects/${project._id}`, {
                                                        method: "GET",
                                                        headers: {
                                                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                                                            "Content-Type": "application/json",
                                                        },
                                                    })
                                                        .then((res) => res.json())
                                                        .then((projectDetails) => {
                                                            setFacultyProjectDetails((prev) => ({
                                                                ...prev,
                                                                [project._id]: projectDetails,
                                                            }));
                                                        })
                                                        .catch((err) =>
                                                            console.error(`Error fetching project details: ${project._id}`, err)
                                                        );
                                                });
                                            }
                                        })
                                        .catch((err) =>
                                            console.error(`Error fetching projects for faculty ${faculty.facultyId._id}:`, err)
                                        )
                                )
                            ).then(() => {
                                setFacultyProjects(updatedFacultyProjects);
                            });
                        })
                        .catch((err) => {
                            console.error("Error fetching faculties:", err);
                            setMessage("Error fetching faculties.");
                        });
                })
                .catch((err) => {
                    console.error("Error fetching student division:", err);
                    setMessage("Error fetching student division.");
                });
        })
        .catch((err) => {
            console.error("Error fetching group:", err);
            setMessage("Error fetching group.");
        });
}, []);



const handleSelection = async (facultyId, projectId, domain, defination) => {
  if (selectedChoices.some((choice) => choice.projectId === projectId)) {
      return setMessage("Cannot select the same project twice.");
  }

  if (selectedChoices.length >= 5) {
      return setMessage("You can only select 5 projects.");
  }

  try {
      // 🔍 Fetch faculty details from the API
      const res = await fetch(`http://localhost:5000/api/faculties/${facultyId}`, {
          method: "GET",
          headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
          },
      });

      if (!res.ok) {
          throw new Error("Failed to fetch faculty details.");
      }

      const faculty = await res.json();

      setSelectedChoices((prev) => [
          ...prev,
          {
              facultyId,
              projectId,
              domain,
              defination,
              faculty, // ✅ Storing the full faculty object
          },
      ]);
  } catch (error) {
      console.error("Error fetching faculty details:", error);
      setMessage("Error fetching faculty details.");
  }
};

  
  const handleUnselect = (projectId) => {
    setSelectedChoices((prev) =>
      prev.filter((choice) => choice.projectId !== projectId)
    );
  };
  

  const handleSubmit = async () => {
    if (selectedChoices.length !== 5) {
        return setMessage("You must select exactly 5 projects.");
    }

    const groupId = localStorage.getItem("groupId");
    try {
        await Promise.all(
            selectedChoices.map(async ({ facultyId, projectId }) => {
                console.log("Submitting selection:", { groupId, facultyId, projectId });

                const res = await fetch(`http://localhost:5000/api/groups/addGroupChoice/${groupId}/${projectId}`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!res.ok) {
                    throw new Error("Failed to submit project selection.");
                }

                const data = await res.json();

                const res1 = await fetch(`http://localhost:5000/api/groups/full/${groupId}`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ mode : "phase3" })
                });

                if (!res1.ok) {
                    throw new Error("Failed to change mode of group.");
                }

                // console.log("Selection response:", data);
            })
        );

        setMessage("Projects submitted successfully!");
        setSubmitted(true);

        // ✅ Redirect to the classroom page after a short delay
        setTimeout(() => {
            window.location.href = `/tasks/${classroomId}`; // Replace with the correct route
        }, 1500);
    } catch (err) {
        console.error("Error selecting project:", err);
        setMessage("Error submitting projects. Please try again.");
    }
};



  return (
  <Wrapper>
    <Heading>Selected Projects</Heading>
    <p style={{color : "red"}}>this is your project choice filling so fill choice wisely and fill accourding to precedence </p>
    {selectedChoices.length > 0 ? (
      <Table>
        <thead>
          <tr>

            <Th>Faculty</Th>
            <Th>Domain</Th>
            <Th>Definition</Th>
            <Th>Action</Th>
          </tr>
        </thead>
        <tbody>
          {selectedChoices.map(({ facultyId, projectId, domain, defination,faculty }) => (
            <Row key={projectId}>

              <Td>{faculty.firstname} {faculty.stname}</Td>
              <Td>{domain}</Td>
              <Td>{defination}</Td>
              <Td>
                <Button onClick={() => handleUnselect(projectId)}>Unselect</Button>
              </Td>
            </Row>
          ))}
        </tbody>
      </Table>
    ) : (
      <p>No projects selected.</p>
    )}
    <Button onClick={handleSubmit}>Submit Selections</Button>
    {message && <Message success={submitted}>{message}</Message>} 
    <Heading>Classroom Projects</Heading>
    
    {faculties.map((faculty) => (
      <div key={faculty.facultyId._id}>
        <h3>
          {faculty.facultyId.firstname} {faculty.facultyId.lastname}
        </h3>
        <Table>
          <thead>
            <tr>
              <Th>Project Domain</Th>
              <Th>Definition</Th>
              <Th>Action</Th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(facultyProjects[faculty.facultyId._id]) ? (
              facultyProjects[faculty.facultyId._id].map((project) => {
                const projectDetails =
                  facultyProjectDetails[project._id]?.projectId || {};
                return (
                  <Row key={project._id}>
                    <Td>{projectDetails.domain}</Td>
                    <Td>
                      {projectDetails.defination || (
                        <span style={{ color: "red", fontWeight: "bold" }}>
                          No Definition Available
                        </span>
                      )}
                    </Td>
                    <Td>
                      <Button
                        onClick={() =>
                          handleSelection(
                            faculty.facultyId._id,
                            project._id,
                            projectDetails.domain,
                            projectDetails.defination
                          )
                        }
                        disabled={selectedChoices.some(
                          (choice) => choice.projectId === project._id
                        )}
                      >
                        {selectedChoices.some(
                          (choice) => choice.projectId === project._id
                        )
                          ? "Selected"
                          : "Select"}
                      </Button>
                    </Td>
                  </Row>
                );
              })
            ) : (
              <Row>
                <Td colSpan="3" style={{ textAlign: "center", color: "gray" }}>
                  No projects available
                </Td>
              </Row>
            )}
          </tbody>
        </Table>
      </div>
    ))}
  
    
  </Wrapper>
);
}

export default StudentProjects;
