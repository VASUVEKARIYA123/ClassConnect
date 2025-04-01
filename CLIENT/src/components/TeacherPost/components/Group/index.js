import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import {
  Wrapper, Header, Informations, GroupName, DateOfCreation, Button,
  CreateGroupButton, Loader, InputField, JoinGroupButton, GroupMembers, GroupCode, CopyButton, ErrorMessage
} from './styles';

import { MdGroup } from "react-icons/md"; // Import the group icon

const Group = () => {
  const history = useHistory();
  const [groupData, setGroupData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupCode, setGroupCode] = useState('');
  const [errorMessage, setErrorMessage] = useState("");
  const studentId = localStorage.getItem("facultiesId");
  const classroomId = localStorage.getItem("classroomId");
  const fetchGroup = async () => {
    
    try {
      const response = await fetch(`http://localhost:5000/api/groups/student/${studentId}/${classroomId}`, {
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
          classroomId: localStorage.getItem("classroomId"),
          students: [studentId],
          name: groupName
        })
      });

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
      if (!response.ok) {
        throw new Error(responseData.error);
      } else {
        await fetchGroup();
      }
    } catch (error) {
      setErrorMessage(error.message);
      console.error("Error joining group:", error);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(groupData.groupCode);
  };

  const handleChangeMode = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/groups/changemode/${groupData._id}/${studentId}`, {
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

  const handleShowProjects = () => {
    history.push("/stu-projects"); // ✅ Redirect to Project Definitions Page
  };

  if (loading) {
    return <Loader>Loading...</Loader>;
  }

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

          {groupData.mode === "phase2" ? "" : (
            <GroupCode>
              <strong>Group Code :- &nbsp;&nbsp;</strong> {groupData.groupCode}{" "}
              <CopyButton onClick={handleCopyCode}>Copy</CopyButton>
            </GroupCode>
          )}

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

          {groupData.mode === "phase1" && (
            <Button onClick={handleChangeMode}>Confirm Group</Button>
          )}

          {(groupData.mode === "phase2" || groupData.mode === "phase3")  && (
            <Button onClick={handleShowProjects}>Show Project Definitions</Button>
         )}

          {groupData.mode === "phase3" && (
            //make it green

            
            <p style={{color:"green"}}>you have successfully added project definitions now wait for project allocation!...</p>
          )}

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
