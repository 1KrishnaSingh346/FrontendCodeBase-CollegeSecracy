import React, { useEffect, useState } from 'react';
import useAuthStore from '../../store/useAuthStore';
import { formatDate } from '../../utils/formatDate';
import { Dialog, Transition } from '@headlessui/react';
import { FiStar, FiCheck, FiX, FiEdit, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const AdminUsers = () => {
  const { 
    AllUsers, 
    fetchAllUsers, 
    isfetchingUser,
    AllFeedbackList,
    updateFeedBackStatus
  } = useAuthStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [userFeedbacks, setUserFeedbacks] = useState([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);
  const usersPerPage = 10;

  const openModal = async (user) => {
    setSelectedUser(user);
    await loadUserFeedbacks(user._id);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setUserFeedbacks([]);
  };

  const loadUserFeedbacks = async (userId) => {
    setLoadingFeedbacks(true);
    try {
      const feedbacks = await AllFeedbackList(userId);
      setUserFeedbacks(feedbacks);
    } catch (error) {
      toast.error('Failed to load feedbacks');
    } finally {
      setLoadingFeedbacks(false);
    }
  };

  const handleStatusUpdate = async (feedbackId, status) => {
    try {
      await updateFeedBackStatus(feedbackId, { status });
      toast.success(`Feedback marked as ${status}`);
      if (selectedUser) {
        await loadUserFeedbacks(selectedUser._id);
      }
    } catch (error) {
      toast.error('Failed to update feedback status');
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchAllUsers();
      toast.success('User data refreshed');
    } catch (error) {
      toast.error('Failed to refresh data');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  const filteredUsers = AllUsers?.filter(user => 
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Skeleton loading component
  const UserSkeleton = () => (
    <div className="border rounded-lg p-4 shadow-sm bg-white">
      <div className="flex justify-between items-start gap-2">
        <div className="flex items-center min-w-0">
          <Skeleton circle width={40} height={40} />
          <div className="ml-3 min-w-0">
            <Skeleton width={120} height={16} />
            <Skeleton width={80} height={12} className="mt-1" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Skeleton width={60} height={20} />
          <Skeleton width={50} height={20} />
        </div>
      </div>
    </div>
  );

  const TableSkeleton = () => (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {[...Array(5)].map((_, i) => (
          <tr key={i}>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <Skeleton circle width={40} height={40} />
                <div className="ml-4">
                  <Skeleton width={100} height={16} />
                  <Skeleton width={80} height={12} className="mt-1" />
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <Skeleton width={120} height={16} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <Skeleton width={60} height={24} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <Skeleton width={60} height={24} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <Skeleton width={80} height={16} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">User Management</h2>
          <button 
            onClick={handleRefresh}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            disabled={isRefreshing}
          >
            <FiRefreshCw className={`w-5 h-5 text-indigo-600 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
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
      
      {/* Loading State */}
      {(isfetchingUser || isRefreshing) ? (
        <>
          {/* Mobile Skeleton */}
          <div className="md:hidden space-y-4">
            {[...Array(5)].map((_, i) => (
              <UserSkeleton key={i} />
            ))}
          </div>
          {/* Desktop Skeleton */}
          <div className="hidden md:block">
            <TableSkeleton />
          </div>
        </>
      ) : (
        <>
          {/* Mobile view - cards */}
          <div className="md:hidden space-y-4">
            {currentUsers.map((user) => (
              <div 
                key={user._id} 
                className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => openModal(user)}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center min-w-0">
  <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center">
    {user.profilePic?.url ? (
      <img
        src={user.profilePic.url}
        alt={user.fullName || 'User'}
        className="h-full w-full object-cover"
      />
    ) : (
      <span className="text-indigo-600 font-medium text-lg">
        {user.fullName?.charAt(0) || 'U'}
      </span>
    )}
  </div>
  <div className="ml-3 min-w-0">
    <div className="text-sm font-medium text-gray-900 truncate">{user.fullName || 'Unknown'}</div>
    <div className="text-xs text-gray-500 truncate">{user.email || 'No email'}</div>
  </div>
</div>

                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full
                      ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                        user.role === 'mentor' ? 'bg-blue-100 text-blue-800' : 
                        'bg-green-100 text-green-800'}`}>
                      {user.role === 'mentee' ? 'Student' : user.role}
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full
                      ${user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop view - table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => openModal(user)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
  <div className="flex items-center">
    <div className="h-10 w-10 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center">
      {user.profilePic?.url ? (
        <img
          src={user.profilePic.url}
          alt={user.fullName || 'User'}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="text-indigo-600 font-medium">
          {user.fullName?.charAt(0) || 'U'}
        </span>
      )}
    </div>
    <div className="ml-4">
      <div className="text-sm font-medium text-gray-900">{user.fullName || 'Unknown'}</div>
      <div className="text-xs text-gray-500">{user.phone || 'No phone'}</div>
    </div>
  </div>
</td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="truncate max-w-xs">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs font-semibold rounded-full 
                        ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                          user.role === 'mentor' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'}`}>
                       {user.role === 'mentee' ? 'Student' : user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs font-semibold rounded-full 
                        ${user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {user.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      
      {/* User Details Modal */}
      <Transition appear show={!!selectedUser} as={React.Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md md:max-w-2xl transform overflow-hidden rounded-2xl bg-white p-4 md:p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-between items-start border-b pb-3">
                    <Dialog.Title as="h3" className="text-lg md:text-xl font-semibold text-gray-900">
                      {selectedUser?.fullName} - User Details
                    </Dialog.Title>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500"
                      onClick={closeModal}
                    >
                      <span className="sr-only">Close</span>
                      <FiX className="h-5 w-5 md:h-6 md:w-6" />
                    </button>
                  </div>

                  <div className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto scrollbar-hide">
                    {/* Basic Info Section */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h3 className="text-base font-medium text-gray-900 mb-2">Basic Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs md:text-sm font-medium text-gray-500">Email</p>
                          <p className="text-xs md:text-sm text-gray-900 mt-1">{selectedUser?.email}</p>
                        </div>
                        <div>
                          <p className="text-xs md:text-sm font-medium text-gray-500">Phone</p>
                          <p className="text-xs md:text-sm text-gray-900 mt-1">{selectedUser?.phone || 'Not provided'}</p>
                        </div>
                        <div>
                          <p className="text-xs md:text-sm font-medium text-gray-500">Location</p>
                          <p className="text-xs md:text-sm text-gray-900 mt-1">{selectedUser?.location || 'Not provided'}</p>
                        </div>
                        <div>
                          <p className="text-xs md:text-sm font-medium text-gray-500">Date of Birth</p>
                          <p className="text-xs md:text-sm text-gray-900 mt-1">
                            {selectedUser?.dateOfBirth ? formatDate(selectedUser.dateOfBirth) : 'Not provided'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Account Info Section */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h3 className="text-base font-medium text-gray-900 mb-2">Account Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs md:text-sm font-medium text-gray-500">Role</p>
                          <p className="text-xs md:text-sm text-gray-900 mt-1 capitalize">{selectedUser?.role}</p>
                        </div>
                        <div>
                          <p className="text-xs md:text-sm font-medium text-gray-500">Status</p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1
                            ${selectedUser?.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {selectedUser?.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs md:text-sm font-medium text-gray-500">Joined On</p>
                          <p className="text-xs md:text-sm text-gray-900 mt-1">{formatDate(selectedUser?.createdAt)}</p>
                        </div>
                        <div>
                          <p className="text-xs md:text-sm font-medium text-gray-500">Last Active</p>
                          <p className="text-xs md:text-sm text-gray-900 mt-1">{formatDate(selectedUser?.lastActive)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Counseling Plans Section */}
                    {selectedUser?.role !== 'admin' && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h3 className="text-base font-medium text-gray-900 mb-2">Counseling Plans</h3>
                        {selectedUser?.counselingPlans?.length > 0 ? (
                          <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-hide">
                            {selectedUser.counselingPlans.map((plan, index) => (
                              <div key={index} className="border p-2 rounded bg-white">
                                <div className="flex justify-between">
                                  <p className="text-xs md:text-sm font-medium text-gray-900">{plan.planName}</p>
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                                    ${plan.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {plan.active ? 'Active' : 'Inactive'}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  Purchased: {formatDate(plan.purchasedOn)}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs md:text-sm text-gray-500">No counseling plans purchased</p>
                        )}
                      </div>
                    )}

                    {/* Premium Tools Section */}
                    {selectedUser?.role !== 'admin' && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h3 className="text-base font-medium text-gray-900 mb-2">Premium Tools</h3>
                        {selectedUser?.premiumTools?.length > 0 ? (
                          <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-hide">
                            {selectedUser.premiumTools.map((tool, index) => (
                              <div key={index} className="border p-2 rounded bg-white">
                                <div className="flex justify-between">
                                  <p className="text-xs md:text-sm font-medium text-gray-900">{tool.toolName}</p>
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                                    ${tool.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {tool.active ? 'Active' : 'Inactive'}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  Purchased: {formatDate(tool.purchasedOn)}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs md:text-sm text-gray-500">No premium tools purchased</p>
                        )}
                      </div>
                    )}

                    {/* User Feedback Section */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h3 className="text-base font-medium text-gray-900 mb-2">User Feedback</h3>
                      {loadingFeedbacks ? (
                        <div className="flex justify-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
                        </div>
                      ) : userFeedbacks.length > 0 ? (
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-1 scrollbar-hide">
                          {userFeedbacks.map((feedback) => (
                            <div key={feedback._id} className="border p-3 rounded bg-white">
                              <div className="flex justify-between items-start">
                                <div className="flex items-center">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <FiStar
                                      key={star}
                                      className={`h-4 w-4 ${feedback.starRating >= star 
                                        ? 'text-yellow-500 fill-current' 
                                        : 'text-gray-300'}`}
                                    />
                                  ))}
                                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                                    {feedback.category}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-500">
                                  {formatDate(feedback.createdAt)}
                                </span>
                              </div>
                              <p className="text-xs md:text-sm text-gray-700 mt-2">{feedback.message}</p>
                              <div className="flex justify-between items-center mt-2">
                                <span className={`text-xs font-medium ${
                                  feedback.status === 'approved' ? 'text-green-600' :
                                  feedback.status === 'rejected' ? 'text-red-600' :
                                  'text-yellow-600'
                                }`}>
                                  {feedback.status}
                                </span>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleStatusUpdate(feedback._id, 'approved')}
                                    className="text-green-600 hover:text-green-800 text-xs flex items-center"
                                  >
                                    <FiCheck className="mr-1" /> Approve
                                  </button>
                                  <button
                                    onClick={() => handleStatusUpdate(feedback._id, 'rejected')}
                                    className="text-red-600 hover:text-red-800 text-xs flex items-center"
                                  >
                                    <FiX className="mr-1" /> Reject
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs md:text-sm text-gray-500">No feedback submitted</p>
                      )}
                    </div>

                    {/* Role Specific Information */}
                    {selectedUser?.role === 'mentor' && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h3 className="text-base font-medium text-gray-900 mb-2">Mentor Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs md:text-sm font-medium text-gray-500">College</p>
                            <p className="text-xs md:text-sm text-gray-900 mt-1">{selectedUser?.collegeName || 'Not provided'}</p>
                          </div>
                          <div>
                            <p className="text-xs md:text-sm font-medium text-gray-500">College ID</p>
                            <p className="text-xs md:text-sm text-gray-900 mt-1">{selectedUser?.collegeId || 'Not provided'}</p>
                          </div>
                          <div>
                            <p className="text-xs md:text-sm font-medium text-gray-500">Expertise</p>
                            <p className="text-xs md:text-sm text-gray-900 mt-1">
                              {selectedUser?.expertise?.join(', ') || 'None specified'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs md:text-sm font-medium text-gray-500">Verification Status</p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1
                              ${selectedUser?.verificationStatus === 'verified' ? 'bg-green-100 text-green-800' : 
                                selectedUser?.verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'}`}>
                              {selectedUser?.verificationStatus || 'Not verified'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedUser?.role === 'mentee' && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h3 className="text-base font-medium text-gray-900 mb-2">Student Information</h3>
                        <div>
                          <p className="text-xs md:text-sm font-medium text-gray-500">Interests</p>
                          <p className="text-xs md:text-sm text-gray-900 mt-1">
                            {selectedUser?.interests?.join(', ') || 'None specified'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        // Handle edit user
                      }}
                      className="px-3 py-1 md:px-4 md:py-2 border border-gray-300 rounded-md shadow-sm text-xs md:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    >
                      <FiEdit className="inline mr-1 md:mr-2" /> Edit
                    </button>
                    <button
                      onClick={() => {
                        // Handle delete user
                      }}
                      className="px-3 py-1 md:px-4 md:py-2 border border-transparent rounded-md shadow-sm text-xs md:text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                    >
                      <FiTrash2 className="inline mr-1 md:mr-2" /> Delete
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      
      {/* Pagination controls */}
      {filteredUsers.length > usersPerPage && (
        <div className="flex flex-col md:flex-row items-center justify-between mt-4 px-4 md:px-6 py-3 bg-gray-50 rounded-b-lg">
          <div className="text-xs md:text-sm text-gray-700 mb-2 md:mb-0">
            Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-2 py-1 md:px-3 md:py-1 border rounded-md text-xs md:text-sm font-medium disabled:opacity-50 hover:bg-gray-100"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-2 py-1 md:px-3 md:py-1 border rounded-md text-xs md:text-sm font-medium disabled:opacity-50 hover:bg-gray-100"
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