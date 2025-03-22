import React, { useEffect, useState } from "react";
import Card from "../Card/index";
import ButtonDoubt from "../../../common/ButtonDoubt";
import { ContainerStyle } from "./styles";

export default function Container() {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const roleofuser=localStorage.getItem("role")
        let response = null;
        if(roleofuser==="teacher" || roleofuser==="admin"){
          response = await fetch("http://localhost:5000/api/classroom-faculties/classrooms", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            // credentials: "include", // ✅ Ensures cookies are sent
          });
        }
        else
        {
            response = await fetch("http://localhost:5000/api/classroom-students/classrooms", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            // credentials: "include", // ✅ Ensures cookies are sent
          });
        }
        const data = await response.json();
        console.log(data);
        
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
    
    
    fetchClassrooms();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
  }

  return (
    <ContainerStyle>
      {classrooms.length > 0 ? (
        classrooms.map((item) => <Card key={item._id} data={item.classroomId} />)
      ) : (
        <p>No classrooms found</p>
      )}
      <ButtonDoubt />
    </ContainerStyle>
  );
}
