import React from "react";

const Header = () => {
  return (
    <header className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search..."
          className="px-4 py-2 rounded border"
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
