import { useState, useEffect } from "react";
import { 
  Camera, User, Mail, Phone, MapPin, Calendar, 
  Shield, Clock, Edit, Save, X, ChevronLeft, 
  Star, Loader, Sun, Moon 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";
import avatar from "../assets/avatar.png";
import imageCompression from "browser-image-compression";

const Profile = () => {
  const { user, logout, updateProfile } = useAuthStore();
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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [darkMode, setDarkMode] = useState(() => {
    // Check local storage or prefer-color-scheme for initial value
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) return JSON.parse(savedMode);
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const navigate = useNavigate();

  // Toggle dark mode and save to localStorage
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
  };

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Initialize user data
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

  // Compress and convert image to base64
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUpdating(true);
      setUploadProgress(0);

      // Validate image type
      if (!file.type.match('image.*')) {
        throw new Error('Please select an image file');
      }

      // Compress image
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
        onProgress: (percentage) => setUploadProgress(percentage)
      };
      
      const compressedFile = await imageCompression(file, options);
      const base64Image = await convertToBase64(compressedFile);
      
      // Update local state immediately for better UX
      setEditedUser(prev => ({ ...prev, profilePic: base64Image }));
      
      // Create FormData and update profile
      const formData = new FormData();
      formData.append('profilePic', base64Image);
      
      await updateProfile(formData);
    } catch (error) {
      console.error("Upload error:", error);
      // Revert to previous image if upload fails
      setEditedUser(prev => ({ ...prev, profilePic: user.profilePic?.url || "" }));
    } finally {
      setIsUpdating(false);
      setUploadProgress(0);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e) => {
    setEditedUser(prev => ({
      ...prev,
      dateOfBirth: e.target.value ? new Date(e.target.value) : null
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setIsUpdating(true);
      const formData = new FormData();
      
      // Append all fields to formData
      formData.append('fullName', editedUser.fullName);
      formData.append('bio', editedUser.bio);
      formData.append('phone', editedUser.phone);
      formData.append('location', editedUser.location);
      
      if (editedUser.dateOfBirth) {
        formData.append('dateOfBirth', editedUser.dateOfBirth.toISOString());
      }
      
      // Only include profilePic if it's a new image (base64 string)
      if (editedUser.profilePic && editedUser.profilePic !== user.profilePic?.url) {
        formData.append('profilePic', editedUser.profilePic);
      }
      
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const goBack = () => navigate(-1);

  if (!user) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Loader className="animate-spin text-blue-500 dark:text-blue-400" size={32} />
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
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

              <div className="flex items-center gap-4">
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                  aria-label="Logout"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="rounded-xl shadow-xl overflow-hidden bg-white dark:bg-gray-800 transition-all duration-300">
            {/* Cover Photo */}
            <div className="relative">
              <div className="h-32 md:h-40 bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-gray-700 dark:to-gray-800">
                <svg className="w-full h-full text-indigo-400/20 dark:text-gray-600/30" viewBox="0 0 1440 320" preserveAspectRatio="none">
                  <path fill="currentColor" d="M0,256L48,261.3C96,267,192,277,288,266.7C384,256,480,224,576,218.7C672,213,768,235,864,250.7C960,267,1056,277,1152,256C1248,235,1344,181,1392,154.7L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
                </svg>
              </div>

              {/* Profile Picture */}
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                <div className="relative">
                  <img
                    src={editedUser.profilePic || avatar}
                    alt="Profile"
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-lg"
                  />
                  {isEditing && (
                    <>
                      <label className="absolute -bottom-2 -right-2 p-2 rounded-full cursor-pointer bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-md">
                        <Camera className="w-4 h-4 md:w-5 md:h-5 text-white" />
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*" 
                          onChange={handleImageUpload}
                          disabled={isUpdating}
                        />
                      </label>
                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="absolute -top-2 -left-2 w-24 h-24 md:w-32 md:h-32 rounded-full bg-black bg-opacity-50 flex items-center justify-center">
                          <div className="text-white text-xs font-bold">
                            {Math.round(uploadProgress)}%
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="pt-20 pb-8 px-4 sm:px-6">
              {/* Name and Title */}
              <div className="text-center mb-6 md:mb-8 relative">
                {user.premium && !isEditing && (
                  <div className="absolute -top-6 md:-top-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-400 to-amber-600 text-white px-3 py-1 rounded-full text-xs md:text-sm font-bold flex items-center gap-1 shadow-lg">
                    <Star className="w-3 h-3 md:w-4 md:h-4 fill-amber-100" />
                    <span>Premium</span>
                  </div>
                )}
                
                {isEditing ? (
                  <div className="space-y-3 max-w-md mx-auto">
                    <input
                      type="text"
                      name="fullName"
                      value={editedUser.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center font-bold text-lg"
                      placeholder="Full Name"
                      disabled={isUpdating}
                    />
                    <textarea
                      name="bio"
                      value={editedUser.bio}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center text-sm md:text-base"
                      placeholder="Tell us about yourself"
                      rows="2"
                      disabled={isUpdating}
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{editedUser.fullName}</h1>
                    {editedUser.bio && <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm md:text-base max-w-2xl mx-auto">{editedUser.bio}</p>}
                    {!user.premium && (
                      <div className="mt-2 inline-block bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs md:text-sm">
                        Basic Account
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Profile Sections */}
              <div className="max-w-2xl mx-auto space-y-4 md:space-y-6">
                {/* Personal Info Section */}
                <div className="p-4 md:p-6 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 relative">
                  <div className="absolute top-3 right-3 md:top-4 md:right-4">
                    {isEditing ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setIsEditing(false)}
                          className="p-1 md:p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                          disabled={isUpdating}
                        >
                          <X size={18} />
                        </button>
                        <button
                          onClick={handleSaveProfile}
                          disabled={isUpdating}
                          className="p-1 md:p-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 flex items-center"
                        >
                          {isUpdating ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="p-1 md:p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                      >
                        <Edit size={18} />
                      </button>
                    )}
                  </div>

                  <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-3 md:mb-4 flex items-center gap-2">
                    <User className="text-indigo-500" size={18} />
                    Personal Information
                  </h2>
                  
                  <div className="space-y-3 md:space-y-4">
                    {/* Email (non-editable) */}
                    <div className="flex items-start gap-3 md:gap-4">
                      <Mail className="text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" size={18} />
                      <div className="flex-1">
                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Email</p>
                        <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base">{user.email}</p>
                      </div>
                    </div>

                    {/* Phone */}
                    {isEditing ? (
                      <div className="flex items-start gap-3 md:gap-4">
                        <Phone className="text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" size={18} />
                        <div className="flex-1">
                          <label className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Phone</label>
                          <input
                            type="tel"
                            name="phone"
                            value={editedUser.phone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-1 text-sm md:text-base rounded border bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="+1234567890"
                            disabled={isUpdating}
                          />
                        </div>
                      </div>
                    ) : editedUser.phone && (
                      <div className="flex items-start gap-3 md:gap-4">
                        <Phone className="text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" size={18} />
                        <div className="flex-1">
                          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Phone</p>
                          <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base">{editedUser.phone}</p>
                        </div>
                      </div>
                    )}

                    {/* Location */}
                    {isEditing ? (
                      <div className="flex items-start gap-3 md:gap-4">
                        <MapPin className="text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" size={18} />
                        <div className="flex-1">
                          <label className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Location</label>
                          <input
                            type="text"
                            name="location"
                            value={editedUser.location}
                            onChange={handleInputChange}
                            className="w-full px-3 py-1 text-sm md:text-base rounded border bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="City, Country"
                            disabled={isUpdating}
                          />
                        </div>
                      </div>
                    ) : editedUser.location && (
                      <div className="flex items-start gap-3 md:gap-4">
                        <MapPin className="text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" size={18} />
                        <div className="flex-1">
                          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Location</p>
                          <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base">{editedUser.location}</p>
                        </div>
                      </div>
                    )}

                    {/* Date of Birth */}
                    {isEditing ? (
                      <div className="flex items-start gap-3 md:gap-4">
                        <Calendar className="text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" size={18} />
                        <div className="flex-1">
                          <label className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Date of Birth</label>
                          <input
                            type="date"
                            name="dateOfBirth"
                            value={editedUser.dateOfBirth ? editedUser.dateOfBirth.toISOString().split('T')[0] : ''}
                            onChange={handleDateChange}
                            className="w-full px-3 py-1 text-sm md:text-base rounded border bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            max={new Date().toISOString().split('T')[0]}
                            disabled={isUpdating}
                          />
                        </div>
                      </div>
                    ) : editedUser.dateOfBirth && (
                      <div className="flex items-start gap-3 md:gap-4">
                        <Calendar className="text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" size={18} />
                        <div className="flex-1">
                          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                          <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base">
                            {new Date(editedUser.dateOfBirth).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Premium Upgrade Section */}
                {!user.premium && (
                  <div className="p-4 md:p-6 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold">Unlock Premium Features</h3>
                        <p className="mt-1 opacity-90 text-sm md:text-base">Get verified badge, priority support, and exclusive resources</p>
                      </div>
                      <button
                        onClick={() => navigate("/premium")}
                        className="px-4 py-2 mt-2 md:mt-0 text-sm md:text-base bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100 transition-colors whitespace-nowrap shadow-md"
                      >
                        Upgrade Now
                      </button>
                    </div>
                  </div>
                )}

                {/* Account Information Section */}
                <div className="p-4 md:p-6 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                  <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-3 md:mb-4 flex items-center gap-2">
                    <Shield className="text-blue-500" size={18} />
                    Account Information
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <div className="flex items-start gap-3 md:gap-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                        <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base">
                          {new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 md:gap-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Account Type</p>
                        <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base">
                          {user.premium ? (
                            <span className="inline-flex items-center gap-1">
                              <span className="text-amber-500">Premium</span>
                              <Star className="fill-amber-300 text-amber-500" size={16} />
                            </span>
                          ) : 'Basic'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 md:gap-4">
                      <Clock className="text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" size={18} />
                      <div>
                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Last Active</p>
                        <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base">
                          {new Date(user.lastActive).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 md:gap-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Status</p>
                        <p className="text-green-500 text-sm md:text-base">Active</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;