import React from "react";
import { LuLayoutDashboard } from "react-icons/lu";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Typography } from "@mui/material";

const Item = ({ title, to, icon, selected, setSelected }) => {
  return (
    <MenuItem
      icon={icon}
      active={selected === title}
      style={{ backgroundColor: selected === title ? "#ededed" : "white" }}
      onClick={() => setSelected(title)}
    >
      <Link to={to}>
        <Typography>{title}</Typography>
      </Link>
    </MenuItem>
  );
};

function SidebarNav() {
  const [selected, setSelected] = useState("Dashboard");
  return (
    <div className="fixed flex h-screen">
      <Sidebar>
        <Menu>
          <Item
            title="Dashboard"
            to="/dashboard"
            icon={<LuLayoutDashboard />}
            selected={selected}
            setSelected={setSelected}
          ></Item>
          <Item
            title="Profile"
            to="/ukm"
            icon={<LuLayoutDashboard />}
            selected={selected}
            setSelected={setSelected}
          ></Item>
        </Menu>
      </Sidebar>
    </div>
  );
}

export default SidebarNav;
