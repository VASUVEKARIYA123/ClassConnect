import React, { useState } from "react";
import styled from "styled-components";
import Header from "../Header";
import DoubtButton from "../common/ButtonDoubt";
import { useHistory } from "react-router-dom";

// Styled Components
const FormWrapper = styled.div`
  max-width: 50vw;
  margin: 40px auto;
  padding: 25px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
`;

const Button = styled.button`
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

const Message = styled.p`
  text-align: center;
  font-size: 1rem;
  font-weight: bold;
  margin-top: 10px;
  color: ${({ success }) => (success ? "green" : "red")};
`;

export default function CreateClassroom() {
  const history = useHistory();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    semester: "",
    cpi: "",
    min_group_size: "",
    max_group_size: "",
    division: false, // Checkbox for Different Division
  });

  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value, // ✅ Checkbox for `division`
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      // ✅ Step 1: Create Criteria
      const criteriaResponse = await fetch("http://localhost:5000/api/criteria", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          cpi: formData.cpi,
          min_group_size: formData.min_group_size,
          max_group_size: formData.max_group_size,
          division: formData.division,
        }),
      });

      const criteriaData = await criteriaResponse.json();
      if (!criteriaResponse.ok) {
        setMessage("Error creating criteria. Please check your inputs.");
        setSuccess(false);
        return;
      }

      const criteriaId = criteriaData.criteria._id; // ✅ Extract criteriaId
      localStorage.setItem("criteriaId", criteriaId);

      // ✅ Step 2: Create Classroom Using `criteriaId`
      const classroomResponse = await fetch("http://localhost:5000/api/classrooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          semester: formData.semester,
          criteria: criteriaId, // ✅ Use the created `criteriaId`
        }),
      });

      const classroomData = await classroomResponse.json();
      if (!classroomResponse.ok) {
        setMessage("Error creating classroom.");
        setSuccess(false);
        return;
      }

      const classroomId = classroomData.classroom._id; // ✅ Extract classroomId
      console.log(classroomId);
      
      localStorage.setItem("classroomId", classroomId);

      // ✅ Step 3: Associate Classroom with Faculty
      const facultyId = localStorage.getItem("facultiesId"); // ✅ Get faculty ID
      if (!facultyId) {
        setMessage("Faculty ID missing.");
        setSuccess(false);
        return;
      }

      const facultyClassroomResponse = await fetch("http://localhost:5000/api/classroom-faculties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          faculty:facultyId,
          classroomId,
        }),
      });

      if (!facultyClassroomResponse.ok) {
        setMessage("Error associating faculty with classroom.");
        setSuccess(false);
        return;
      }

      setMessage("Classroom Created & Assigned Successfully!");
      setSuccess(true);

      // ✅ Redirect after success
      setTimeout(() => {
        history.push("/subject");
        window.location.reload();
      }, 1500);
    } catch (error) {
      setMessage("Server Error. Please try again.");
      setSuccess(false);
      console.error("Server Error:", error);
    }
  };

  return (
    <>
      <Header />
      <FormWrapper>
        <h2>Create Classroom</h2>
        <form onSubmit={handleSubmit}>
          {/* Classroom Inputs */}
          <Input type="text" name="name" placeholder="Classroom Name" required onChange={handleChange} />
          <TextArea name="description" placeholder="Description" onChange={handleChange} />
          <Input type="number" name="semester" placeholder="Semester" required onChange={handleChange} />

          {/* Criteria Inputs */}
          <Input type="number" name="cpi" placeholder="CPI (0-10)" min="0" max="10" step="any" required onChange={handleChange} />
          <Input type="number" name="min_group_size" placeholder="Min Group Size (1-5)" min="1" max="5" required onChange={handleChange} />
          <Input type="number" name="max_group_size" placeholder="Max Group Size (1-5)" min="1" max="5" required onChange={handleChange} />

          {/* Division Checkbox */}
          <CheckboxLabel>
            <input type="checkbox" name="division" checked={formData.division} onChange={handleChange} />
            Different Division
          </CheckboxLabel>

          <Button type="submit">Create Classroom</Button>
        </form>
        {message && <Message success={success}>{message}</Message>}
      </FormWrapper>
      <DoubtButton />
    </>
  );
}
