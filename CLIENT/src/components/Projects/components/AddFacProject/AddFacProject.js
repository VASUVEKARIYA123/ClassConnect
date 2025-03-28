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
  margin-top:35px;
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
  color: white;
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

const ProjectCard = styled.div`
  padding: 15px;
  margin: 10px 0;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #ddd;
`;
const DropdownOption = styled.option`
  font-size: 1rem;
  padding: 10px;
`;

function ProjectsContainer() {
  const history = useHistory();
  const [projects, setProjects] = useState([]);
  const [domain, setDomain] = useState("");
  const [classroomProjects, setClassroomProjects] = useState([]); // Admin-added projects
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
    const facultyId = localStorage.getItem("facultiesId");  
    const classroomId = localStorage.getItem("classroomId"); 

    if (!facultyId || !classroomId) {
        console.error("Missing facultyId or classroomId.");
        return;
    }

    fetch(`http://localhost:5000/api/faculty-projects/fp/${facultyId}/${classroomId}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    })
    .then((response) => response.json())
    .then((data) => {
        console.log("Faculty Projects Response:", data);
        if (Array.isArray(data.facultyProject)) {
            setProjects(data.facultyProject);
        } else {
            console.error("Unexpected data format:", data);
            console.log(data);
            setProjects(data || []);
        }
    })
    .catch((error) => console.error("Error fetching faculty projects:", error));

    fetch(`http://localhost:5000/api/classrooms/classroom/${classroomId}/projects`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    })
    .then((response) => response.json())
    .then((data) => {
        console.log("Classroom Projects Response:", data);
        setClassroomProjects(Array.isArray(data.projects) ? data.projects : []);
    })
    .catch((error) => console.error("Error fetching classroom projects:", error));

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
    const facultyId = localStorage.getItem("facultiesId"); // Get facultyId from logged-in user
    const classroomId = localStorage.getItem("classroomId"); // ✅ Get classroomId from storage
  
    
    try {
      // ✅ Step 1: Create Project
      const response = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject),
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || "Failed to add project.");
        setSuccess(false);
        return;
      }

      const projectId = data.project._id; // ✅ Get projectId from response
    //   console.log(data.project);
      
      // ✅ Step 2: Associate Project with Faculty & Classroom
      const facultyResponse = await fetch("http://localhost:5000/api/faculty-projects/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ facultyId, projectId, classroomId }), // ✅ Sending classroomId too
      });

      const facultyData = await facultyResponse.json();
      console.log(facultyData);
      
      if (!facultyResponse.ok) {
        setMessage(facultyData.error || "Failed to associate project with faculty.");
        setSuccess(false);
        return;
      }

      // ✅ Success Message & UI Update
      setProjects([...projects, facultyData.facultyProject] || []);
      
      
      setDomain("");
      setDefinition("");
      setMessage("Project added and assigned to faculty successfully!");
      setSuccess(true);
      
    } catch (error) {
      setMessage("Server error: " + error.message);
      setSuccess(false);
    }
  };

  // Open Modal for Update
  const openUpdateModal = (project) => {
    setSelectedProject(project);
    setDomain(project.projectId.domain);
    setDefinition(project.projectId.defination);
    setMax_groups(project.projectId.max_groups);
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
        const projectId = selectedProject.projectId._id; 
        const facultyProjectId = selectedProject._id; // Faculty-Project ID

        // ✅ Step 1: Update Project
        const projectResponse = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                domain,
                defination: definition,
                max_groups
            }),
        });

        if (!projectResponse.ok) {
            setMessage("Failed to update project.");
            setSuccess(false);
            return;
        }

        // ✅ Step 2: Update Faculty-Project Entry
        const facultyResponse = await fetch(`http://localhost:5000/api/faculty-projects/${facultyProjectId}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                facultyId: localStorage.getItem("facultiesId"),
                projectId,
                classroomId: localStorage.getItem("classroomId")
            }),
        });

        if (!facultyResponse.ok) {
            setMessage("Failed to update faculty-project entry.");
            setSuccess(false);
            return;
        }

        // ✅ Step 3: Update State & Close Modal

          console.log("Projects:", projects);
          
          setProjects(
            projects.map((proj) =>
                proj.projectId._id === projectId
                    ? { ...proj, projectId: { ...proj.projectId, domain, defination: definition, max_groups } }
                    : proj
            ) 
        );
        
        
        
        setDomain("");
        setDefinition("");
        setMax_groups("");
        setIsModalOpen(false);
        setMessage("Project and Faculty-Project updated successfully!");
        setSuccess(true);

    } catch (error) {
        setMessage("Server error: " + error.message);
        setSuccess(false);
    }
};

  
  // Open delete confirmation modal
  const openDeleteModal = (projectId) => {
    setSelectedProjectId(projectId);
    setIsDeleteModalOpen(true);
  };

  


  const fetchProjects = () => {
    const facultyId = localStorage.getItem("facultiesId");
    const classroomId = localStorage.getItem("classroomId");

    if (!facultyId || !classroomId) {
        console.error("Missing facultyId or classroomId.");
        return;
    }

    fetch(`http://localhost:5000/api/faculty-projects/fp/${facultyId}/${classroomId}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    })
    .then((response) => response.json())
    .then((data) => {
        setProjects(data || []);
    })
    .catch((error) => console.error("Error fetching faculty projects:", error));
};


  const handleAddProject = async (projectId) => {
    const facultyId = localStorage.getItem("facultiesId");  // ✅ Get logged-in faculty's ID
    const classroomId = localStorage.getItem("classroomId"); // ✅ Get selected classroom ID

    if (!facultyId || !classroomId) {
        console.error("Missing facultyId or classroomId.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/faculty-projects/", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ facultyId, projectId, classroomId }),
        });

        const data = await response.json();
        if (!response.ok) {
            setMessage(data.message || "Failed to add project.");
            setSuccess(false);
            return;
        }

        setMessage("Project added successfully!");
        setSuccess(true);

        // ✅ Re-fetch projects after adding
        fetchProjects();

    } catch (error) {
        setMessage("Server error: " + error.message);
        setSuccess(false);
    }
};

const uniqueDomains = [...new Set(classroomProjects.map((p) => p.domain))];
const [selectedDomain, setSelectedDomain] = useState("");

const filteredProjects = selectedDomain
    ? classroomProjects.filter((project) => project.domain === selectedDomain)
    : [];

console.log("Filtered Projects:", filteredProjects);


  return (
    <Wrapper>
      <Heading>Project Definitions</Heading>
      <form onSubmit={handleSubmit}>
        <Input type="text" placeholder="Enter Domain" value={domain} onChange={(e) => setDomain(e.target.value)} />
        <Input type="text" placeholder="Enter Definition" value={definition} onChange={(e) => setDefinition(e.target.value)} />
        <Button1 type="submit">Add Project</Button1>
       
      </form>
      {message && <Message success={success}>{message}</Message>}
      <Table>
        <thead>
          <tr>
            <Th>Number</Th>
            <Th>Domain</Th>
            <Th>Definition</Th>
            <Th>Max Groups</Th>
            {/* <Th>Actions</Th> */}
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <Row key={project.projectId._id}>
              <Td>{project.projectId.number}</Td>
              <Td>{project.projectId.domain}</Td>
              <Td>{project.projectId.defination}</Td>
              <Td>{project.projectId.max_groups}</Td>
            </Row>
          ))}
        </tbody>
      </Table>

      <Heading>Classroom Projects (Added by Admin)</Heading>

      <h2>Select a Project Domain</h2>
      {/* Dropdown for selecting domain */}
      <Dropdown onChange={(e) => setSelectedDomain(e.target.value)}>
        <option value="">-- Select Domain --</option>
        {uniqueDomains.map((domain, index) => (
          <option key={index} value={domain}>{domain}</option>
        ))}
      </Dropdown>
    
      <Table>
        <thead>
          <tr>
            {/* <Th>Number</Th> */}
            <Th>Domain</Th>
            <Th>Definition</Th>
            <Th>Max Groups</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        
        <tbody>
          {filteredProjects.map((project) => (
            <Row key={project._id}>
              {/* <Td>{project.number}</Td> */}
              <Td>{project.domain}</Td>
              <Td>{project.defination}</Td>
              <Td>{project.max_groups}</Td>
              <Td>
                <Button
                  onClick={() => handleAddProject(project._id)}
                  disabled={projects.some((p) => p.projectId._id === project._id)}
                >
                  {projects.some((p) => p.projectId._id === project._id) ? "Added" : "Add"}
                </Button>
              </Td>
            </Row>
          ))}
        </tbody>
      </Table>

    <div>
      {selectedDomain==="" ? (
        <p>Select a domain to view projects</p>
      ) : (<p></p>)}
    </div>
    
    {/* Display filtered projects */}
    <div>
      {filteredProjects.length == 0 && selectedDomain!=="" ? (
        <p>No projects found for this domain.</p>
      ) : (
        <p></p>
      )}
    </div>

    </Wrapper>
  );
}

export default ProjectsContainer;