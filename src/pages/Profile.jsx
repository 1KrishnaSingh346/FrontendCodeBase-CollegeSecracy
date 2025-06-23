import { useState, useEffect } from "react";
import { 
  Camera, User, Mail, Phone, MapPin, 
  Shield, Clock, Edit, Save, X, ChevronLeft, 
  Star, Loader, Sun, Moon, Check, XCircle, Trash2,
  LogOut, Settings, Eye, Lock, AlertTriangle, HelpCircle,
  ChevronDown, ChevronUp, Package, Calendar,
  BadgeCheck, CheckCircle, Pencil
} from "lucide-react";
import { FaTools } from 'react-icons/fa'; 
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";
import avatar from "../assets/avatar.webp";
import imageCompression from "browser-image-compression";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import TrackPlansAndTools from "./StudentPages/Components/TrackPlansAndTools";
import AccountActionModal from "./StudentPages/Components/accountActionModal";

const Profile = () => {
  const { user, logout, updateProfile, uploadProfilePic, loadUser,deleteAccount, deactivateAccount, userLogs, getMyLogs, initialAuthCheckComplete, isAuthenticated, removeProfilePicAPI } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    fullName: "",
    bio: "",
    profilePic: "",
    phone: "",
    location: "",
    dateOfBirth: null
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateAction, setUpdateAction] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) return JSON.parse(savedMode);
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [imagePreview, setImagePreview] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [errors, setErrors] = useState({});
  const [showAllPlans, setShowAllPlans] = useState(false);
  const [showAllTools, setShowAllTools] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [logsLoading, setLogsLoading] = useState(true);
  const [isEditingProfilePic, setIsEditingProfilePic] = useState(false);
  const [modalType, setModalType] = useState(null); // 'deactivate' or 'delete'
  const navigate = useNavigate();

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    if (initialAuthCheckComplete && isAuthenticated && !user) {
      loadUser();
    }
  }, [initialAuthCheckComplete, isAuthenticated, user]);

  useEffect(() => {
    if (user) {
      setEditedUser({
        fullName: user.fullName || "",
        bio: user.bio || "",
        profilePic: user.profilePic?.url || "",
        phone: user.phone || "",
        location: user.location || "",
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : null
      });
    }
  }, [user]);

useEffect(() => {
  const fetchLogs = async () => {
    setLogsLoading(true);
    await getMyLogs();
    setLogsLoading(false);
  };

  fetchLogs();
}, []);

 const handleAccountAction = async ({ type, reason, password }) => {
    try {
      toast.loading(type === 'delete' ? 'Deleting account...' : 'Deactivating account...');
      if (type === 'delete') {
        await deleteAccount(password);
        await logout();
        toast.success('Account permanently deleted.');
      } else {
        await deactivateAccount(reason);
        await logout();
        toast.success('Account deactivated. You can log back in anytime.');
      }
    } catch (err) {
      toast.error(err.message || 'Something went wrong.');
    } finally {
      toast.dismiss();
      setModalType(null);
    }
  };

  const options = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1024,
  useWebWorker: true,
};

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    try {
      setUpdateAction("upload");
      setIsUpdating(true);
      const compressedFile = await imageCompression(file, options);

      const formData = new FormData();
      formData.append("profilePic", compressedFile);

      const uploadedPic = await uploadProfilePic(formData);
      setEditedUser(prev => ({ ...prev, profilePic: uploadedPic?.url || "" }));
      toast.success("Profile picture updated!");
    } catch (err) {
      toast.error("Image upload failed");
      console.error("Upload error:", err);
    } finally {
      setIsUpdating(false);
      setUpdateAction("");
      setIsEditingProfilePic(false);
    }
  };

  const removeProfilePic = async () => {
    try {
      setUpdateAction("remove");
      setIsUpdating(true);
      await removeProfilePicAPI();
      setEditedUser(prev => ({ ...prev, profilePic: "" }));
      toast.success("Profile picture removed");
    } catch (err) {
      toast.error("Failed to remove profile picture");
    } finally {
      setIsUpdating(false);
      setUpdateAction("");
      setIsEditingProfilePic(false);
    }
  };

  const validateFields = () => {
    const newErrors = {};
    const trimmedName = editedUser.fullName?.trim();
    const trimmedPhone = editedUser.phone?.trim();

    if (!trimmedName) {
      newErrors.fullName = "Full name is required";
    } else if (trimmedName.length > 50) {
      newErrors.fullName = "Name too long (max 50 chars)";
    }

    if (trimmedPhone && !/^[6-9]\d{9}$/.test(trimmedPhone)) {
      newErrors.phone = "Invalid Indian phone number";
    }

    if (editedUser.bio?.length > 150) {
      newErrors.bio = "Bio too long (max 150 chars)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateFields()) return;

    try {
      setIsUpdating(true);

      const payload = {
        fullName: editedUser.fullName.trim(),
        bio: editedUser.bio?.trim() || null,
        phone: editedUser.phone?.trim() || null,
        location: editedUser.location?.trim() || null,
        dateOfBirth: editedUser.dateOfBirth
          ? new Date(editedUser.dateOfBirth).toISOString()
          : null,
      };

      await updateProfile(payload);

      setIsEditing(false);
      toast.success("Profile updated successfully!", {
        position: "top-center",
        icon: <Check className="text-green-500" />,
        style: {
          background: darkMode ? '#1f2937' : '#fff',
          color: darkMode ? '#fff' : '#000',
        },
      });
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Failed to update profile", {
        position: "top-center",
        icon: <XCircle className="text-red-500" />,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleDateChange = (e) => {
    setEditedUser(prev => ({
      ...prev,
      dateOfBirth: e.target.value ? new Date(e.target.value) : null
    }));
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const goBack = () => navigate(-1);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (!user) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="rounded-xl shadow-xl overflow-hidden bg-white dark:bg-gray-800">
          <div className="h-40 bg-gray-200 dark:bg-gray-700 relative">
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <Skeleton circle width={128} height={128} className="border-4 border-white dark:border-gray-800" />
            </div>
          </div>

          <div className="pt-20 pb-8 px-4 sm:px-6">
            <div className="text-center mb-8">
              <Skeleton width={200} height={28} className="mx-auto mb-2" />
              <Skeleton width={300} height={20} className="mx-auto" />
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                <Skeleton width={180} height={24} className="mb-4" />
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <Skeleton circle width={20} height={20} />
                      <div className="flex-1">
                        <Skeleton width={80} height={16} className="mb-1" />
                        <Skeleton width={200} height={20} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      {/* Image preview modal */}
      {imagePreview && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md flex justify-between items-center mb-4">
            <h3 className="text-white text-lg sm:text-xl font-semibold">Profile Photo</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsEditingProfilePic((prev) => !prev)}
                className="p-2 text-gray-300 hover:text-white rounded-full transition"
              >
                <Pencil size={20} />
              </button>
              <button
                onClick={() => {
                  setImagePreview(false);
                  setIsEditingProfilePic(false);
                }}
                className="p-2 text-gray-300 hover:text-white rounded-full transition"
              >
                <X size={22} />
              </button>
            </div>
          </div>

          <div className="w-full max-w-md relative flex items-center justify-center">
            {isUpdating && (
              <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center space-y-2 transition-opacity duration-300">
                <Loader size={28} className="text-white animate-spin" />
                <span className="text-white text-sm tracking-wide">
                  {updateAction === "remove" ? "Removing..." : "Uploading..."}
                </span>
              </div>
            )}

            <img
              src={editedUser.profilePic || avatar}
              alt="Profile"
              className={`max-h-[60vh] w-auto rounded-lg object-contain transition duration-300 ease-in-out ${
                isUpdating ? 'opacity-40' : ''
              }`}
            />
          </div>

          {isEditingProfilePic && (
            <div className="mt-6 w-full max-w-md flex flex-col sm:flex-row gap-4">
              <label
                className={`flex-1 cursor-pointer py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition
                  ${
                    isUpdating
                      ? 'bg-white/5 text-white/60 cursor-not-allowed'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
              >
                <Camera size={18} />
                <span>Change Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdating}
                  className="hidden"
                />
              </label>

              {editedUser.profilePic && (
                <button
                  onClick={removeProfilePic}
                  disabled={isUpdating}
                  className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition
                    ${
                      isUpdating
                        ? 'bg-red-400 cursor-not-allowed text-white/70'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                >
                  {isUpdating && updateAction === "remove" ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      <span>Removing...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 size={18} />
                      <span>Remove</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Item Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedItem.name}
                </h3>
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-gray-600 dark:text-gray-300">{selectedItem.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {'price' in selectedItem && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                      <p className="text-gray-700 dark:text-gray-300 font-medium">{selectedItem.price}</p>
                    </div>
                  )}

                  {'purchasedDate' in selectedItem && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Purchased On</p>
                      <p className="text-gray-700 dark:text-gray-300">{formatDate(selectedItem.purchasedDate)}</p>
                    </div>
                  )}

                  {'expiryDate' in selectedItem && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Expiry Date</p>
                      <p className="text-gray-700 dark:text-gray-300">{selectedItem.expiryDate}</p>
                    </div>
                  )}

                  {'status' in selectedItem && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                      <p className={`font-medium ${
                        selectedItem.status === 'Active' 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-orange-600 dark:text-orange-400'
                      }`}>
                        {selectedItem.status}
                      </p>
                    </div>
                  )}

                  {'accessLevel' in selectedItem && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Access Level</p>
                      <p className="text-gray-700 dark:text-gray-300">{selectedItem.accessLevel}</p>
                    </div>
                  )}

                  {'lastUsed' in selectedItem && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Last Used</p>
                      <p className="text-gray-700 dark:text-gray-300">{formatDate(selectedItem.lastUsed)}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-orange-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <header className="sticky top-0 z-10 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button 
                onClick={goBack}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <ChevronLeft size={20} />
                <span className="hidden sm:inline">Back</span>
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="rounded-xl shadow-xl overflow-hidden bg-white dark:bg-gray-800 transition-all duration-300 border border-gray-200 dark:border-gray-700">
            {/* Cover Photo */}
            <div className="relative">
              <div className="h-40 bg-gradient-to-r from-blue-600 to-orange-500 dark:from-gray-800 dark:to-gray-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute bottom-0 w-full h-12 bg-white dark:bg-gray-800 clip-path-wave"></div>
              </div>

              {/* Profile Picture + Edit Button */}
              <div className="relative mt-[-4rem] mb-6 flex flex-col items-center justify-center">
                <div className="relative">
                  <img
                    src={editedUser.profilePic || avatar}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-lg"
                    onClick={() => setImagePreview(true)}
                  />
                  <button
                    onClick={() => {
                      setImagePreview(true);
                      setIsEditingProfilePic(true);
                    }}
                    className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-1 text-sm font-semibold text-white bg-blue-600/80 hover:bg-blue-600/95 rounded-full backdrop-blur-md shadow"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="pt-20 pb-8 px-4 sm:px-6">
              {/* Name and Bio Section */}
              <div className="text-center mb-8">
                {isEditing ? (
                  <div className="space-y-4 max-w-md mx-auto">
                    {/* Full Name */}
                    <div>
                      <input
                        type="text"
                        name="fullName"
                        value={editedUser.fullName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center font-bold text-lg"
                        placeholder="Full Name"
                        disabled={isUpdating}
                        maxLength={50}
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
                      )}
                    </div>

                    {/* Bio */}
                    <div>
                      <textarea
                        name="bio"
                        value={editedUser.bio}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-base"
                        placeholder="Tell us about yourself"
                        rows="2"
                        disabled={isUpdating}
                        maxLength={150}
                      />
                      <div className="flex justify-between mt-1">
                        {errors.bio ? (
                          <p className="text-sm text-red-500">{errors.bio}</p>
                        ) : (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {editedUser.bio.length}/150
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {editedUser.fullName}
                    </h1>
                    {editedUser.bio && (
                      <p className="mt-2 text-gray-600 dark:text-gray-400 text-base max-w-2xl mx-auto">
                        {editedUser.bio}
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Profile Sections */}
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Personal Info Section */}
                <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 relative">
                  <div className="absolute top-4 right-4">
                    {isEditing ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setErrors({});
                          }}
                          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                          disabled={isUpdating}
                        >
                          <X size={18} />
                        </button>
                        <button
                          onClick={handleSaveProfile}
                          disabled={isUpdating}
                          className="p-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 flex items-center"
                        >
                          {isUpdating ? (
                            <Loader className="animate-spin" size={18} />
                          ) : (
                            <Save size={18} />
                          )}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                      >
                        <Edit size={18} />
                      </button>
                    )}
                  </div>

                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <User className="text-blue-500" size={20} />
                    Personal Information
                  </h2>
                  
                  <div className="space-y-4">
                    {/* Email (non-editable) */}
                    <div className="flex items-start gap-4">
                      <Mail className="text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" size={20} />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                        <p className="text-gray-700 dark:text-gray-300 text-base">{user.email}</p>
                      </div>
                    </div>

                    {/* Phone */}
                    {isEditing ? (
                      <div className="flex items-start gap-4">
                        <Phone className="text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" size={20} />
                        <div className="flex-1">
                          <label className="text-sm text-gray-500 dark:text-gray-400">Phone</label>
                          <input
                            type="tel"
                            name="phone"
                            value={editedUser.phone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-base rounded border bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="+91 9876543210"
                            disabled={isUpdating}
                            maxLength={10}
                          />
                          {errors.phone && (
                            <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                          )}
                        </div>
                      </div>
                    ) : editedUser.phone && (
                      <div className="flex items-start gap-4">
                        <Phone className="text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" size={20} />
                        <div className="flex-1">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                          <p className="text-gray-700 dark:text-gray-300 text-base">
                            +91 {editedUser.phone}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Location */}
                    {isEditing ? (
                      <div className="flex items-start gap-4">
                        <MapPin className="text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" size={20} />
                        <div className="flex-1">
                          <label className="text-sm text-gray-500 dark:text-gray-400">Location</label>
                          <input
                            type="text"
                            name="location"
                            value={editedUser.location}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-base rounded border bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="City, Country"
                            disabled={isUpdating}
                          />
                        </div>
                      </div>
                    ) : editedUser.location && (
                      <div className="flex items-start gap-4">
                        <MapPin className="text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" size={20} />
                        <div className="flex-1">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                          <p className="text-gray-700 dark:text-gray-300 text-base">{editedUser.location}</p>
                        </div>
                      </div>
                    )}

                    {/* Date of Birth */}
                    {isEditing ? (
                      <div className="flex items-start gap-4">
                        <Calendar className="text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" size={20} />
                        <div className="flex-1">
                          <label className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</label>
                          <input
                            type="date"
                            name="dateOfBirth"
                            value={editedUser.dateOfBirth ? editedUser.dateOfBirth.toISOString().split('T')[0] : ''}
                            onChange={handleDateChange}
                            className="w-full px-3 py-2 text-base rounded border bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            max={new Date().toISOString().split('T')[0]}
                            disabled={isUpdating}
                          />
                        </div>
                      </div>
                    ) : editedUser.dateOfBirth && (
                      <div className="flex items-start gap-4">
                        <Calendar className="text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" size={20} />
                        <div className="flex-1">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                          <p className="text-gray-700 dark:text-gray-300 text-base">
                            {new Date(editedUser.dateOfBirth).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Track Your Plans and Tools Section */}
                <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Track Your Plans and Tools
                    <TrackPlansAndTools user={user} />
                  </h2>
                </div>

                {/* Account Information Section */}
                <div className="p-6 rounded-2xl bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                    <Shield className="text-blue-600 dark:text-blue-400" size={22} />
                    Account Overview
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm sm:text-base">
                    {/* Member Since */}
                    <div className="flex items-start gap-4">
                      <Calendar className="text-blue-500 dark:text-blue-300 mt-0.5 flex-shrink-0" size={20} />
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Member Since</p>
                        <p className="text-gray-800 dark:text-gray-200 font-medium">
                          {new Date(user.createdAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Account Type */}
                    <div className="flex items-start gap-4">
                      <BadgeCheck className="text-blue-500 dark:text-blue-300 mt-0.5 flex-shrink-0" size={20} />
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Account Type</p>
                        <p className="text-gray-800 dark:text-gray-200 font-medium">{user.role === "mentee" && "Student"} </p>
                      </div>
                    </div>

                    {/* Last Active */}
                    <div className="flex items-start gap-4">
                      <Clock className="text-blue-500 dark:text-blue-300 mt-0.5 flex-shrink-0" size={20} />
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Last Active</p>
                        <p className="text-gray-800 dark:text-gray-200 font-medium">
                          {new Date(user.lastActive).toLocaleString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Account Status */}
                    <div className="flex items-start gap-4">
                      <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={20} />
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Status</p>
                        <p className="text-green-600 dark:text-green-400 font-medium">{user.active && "Active"}</p>
                      </div>
                    </div>

                    {/* Role */}
                    <div className="flex items-start gap-4">
                      <User className="text-blue-500 dark:text-blue-300 mt-0.5 flex-shrink-0" size={20} />
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Role</p>
                        <p className="text-gray-800 dark:text-gray-200 font-medium">{user.role === "mentee" && "Student"}</p>
                      </div>
                    </div>
                  </div>
                </div>

               {/* Advanced Settings Section */}
                <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <button 
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <h2 className="text-sm md:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <Settings className="text-blue-500" size={22} />
                      Advanced Settings
                    </h2>
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {showAdvanced ? 'Hide' : 'Show'}
                    </span>
                  </button>

                  {showAdvanced && (
                    <div className="mt-6 space-y-6">
                      {/* Account Security */}
                      <div className="p-5 rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-inner">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <Lock size={20} className="text-blue-500" />
                          Account Security
                        </h3>
                        <div className="space-y-2">
                          <button className="w-full text-left py-2 px-4 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
                            Change Password
                          </button>
                          <button className="w-full text-left py-2 px-4 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
                            Two-Factor Authentication
                          </button>
                          <button className="w-full text-left py-2 px-4 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
                            Connected Devices
                          </button>
                        </div>
                      </div>

                      {/* Account Actions */}
                      <div className="p-5 rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-inner">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <AlertTriangle size={20} className="text-orange-500" />
                          Account Actions
                        </h3>
                        <div className="space-y-2">
                          <button
                           onClick={() => setModalType('deactivate')}
                           className="w-full text-left py-2 px-4 rounded-md text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors text-sm font-medium">
                            Deactivate Account
                          </button>
                          <button
                          onClick={() => setModalType('delete')}
                           className="w-full text-left py-2 px-4 rounded-md text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-sm font-medium">
                            Delete Account
                          </button>
                        </div>
                      </div>
                      {/* Activity Logs */}
<div className="p-5 rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-inner">
  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
    <Clock size={20} className="text-yellow-500" />
    Activity Logs
  </h3>

  {logsLoading ? (
  <div className="space-y-3">
    {[...Array(1)].map((_, i) => (
      <div key={i} className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-lg">
        <Skeleton height={14} width="60%" baseColor="#ccc" highlightColor="#ddd" />
        <Skeleton height={12} width="40%" className="mt-2" />
        <Skeleton height={10} width="30%" className="mt-1" />
      </div>
    ))}
  </div>
) : userLogs?.length === 0 ? (
  <p className="text-sm text-gray-400">You haven't performed any actions yet.</p>
) : (
  <div className="max-h-64 overflow-y-auto pr-2 space-y-3">
    {userLogs.map((log) => (
      <div
        key={log._id}
        className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-lg shadow-sm"
      >
        <div className="flex justify-between items-center text-sm font-medium text-blue-600 dark:text-blue-400">
          <span>{log.action}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(log.timestamp).toLocaleString()}
          </span>
        </div>

        {log.reason && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            <span className="mr-1">📝</span>{log.reason}
          </p>
        )}
      </div>
    ))}
  </div>
)}

</div>


                      {/* Logout Section */}
                      <div className="p-5 rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-inner">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <LogOut size={20} className="text-red-500" />
                          Session
                        </h3>
                        <button 
                          onClick={handleLogout}
                          className="w-full text-left py-2 px-4 rounded-md text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-sm font-medium flex items-center gap-2"
                        >
                          {/* <LogOut size={16} /> */}
                          Logout
                        </button>
                        {modalType && (
                        <AccountActionModal
                        type={modalType}
                        onClose={() => setModalType(null)}
                        onConfirm={handleAccountAction}
                        />
                        )}

                      </div>

                      {/* Help & Support */}
                      <div className="p-5 rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-inner">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <HelpCircle size={20} className="text-blue-500" />
                          Help & Support
                        </h3>
                        <div className="space-y-2">
                          <Link to="/contact">
                          <button className="w-full text-left py-2 px-4 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
                            Contact Support
                          </button>
                          </Link>
                          <Link to="/privacy">
                          <button className="w-full text-left py-2 px-4 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
                            Privacy Policy
                          </button>
                          </Link>
                          <Link to="/terms">
                          <button className="w-full text-left py-2 px-4 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
                            Terms of Service
                          </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style>{`
        .clip-path-wave {
          clip-path: ellipse(100% 100% at 50% 100%);
        }
      `}</style>
    </div>
  );
};

export default Profile;