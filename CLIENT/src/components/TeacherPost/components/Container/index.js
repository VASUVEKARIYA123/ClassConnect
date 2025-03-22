import React,  { useState,useEffect }  from 'react';
import styled from 'styled-components';
import Group from '../Group'
// COMPONENTS
import CardPost from '../CardPost/'
import NextTask from '../NextTask'

const Wrapper = styled.div`
  display: flex;
  max-width: 80vw;
  margin: 0 auto;
  flex-wrap: wrap;
`;



export default ({data}) => {
  const classroomId = data;
  // console.log(data);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/lab-tasks/classroom/${classroomId}`,{
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const data = await response.json();
        console.log(data);
        
        setTasks(data);
        // console.log(tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [classroomId]);

  useEffect(() => {
    console.log("Updated tasks:", tasks);
  }, [tasks]); // Run

  const role=localStorage.getItem("role")

  return (
    <>
    <Wrapper>
      <NextTask />
      {role ==="admin" ? "" :
         <Group />
      }
      {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length > 0 ? (
          tasks.map((task) => <CardPost key={task._id} data={task} />)
        ) : (
          <p>No tasks available for this classroom.</p>
        )}

    </Wrapper>
    </>
  );
}
