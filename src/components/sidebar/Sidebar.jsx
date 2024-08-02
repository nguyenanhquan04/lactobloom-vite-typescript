// src/components/Sidebar.js
import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="#">Product Management</Link>
        </li>
        <li>
          <Link to="#">Blog Management</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
