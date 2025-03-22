import React, { useState, useEffect } from 'react';
import {
  Wrapper, Header, Informations, GroupName, DateOfCreation, Button,
 CreateGroupButton, Loader, InputField, JoinGroupButton ,GroupMembers, GroupCode, CopyButton , ErrorMessage
} from './styles';


import { MdGroup } from "react-icons/md"; // Import the group icon
const Group = () => {
  const [groupData, setGroupData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupCode, setGroupCode] = useState('');
  const [errorMessage, setErrorMessage] = useState("");
 
  const fetchGroup = async () => {
    const studentId = localStorage.getItem("facultiesId");
    try {
      const response = await fetch(`http://localhost:5000/api/groups/student/${studentId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
      });
      if (!response.ok) throw new Error("Failed to fetch group");
      const data = await response.json();
      setGroupData(data);
    } catch (error) {
      console.error("Error fetching group data:", error);
      // setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchGroup();
  }, []);


  const handleCreateGroup = async () => {
    if (!groupName) {
      alert("Please enter a group name");
      return;
    }
    setCreating(true);
    try {
      const studentId = localStorage.getItem("facultiesId");
      const response = await fetch("http://localhost:5000/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          classroomId:localStorage.getItem("classroomId"),
          students: [studentId],
          name: groupName
        })
      });
      console.log(localStorage.getItem("classroomId"));
      
      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.error);
      await fetchGroup();
    } catch (error) {
      setErrorMessage(error.message);
      console.error("Error creating group:", error);
    } finally {
      setCreating(false);
    }
  };


  const handleJoinGroup = async () => {
    if (!groupCode) {
      alert("Please enter a group code");
      return;
    }
    try {
      const studentId = localStorage.getItem("facultiesId");
      const response = await fetch(`http://localhost:5000/api/groups/join-group/${groupCode}/${studentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
      });
     
      const responseData = await response.json();
      if (!response.ok){
        // console.log(responseData);


        throw new Error(responseData.error);
      }
      else{
        await fetchGroup();
      }
     


      // setGroupData(data);
    } catch (error) {
     
      setErrorMessage(error.message);
      console.error("Error joining group:", error);
    }
  };


  const handleCopyCode = () => {
    navigator.clipboard.writeText(groupData.groupCode);
    // alert("Group Code Copied!");
  };


  const handleChangeMode = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/groups/changemode/${groupData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
      });
      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.error);
      await fetchGroup();
    } catch (error) {
      setErrorMessage(error.message);
      console.error("Error changing group mode:", error);
    }
  };


  if (loading) {
    return <Loader>Loading...</Loader>;
  }
 
  const role=localStorage.getItem("role")

  return (
    <Wrapper>
      {groupData ? (
        <>
          <Header>
          <MdGroup size={40} />
            <Informations>
              <GroupName>{groupData.name}</GroupName>
              <DateOfCreation>Created on: {groupData.createdAt}</DateOfCreation>
            </Informations>
          </Header>
          {/* <Description>{groupData.description}</Description> */}
          { groupData.mode === "phase2" ? "" :
          <GroupCode>
            <strong>Group Code :- &nbsp;&nbsp;</strong> {groupData.groupCode}{" "}
            <CopyButton onClick={handleCopyCode}>Copy</CopyButton>
          </GroupCode>
    }
      
          <GroupMembers>
          <strong>Members  :-  &nbsp;&nbsp;</strong>
            <ul>
              {groupData.students.length > 0 ? (
                groupData.students.map((student, index) => (
                  <li key={index}>
                    {student.studentId} - {student.firstname} {student.lastname}
                  </li>
                ))
              ) : (
                <li>No members yet</li>
              )}
            </ul>
          </GroupMembers>
     
          {groupData.mode==="phase2"? "":<Button onClick={handleChangeMode}>confirm Group</Button>}
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        </>
      ) : (
        <>
          <InputField
            type="text"
            placeholder="Enter Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <CreateGroupButton onClick={handleCreateGroup} disabled={creating}>
            {creating ? "Creating..." : "Create Group"}
          </CreateGroupButton>
          <p>OR</p>
          <InputField
            type="text"
            placeholder="Enter Group Code"
            value={groupCode}
            onChange={(e) => setGroupCode(e.target.value)}
          />
          <JoinGroupButton onClick={handleJoinGroup}>Join Group</JoinGroupButton>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        </>
      )}
    </Wrapper>
  );
};


export default Group;