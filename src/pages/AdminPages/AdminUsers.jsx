import React, { useEffect, useState } from 'react';
import useAuthStore from '../../store/useAuthStore';
import { FullScreenLoader } from '../../components/Loaders/script.js';
import { formatDate } from '../../utils/formatDate';

const AdminUsers = () => {
  const { AllUsers, fetchAllUsers, isfetchingUser } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  
  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  if (isfetchingUser) {
    return <FullScreenLoader message="Loading users..." />;
  }

  const filteredUsers = AllUsers?.filter(user => 
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.subscriptionPlan?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const toggleUserDetails = (userId) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">User Management</h2>
        <div className="relative w-full md:w-auto">
          <input
            type="text"
            placeholder="Search users..."
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      
     {/* Mobile view - cards */}
<div className="md:hidden space-y-4 px-2">
  {currentUsers.map((user) => (
    <div key={user._id} className="w-full border rounded-lg p-4 shadow-sm bg-white">
      <div 
        className="flex flex-wrap justify-between items-start cursor-pointer gap-2"
        onClick={() => toggleUserDetails(user._id)}
      >
        {/* Avatar and Name Section */}
        <div className="flex items-center min-w-0">
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-indigo-600 font-medium">{user.fullName?.charAt(0) || 'U'}</span>
          </div>
          <div className="ml-3 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">{user.fullName || 'Unknown'}</div>
            <div className="text-xs text-gray-500 truncate">{user.email}</div>
          </div>
        </div>

        {/* Role and Status Badges */}
        <div className="flex gap-2 items-center">
          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full
            ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
              user.role === 'mentor' ? 'bg-blue-100 text-blue-800' : 
              'bg-green-100 text-green-800'}`}>
            {user.role}
          </span>
          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full
            ${user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {user.active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Expanded details for mobile */}
      {expandedUserId === user._id && (
        <div className="mt-4 pt-4 border-t text-sm space-y-4">
          {/* Profile Details */}
          <div className="space-y-1">
            <h4 className="font-semibold text-gray-700 text-sm">Profile Details</h4>
            <p className="text-xs text-gray-700">
              <span className="font-medium">Joined:</span> {formatDate(user.createdAt)}
            </p>
            {user.phone && (
              <p className="text-xs text-gray-700 break-words">
                <span className="font-medium">Phone:</span> {user.phone}
              </p>
            )}
            {user.location && (
              <p className="text-xs text-gray-700 break-words">
                <span className="font-medium">Location:</span> {user.location}
              </p>
            )}
            <p className="text-xs text-gray-700">
              <span className="font-medium">Last Active:</span> {formatDate(user.lastActive)}
            </p>
          </div>

          {/* Subscription */}
          <div className="space-y-1">
            <h4 className="font-semibold text-gray-700 text-sm">Subscription</h4>
            <p className="text-xs text-gray-700">
              <span className="font-medium">Plan:</span> {user.premium ? 'Premium' : 'Basic'}
            </p>
            {user.premiumSince && (
              <p className="text-xs text-gray-700">
                <span className="font-medium">Since:</span> {formatDate(user.premiumSince)}
              </p>
            )}
            {user.role === 'mentor' && (
              <p className="text-xs text-gray-700">
                <span className="font-medium">Verification:</span>
                <span className={`ml-1 font-medium ${user.verificationStatus === 'verified' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {user.verificationStatus}
                </span>
              </p>
            )}
          </div>

          {/* Mentor Details */}
          {user.role === 'mentor' && (
            <div className="space-y-1">
              <h4 className="font-semibold text-gray-700 text-sm">Mentor Details</h4>
              {user.collegeName && (
                <p className="text-xs text-gray-700 break-words">
                  <span className="font-medium">College:</span> {user.collegeName}
                </p>
              )}
              {user.expertise?.length > 0 && (
                <p className="text-xs text-gray-700 break-words">
                  <span className="font-medium">Expertise:</span> {user.expertise.join(', ')}
                </p>
              )}
            </div>
          )}

          {/* Mentee Interests */}
          {user.role === 'mentee' && user.interests?.length > 0 && (
            <div className="space-y-1">
              <h4 className="font-semibold text-gray-700 text-sm">Interests</h4>
              <p className="text-xs text-gray-700 break-words">{user.interests.join(', ')}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-2">
            <button 
              className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
              onClick={(e) => {
                e.stopPropagation();
                // Handle edit
              }}
            >
              Edit
            </button>
            <button 
              className="text-red-600 hover:text-red-900 text-sm font-medium"
              onClick={(e) => {
                e.stopPropagation();
                // Handle delete
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  ))}
</div>

      {/* Desktop view - table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentUsers.map((user) => (
              <React.Fragment key={user._id}>
                <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => toggleUserDetails(user._id)}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-medium">{user.fullName?.charAt(0) || 'U'}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.fullName || 'Unknown'}</div>
                        <div className="text-xs text-gray-500">Joined: {formatDate(user.createdAt)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                        user.role === 'mentor' ? 'bg-blue-100 text-blue-800' : 
                        'bg-green-100 text-green-800'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full mb-1
                        ${user.premium ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {user.premium ? 'Premium' : 'Basic'}
                      </span>
                      {user.premiumSince && (
                        <span className="text-xs text-gray-500">Since: {formatDate(user.premiumSince)}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle edit
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle delete
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
                
                {/* Expanded details row */}
                {expandedUserId === user._id && (
                  <tr className="bg-gray-50">
                    <td colSpan="6" className="px-6 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-700">Profile Details</h4>
                          <p className="text-sm">
                            <span className="font-medium">Phone:</span> {user.phone || 'Not provided'}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Location:</span> {user.location || 'Not provided'}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Last Active:</span> {formatDate(user.lastActive)}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-700">Subscription Details</h4>
                          <p className="text-sm">
                            <span className="font-medium">Plan:</span> {user.subscriptionPlan || 'Basic'}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Plan Price:</span> ₹{user.subscriptionPlanPrice || 0}
                          </p>
                          {user.role === 'mentor' && (
                            <p className="text-sm">
                              <span className="font-medium">Verification:</span> 
                              <span className={`ml-1 ${user.verificationStatus === 'verified' ? 'text-green-600' : 'text-yellow-600'}`}>
                                {user.verificationStatus}
                              </span>
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-700">Additional Info</h4>
                          {user.role === 'mentor' && (
                            <>
                              <p className="text-sm">
                                <span className="font-medium">College:</span> {user.collegeName}
                              </p>
                              <p className="text-sm">
                                <span className="font-medium">Expertise:</span> {user.expertise?.join(', ') || 'None'}
                              </p>
                            </>
                          )}
                          {user.role === 'mentee' && (
                            <p className="text-sm">
                              <span className="font-medium">Interests:</span> {user.interests?.join(', ') || 'None'}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination controls */}
      {filteredUsers.length > usersPerPage && (
        <div className="flex flex-col md:flex-row items-center justify-between mt-4 px-4 md:px-6 py-3 bg-gray-50">
          <div className="text-sm text-gray-700 mb-2 md:mb-0">
            Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-md text-sm font-medium disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-md text-sm font-medium disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;