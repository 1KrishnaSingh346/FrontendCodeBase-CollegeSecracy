import React from "react";
import useAuthStore  from "../store/useAuthStore"; // ✅ Import auth store
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react"; // ✅ Logout Icon from Lucide Icons

const MentorPage = () => {
  const { logout, authUser } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/"); // Redirect to login page after logout
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ✅ Navbar */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Mentor Dashboard</h1>
        
        <div className="flex items-center space-x-4">
          <span className="text-gray-700 font-medium">{authUser?.fullName}</span>
          
          {/* ✅ Logout Button with Icon */}
          <button
            onClick={handleLogout}
            className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </button>
        </div>
      </nav>

      {/* ✅ Mentor Content */}
      <div className="p-6">
        <h2 className="text-xl font-semibold">Welcome, {authUser?.fullName}!</h2>
        <p className="text-gray-600 mt-2">Manage your mentorship sessions and mentees.</p>
      </div>
    </div>
  );
};

export default MentorPage;
