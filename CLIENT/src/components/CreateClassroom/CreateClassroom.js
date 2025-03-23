import React, { useState } from "react";
import styled from "styled-components";
import Header from "../Header";
import DoubtButton from "../common/ButtonDoubt";
import { useHistory } from "react-router-dom";

// Styled Components
const FormWrapper = styled.div`
  max-width: 50vw;
  margin: 40px auto;
  padding: 20px;
  background: snow;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
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
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  background: #007bff;
  color: white;
  cursor: pointer;
  width: 100%;
  font-size: 1rem;
  transition: background 0.3s;

  &:hover {
    background: #0056b3;
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
    // Classroom Fields
    name: "",
    description: "",
    semester: "",
    // Criteria Fields
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

      if (!classroomResponse.ok) {
        setMessage("Error creating classroom.");
        setSuccess(false);
        return;
      }

      setMessage("Classroom Created Successfully!");
      setSuccess(true);

      // ✅ Redirect after success
      setTimeout(() => {
        history.push("/subject");
        window.location.reload();
      }, 1500);
    } catch (error) {
      setMessage("Error creating classroom.");
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
