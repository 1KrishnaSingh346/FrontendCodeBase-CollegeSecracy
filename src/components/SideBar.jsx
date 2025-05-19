import React from "react";

const Sidebar = () => {
  return (
    <div className="w-64 bg-blue-900 text-white">
      <div className="p-4 text-2xl font-bold border-b border-blue-800">
        MentorMentee Admin
      </div>
      <nav className="p-4">
        <ul>
          <li className="py-2 hover:bg-blue-700 rounded">
            <a href="#" className="block px-2">Dashboard</a>
          </li>
          <li className="py-2 hover:bg-blue-700 rounded">
            <a href="#" className="block px-2">Manage Mentors</a>
          </li>
          <li className="py-2 hover:bg-blue-700 rounded">
            <a href="#" className="block px-2">Manage Mentees</a>
          </li>
          <li className="py-2 hover:bg-blue-700 rounded">
            <a href="#" className="block px-2">Applications</a>
          </li>
          <li className="py-2 hover:bg-blue-700 rounded">
            <a href="#" className="block px-2">Reports</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
