import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";


// STYLES
import { Container, HeaderButton, HeaderAvatar } from "./styles";


// ICONS
import { IoMdAdd, IoMdApps, IoMdLogOut } from "react-icons/io";


// MENUS
import HamburguerMenu from "../common/SideMenuBar";
import { HamburguerButton } from "./style-hamburguer-button";


function Header() {
  const [showHamburguer, setShowHamburguer] = useState(false);
  const history = useHistory();


  const role = localStorage.getItem("role");
  // if ((role !== "admin" && role !== "teacher") ) return null;


  const onClickHamburguer = () => setShowHamburguer(!showHamburguer);


  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include", // Ensures cookies are cleared
      });


      if (response.ok) {
        localStorage.clear(); // 🧹 Clear all localStorage data
        console.log("After logout:", localStorage.getItem("role")); // 🔥 Debugging
        history.push("/"); // Redirect to login or home page
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };


  const handleAddClassroom = () => {
    history.push("/create-classroom"); // ✅ Redirect to Create Classroom
  };

  const name = localStorage.getItem("name");

  return (
    <>
      <Container>
        <HamburguerButton show={showHamburguer} onClick={onClickHamburguer}>
          <div></div>
          <div></div>
          <div></div>
        </HamburguerButton>


        <Link to="/">Classroom</Link>

        <div className="name">{name}</div>
        <div className="groupButtons">
          {/* ✅ Add Button (Redirects to Create Classroom) */}
          {
            role === "admin" || role === "teacher" ? (
              <HeaderButton className="addBtn" onClick={handleAddClassroom}   >
            <IoMdAdd size={25} color="rgb(77, 72, 72)" />
          </HeaderButton>) : null
          }
         


          {/* 🔹 Logout Button */}
          <HeaderButton className="logoutBtn" onClick={handleLogout}>
            <IoMdLogOut size={25} color="rgb(255, 72, 72)" title="Logout" />
          </HeaderButton>


          <HeaderAvatar className="imgAvatar" src="https://api.adorable.io/avatars/hi_mom" alt="Adorable Avatar!" />
        </div>
      </Container>


      <HamburguerMenu hide={showHamburguer} />
    </>
  );
}


export default Header;