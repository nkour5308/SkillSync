import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/explore", label: "Explore Matches" },
  { to: "/matches", label: "My Matches" },
  { to: "/sessions", label: "Sessions" },
  { to: "/profile", label: "My Profile" },
];

const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="w-56 shrink-0 bg-dark text-white min-h-screen flex flex-col">
      <div className="px-5 py-6 text-xl font-bold flex items-center gap-2">
        <span className="bg-primary rounded-md px-2 py-1">S</span> SkillSync
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg text-sm font-medium ${
                isActive ? "bg-primary text-white" : "text-gray-300 hover:bg-white/10"
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
        {user?.role === "admin" && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg text-sm font-medium ${
                isActive ? "bg-primary text-white" : "text-gray-300 hover:bg-white/10"
              }`
            }
          >
            Admin Panel
          </NavLink>
        )}
      </nav>
      <button
        onClick={logout}
        className="m-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-white/10 text-left"
      >
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
