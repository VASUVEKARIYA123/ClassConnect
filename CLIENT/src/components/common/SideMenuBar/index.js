import React, { useState } from "react";
import { Link } from "react-router-dom";

// ICONS
import { IoMdHome } from "react-icons/io";

// STYLES
import { Menu, WrapperMenu, LittleTitle } from "./styles";

// API (Contains Subjects Data)
import api from "../../../services/tasks";

export default function SideMenuBar({ hide }) {
  const [menuOptions] = useState(api); // ✅ Contains subject list
  const role=localStorage.getItem("role")
  return (
    <Menu show={hide}>
      <WrapperMenu>
        {/* 🔹 Add Faculty (Only for Admins) */}
        {role === "admin" && (
          <Link to="/add-faculty">
            Add Faculty
          </Link>
        )}
        {role === "admin" && (
          <Link to="/faculty-byfile">
            Add Faculties
          </Link>
        )}
        {role === "admin" && (
          <Link to="/projects">
            Add Projects
          </Link>
        )}
        
      </WrapperMenu>
    </Menu>
  );
}
