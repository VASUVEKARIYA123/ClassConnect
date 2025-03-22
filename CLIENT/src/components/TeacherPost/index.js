import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// COMPONENTS
import Banner from "./components/Banner";
import AddLabTaskButton from "./components/addLabTaskbut"; 
import Container from "./components/Container";
import Header from "../Header";

export default function TeacherPost() {
  const { classId } = useParams(); // Get class ID from URL
  const [classrooms, setClassrooms] = useState(null); // Store fetched classrooms
  const [error, setError] = useState(null); // Store error message
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchClassroom = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/classrooms/${classId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
        });

        const data = await response.json();
        if (response.ok) {
          setClassrooms(data);
        } else {
          setError(data.message || "Failed to fetch classrooms.");
        }
      } catch (error) {
        setError("Server error: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    localStorage.setItem("classroomId", classId);
    fetchClassroom();
  }, [classId]);

  if (loading) return <p>Loading...</p>;
  if (!classrooms) return <p>Classroom not found.</p>;

  return (
    <>
      <Header />
    
   
      <Banner background={classrooms.background} id={classrooms._id} name={classrooms.name} teacher={classrooms.description} />

      <Container id={classrooms._id} data={classrooms._id} />
    </>
  );
}
