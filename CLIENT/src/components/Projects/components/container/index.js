import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
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
  color: #333;
  font-size: 1.8rem;
  margin-bottom: 20px;
`;

const T = styled.p`
    font-size: 1rem;
    // padding: 10px;
    margin: 10px;
    color: #333;
`;

const Input = styled.input`
  width: 95%;
  padding: 12px;
  margin: 10px 0;
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

const Button1 = styled.button`
  padding: 12px 15px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  cursor: pointer;
  width: 100%;
  font-size: 1rem;
  font-weight: bold;
  transition: transform 0.2s, background 0.3s;

  &:hover {
    transform: translateY(-3px);
    background: linear-gradient(135deg, #0056b3, #003d80);
  }
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
  &.update {
    background: #007bff;
    color: white;
  }

  &.delete {
    background: red;
    color: white;
  }
  &:hover {
    transform: translateY(-3px);
    background: linear-gradient(135deg, #0056b3, #003d80);
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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  text-align: center;
`;

const CloseButton = styled.button`
  background: red;
  color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
  margin-top: 10px;
`;

const Message = styled.p`
  font-size: 1rem;
  font-weight: bold;
  margin-top: 15px;
  color: ${({ success }) => (success ? "green" : "red")};
`;
function ProjectsContainer() {
  const history = useHistory();
  const [projects, setProjects] = useState([]);
  const [domain, setDomain] = useState("");
  const [definition, setDefinition] = useState("");
  const [max_groups, setMax_groups] = useState("");
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  // Fetch existing project definitions
  useEffect(() => {
    fetch("http://localhost:5000/api/projects", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error("Error fetching projects:", error));
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!domain || !definition) {
      setMessage("Please fill all fields.");
      setSuccess(false);
      return;
    }

    const newProject = { domain, defination: definition };

    try {
      const response = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject),
      });

      const data = await response.json();
      if (response.ok) {
        setProjects([...projects, data.project]);
        setDomain("");
        setDefinition("");
        setMessage("Project added successfully!");
        setSuccess(true);
        
      } else {
        setMessage(data.error || "Failed to add project.");
        setSuccess(false);
      }
    } catch (error) {
      setMessage("Server error: " + error.message);
      setSuccess(false);
    }
  };

  // Open Modal for Update
  const openUpdateModal = (project) => {
    setSelectedProject(project);
    setDomain(project.domain);
    setDefinition(project.defination);
    setMax_groups(project.max_groups);
    setIsModalOpen(true);
  };

  // Handle Update
  const handleUpdate = async () => {
    setMessage(null);
    if (!domain || !definition || !max_groups) {
      setMessage("Please fill all fields.");
      setSuccess(false);
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/projects/${selectedProject._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ domain, defination: definition , max_groups:  max_groups }),
      });

      if (response.ok) {
        setProjects(
          projects.map((proj) =>
            proj._id === selectedProject._id ? { ...proj, domain, defination: definition, max_groups: max_groups } : proj
          )
        );
        setDomain("");
        setDefinition("");
        setMax_groups(8);
        setIsModalOpen(false);
      } else {
        setMessage("Failed to update project.");
      }
    } catch (error) {
      setMessage("Server error: " + error.message);
    }
  };

  const handleDelete = async () => {
    if (!selectedProjectId) return;

    try {
      const response = await fetch(`http://localhost:5000/api/projects/${selectedProjectId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        setProjects(projects.filter((project) => project._id !== selectedProjectId));
        setIsDeleteModalOpen(false);
      } else {
        console.error("Failed to delete project");
      }
    } catch (error) {
      console.error("Server error:", error.message);
    }
  };

  
  // Open delete confirmation modal
  const openDeleteModal = (projectId) => {
    setSelectedProjectId(projectId);
    setIsDeleteModalOpen(true);
  };


  return (
    <Wrapper>
      <Heading>Project Definitions</Heading>
      <form onSubmit={handleSubmit}>
        <Input type="text" placeholder="Enter Domain" value={domain} onChange={(e) => setDomain(e.target.value)} />
        <Input type="text" placeholder="Enter Definition" value={definition} onChange={(e) => setDefinition(e.target.value)} />
        <Button1 type="submit">Add Project</Button1>
        <T>Or</T>
        <Button1 type="button" onClick={() => history.push("/import-projects")}>Import Project</Button1>
      </form>
      {message && <Message success={success}>{message}</Message>}
      <Table>
        <thead>
          <tr>
            <Th>Number</Th>
            <Th>Domain</Th>
            <Th>Definition</Th>
            <Th>Max Groups</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <Row key={project._id}>
              <Td>{project.number}</Td>
              <Td>{project.domain}</Td>
              <Td>{project.defination}</Td>
              <Td>{project.max_groups}</Td>
              <Td>
                <Button className="update" onClick={() => openUpdateModal(project)}>Update</Button>
                <Button className="delete" onClick={() => openDeleteModal(project._id)}>Delete</Button>
            </Td>
            </Row>
          ))}
        </tbody>
      </Table>

      {isDeleteModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <h3>Are you sure you want to delete this project?</h3>
            <Button className="delete" onClick={handleDelete}>Yes, Delete</Button>
            <CloseButton onClick={() => setIsDeleteModalOpen(false)}>Cancel</CloseButton>
          </ModalContent>
        </ModalOverlay>
      )}

      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <h3>Update Project</h3>
            <Input type="text" value={domain} onChange={(e) => setDomain(e.target.value)} />
            <Input type="text" value={definition} onChange={(e) => setDefinition(e.target.value)} />
            <Input type="number" value={max_groups} onChange={(e) => setMax_groups(e.target.value)} />
            <Button className="update" onClick={handleUpdate}>Save Changes</Button>
            <CloseButton onClick={() =>  {setDefinition("");setDomain(""); setIsModalOpen(false)}}>Close</CloseButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </Wrapper>
  );
}

export default ProjectsContainer;
