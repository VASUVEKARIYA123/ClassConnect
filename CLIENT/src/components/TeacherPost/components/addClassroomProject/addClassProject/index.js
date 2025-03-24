import React, { useEffect, useState, useCallback, useMemo } from "react";
import styled from "styled-components";
// import headers from "../../../Header";

const Wrapper = styled.div`
  max-width: 1000px;
  margin: 40px auto;
  padding: 25px;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(15px);
  border-radius: 12px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.15);
  text-align: center;
`;

const Heading = styled.h2`
  color: #222;
  font-size: 2rem;
  margin-bottom: 25px;
  font-weight: bold;
  text-transform: uppercase;
`;

const DomainHeading = styled.h3`
  padding-top: 25px;
  color: blue;
  font-size: 1.6rem;
  margin-top: 25px;
  text-align: left;
  border-bottom: 2px solid #ccc;
  padding-bottom: 5px;
`;

const ProjectList = styled.ul`
  list-style: none;
  padding: 0;
`;

const Button = styled.button`
  margin-left: 0;
  margin-top: 10px;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  color: white;
  background-color: ${(props) => (props.remove ? "red" : "green")};

  &:hover {
    opacity: 0.8;
  }
`;

const ProjectItem = styled.li`
  padding: 15px;
  margin: 12px 0;
  background: linear-gradient(135deg, #ffffff, #f8f9fa);
  border-radius: 10px;
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.1);
  text-align: left;
  transition: transform 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0px 5px 12px rgba(0, 0, 0, 0.2);
  }
`;

const Dropdown = styled.select`
  width: 100%;
  padding: 10px;
  margin: 15px 0;
  font-size: 1rem;
  border-radius: 8px;
  border: 2px solid #ccc;
  background: white;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
`;

const DropdownOption = styled.option`
  font-size: 1rem;
  padding: 10px;
`;


const ProjectsContainer = () => {
  const [projects, setProjects] = useState([]);
  const [classroomProjects, setClassroomProjects] = useState([]);
  const classroomId = localStorage.getItem("classroomId");

  useEffect(() => {
    fetch("http://localhost:5000/api/projects", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const sortedProjects = data.sort((a, b) => a.number - b.number);
        setProjects(sortedProjects);
      })
      .catch((error) => console.error("Error fetching projects:", error));
  }, []);

  useEffect(() => {
    if (classroomId) {
      fetch(`http://localhost:5000/api/classrooms/${classroomId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
            const sortedClassroomProjects = (data.projects || []).sort(
              (a, b) => a.number - b.number
            );
            setClassroomProjects(sortedClassroomProjects);
          })
        .catch((error) =>
          console.error("Error fetching classroom projects:", error)
        );
    }
  }, [classroomId]);

  const handleAddProject = useCallback(
    async (projectId) => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/classrooms/add-project",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ classroomId, projectId }),
          }
        );
        if (response.ok) {
          const data = await response.json();
          setClassroomProjects((prev) => [...prev, data.project].sort((a, b) => a.number - b.number));
        } else {
          console.error("Failed to add project");
          alert("Failed to add project.");
        }
      } catch (error) {
        console.error("Error adding project:", error);
        alert("Error adding project.");
      }
    },
    [classroomId]
  );

  const handleRemoveProject = useCallback(
    async (projectId) => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/classrooms/remove-project",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ classroomId, projectId }),
          }
        );
        if (response.ok) {
            setClassroomProjects((prev) =>
                prev.filter((p) => p._id !== projectId).sort((a, b) => a.number - b.number)
              );
        } else {
          console.error("Failed to remove project");
          alert("Failed to remove project.");
        }
      } catch (error) {
        console.error("Error removing project:", error);
        alert("Error removing project.");
      }
    },
    [classroomId]
  );

  const classroomProjectIds = useMemo(
    () => new Set(classroomProjects.map((p) => p._id)),
    [classroomProjects]
  );
  const availableProjects = useMemo(
    () => projects.filter((p) => !classroomProjectIds.has(p._id)),
    [projects, classroomProjectIds]
  );

  const groupedClassroomProjects = useMemo(
    () =>
      classroomProjects.reduce((acc, project) => {
        if (!acc[project.domain]) acc[project.domain] = [];
        acc[project.domain].push(project);
        return acc;
      }, {}),
    [classroomProjects]
  );

  const groupedAvailableProjects = useMemo(
    () =>
      availableProjects.reduce((acc, project) => {
        if (!acc[project.domain]) acc[project.domain] = [];
        acc[project.domain].push(project);
        return acc;
      }, {}),
    [availableProjects]
  );

  const [selectedDomain, setSelectedDomain] = useState("");

  const handleDomainChange = (event) => {
    setSelectedDomain(event.target.value);
  };

  return (
    <Wrapper>
      <Heading>Classroom Projects ({classroomProjects.length})</Heading>
      {Object.keys(groupedClassroomProjects).length === 0 ? (
        <p style={{ textAlign: "center", fontSize: "1.2rem", color: "#666" }}>
          No project has been added.
        </p>
      ) : (
        Object.keys(groupedClassroomProjects).map((domain) => (
          <div key={domain}>
            <DomainHeading>{domain}</DomainHeading>
            <ProjectList>
              {groupedClassroomProjects[domain].map((project) => (
                <ProjectItem key={project._id}>
                  <strong>Definition:</strong> {project.defination}
                  <Button remove onClick={() => handleRemoveProject(project._id)}>
                    Remove
                  </Button>
                </ProjectItem>
              ))}
            </ProjectList>
          </div>
        ))
      )}


      {/* <Heading>Available Projects</Heading>
      {Object.keys(groupedAvailableProjects).map((domain) => (
        <div key={domain}>
          <DomainHeading>{domain}</DomainHeading>
          <ProjectList>
            {groupedAvailableProjects[domain].map((project) => (
              <ProjectItem key={project._id}>
                <strong>Definition:</strong> {project.defination}
                <Button onClick={() => handleAddProject(project._id)}>
                  Add
                </Button>
              </ProjectItem>
            ))}
          </ProjectList>
        </div>
      ))} */}
      <Heading>Available Projects</Heading>
      <Dropdown onChange={handleDomainChange} value={selectedDomain}>
      <DropdownOption value="">Select Domain</DropdownOption>
      {Object.keys(groupedAvailableProjects).map((domain) => (
        <DropdownOption key={domain} value={domain}>
          {domain}
        </DropdownOption>
      ))}
    </Dropdown>

    {selectedDomain && groupedAvailableProjects[selectedDomain] && (
      <ProjectList>
        {groupedAvailableProjects[selectedDomain].map((project) => (
          <ProjectItem key={project._id}>
            <strong>Definition:</strong> {project.defination}
            <Button onClick={() => handleAddProject(project._id)}>Add</Button>
          </ProjectItem>
        ))}
      </ProjectList>
    )}
    </Wrapper>
  );
};

export default ProjectsContainer;
