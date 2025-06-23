import { create } from 'zustand';
import api from '../lib/axios';
import { toast } from 'react-hot-toast';

const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isCheckingAuth: false,
  error: null,
  AllUsers: null,
  isfetchingUser: false,
  initialAuthCheckComplete: false,
    feedbackHistory: [],
  loadingFeedback: false,
    notifications: [],
  loadingNotifications: false,
   pollingInterval: null,
     payments: [],
  totalPayments: 0,
  userLogs: [],
  adminAuditLogs: [],

initializeAuth: async () => {
  set({ isCheckingAuth: true });

  try {
    const response = await api.get('/api/v1/auth/check-session');
    const sessionValid = response.data?.code === 200;

    if (!sessionValid) {
      throw new Error('Session invalid'); // Force error catch block
    }

    // ✅ Session valid, load user
    await get().loadUser();

    set({
      isCheckingAuth: false,
      initialAuthCheckComplete: true
    });

  } catch (err) {
    console.error('Auth initialization error:', err);

    // ❌ Let refresh-token run via interceptor
    if (err?.response?.status !== 401) {
      set({
        user: null,
        isAuthenticated: false,
        isCheckingAuth: false,
        initialAuthCheckComplete: true
      });
    }
    // ✅ Don’t force logout on 401 — let refresh-token logic decide that
  }
},




login: async (credentials) => {
  console.log('[AuthStore] Login initiated');
  set({ isLoading: true, error: null });

  try {
    // Basic validation
    if (!credentials.email?.trim()) {
      throw new Error('Please provide your email address');
    }
    if (!credentials.password) {
      throw new Error('Please provide your password');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email.trim())) {
      throw new Error('Please provide a valid email address');
    }

    const response = await api.post(
      '/api/v1/auth/login',
      {
        email: credentials.email.trim(),
        password: credentials.password,
      },
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
        timeout: 20000,
      }
    );

    // Success case
    if (response.data?.status === 'success' && response.data.data?.user) {
      const { user } = response.data.data;
      await get().loadUser();
      set({ error: null, isLoading: false });
      return user;
    }

    throw new Error('Login successful but user data missing');

  } catch (err) {
    console.error('[AuthStore] Login failed:', err);

    let errorMessage = 'Login failed. Please try again.';
    let errorType = 'generic';
    let errors = [];
    let lockTimeLeft = null;

    if (err.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout. Please try again.';
      errorType = 'timeout';

    } else if (err.response) {
      const resData = err.response.data;

      if (resData?.message) errorMessage = resData.message;
      if (resData?.errors) errors = resData.errors;

      switch (err.response.status) {
        case 400:
          errorType = 'validation';
          break;
        case 401:
          errorType = 'invalid_credentials';
          break;
        case 403:
          if (resData.code === 'ACCOUNT_DEACTIVATED') {
            errorType = 'deactivated_account';
          } else if (resData.code === 'VERIFY_ACCOUNT') {
            errorType = 'verify_account';
          } else if (resData.locked) {
            errorType = 'account_locked';
            lockTimeLeft = resData.lockTimeLeft ?? null;
          } else {
            errorType = 'unauthorized';
          }
          break;
        case 422:
          errorType = 'validation';
          break;
        default:
          errorType = 'generic';
      }

    } else if (err.message.includes('Network Error')) {
      errorMessage = 'Network error. Please check your connection.';
      errorType = 'network';
    } else if (err.message) {
      errorMessage = err.message;
    }

    const errorToThrow = new Error(errorMessage);
    errorToThrow.type = errorType;
    errorToThrow.errors = errors;
    if (lockTimeLeft !== null) errorToThrow.lockTimeLeft = lockTimeLeft;

    set({ isLoading: false });
    throw errorToThrow;
  }
},


signup: async (userData) => {
  console.debug('[AuthStore] Signup initiated with data:', userData);
  set({ isLoading: true, error: null });

  try {
    const response = await api.post('/api/v1/auth/signup', userData, {
      withCredentials: true,
      timeout: 20000
    });

    // Backend ab sirf status & message return karta hai:
    // { status: 'success', message: 'Signup successful! Please verify your email...' }
    if (response.data?.status === 'success') {
      set({ isLoading: false });
      return { success: true, message: response.data.message };
    }

    // Agar unexpected shape
    throw new Error(response.data?.message || 'Signup failed');
  } catch (err) {
    console.error('[AuthStore] Signup error:', err);

    let errorMessage = 'Signup failed. Please try again.';
    let errorType = 'generic';
    let errors = [];

    if (err.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout. Please try again.';
      errorType = 'timeout';
    } else if (err.response) {
      const resData = err.response.data;
      if (resData?.message) errorMessage = resData.message;
      if (Array.isArray(resData.errors)) errors = resData.errors;

      switch (err.response.status) {
        case 400:
        case 422:
          errorType = 'validation';
          break;
        case 409:
          errorType = 'email_conflict';
          break;
      }
    } else if (err.message.includes('Network Error')) {
      errorMessage = 'Network error. Please check your connection.';
      errorType = 'network';
    } else if (err.message) {
      errorMessage = err.message;
    }

    const errorToThrow = new Error(errorMessage);
    errorToThrow.type = errorType;
    errorToThrow.errors = errors;

    set({ isLoading: false });
    throw errorToThrow;
  }
},

logout: async () => {
  console.log('[AuthStore] Initiating logout');

  try {
    await api.post('/api/v1/auth/logout', {}, { withCredentials: true });

    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      initialAuthCheckComplete: true // ensure clean state
    });

    console.log('[AuthStore] Logout completed');

    // Optional redirect
    window.location.href = '/';
  } catch (err) {
    console.error('[AuthStore] Logout failed:', err);

    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      initialAuthCheckComplete: true
    });

    // Optional: show toast
    // toast.error("Logout failed. You have been signed out locally.");

    throw err;
  }
},

resetPassword: async (token, email, password) => {
  try {
    set({ isLoading: true });

    const res = await api.post(`/api/v1/auth/reset-password?token=${token}`, {
      email,
      password,
    });

    return res.data;
  } catch (err) {
    console.error("❌ Password Reset failed:", err?.response?.data || err.message);

    return (
      err?.response?.data || {
        success: false,
        message: "Something went wrong. Please try again.",
      }
    );
  } finally {
    set({ isLoading: false });
  }
},


verifyEmail: async (token, email, type) => {
  try {
    set({ isLoading: true });
    const res = await api.post(`/api/v1/auth/verify-email?token=${token}`, {email, type});
    return res.data;
  } catch (err) {
    console.error("Verification failed:", err?.response?.data);
    return err?.response?.data || { success: false };
  } finally {
    set({ isLoading: false });
  }
},

sendResetReactivateEmail: async (email, type) => {
  try {
    set({ isLoading: true });
    console.log("Email : ", email);

    const res = await api.post(`/api/v1/auth/send-reset-reactivate-email`, { email, type });

    return res.data;
  } catch (err) {
    console.error("Send Reset/Reactivate Email failed", err?.response?.data);
    return err?.response?.data || { success: false };
  } finally {
    set({ isLoading: false });
  }
},


reSendVerificationEmail: async (email, type) => {
  try {
    set({ isLoading: true });

    const res = await api.post(`/api/v1/auth/resend-verification-email`, { email, type });

    return res.data;
  } catch (err) {
    console.error("Resend Verification Email failed", err?.response?.data);
    return err?.response?.data || { success: false };
  } finally {
    set({ isLoading: false });
  }
},

checkVerificationStatus: async (email, type) => {
    try {
      const res = await api.post(`/api/v1/auth/check-verification-status`,{email, type});
      return res?.data;
    } catch (err) {
      console.error("Check verification error:", err);
      return false;
    }
  },



  loadUser: async () => {
    console.debug('[AuthStore] Loading user session...');
    set({ isLoading: true });
    
    try {
      const response = await api.get('/api/v1/users/me', {
        withCredentials: true
      });
      if (!response.data?.data?.user) {
        console.warn('[AuthStore] Invalid user data received');
        throw new Error('Invalid user data received');
      }
      set({ 
        user: response.data.data.user,
        isAuthenticated: true,
        isLoading: false
      });

     if (response.data.data.user.role === 'mentee') {
  try {
    await get().fetchFeedbackHistory();
  } catch (e) {
    console.warn('[AuthStore] Feedback fetch failed:', e);
  }
}
      console.debug('[AuthStore] User session loaded successfully');
      return response.data.data.user;
    } catch (err) {
      console.error('[AuthStore] Load user error:', err);
      set({ 
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
      throw err;
    }
  },

    // 🔐 Delete Account permanently (with password confirmation)
  deleteAccount: async (password) => {
    console.log('[AuthStore] Initiating account deletion');
    set({ isLoading: true, error: null });

    try {
      await api.delete('/api/v1/users/deleteMe', {
        data: { password }, // DELETE with body
        withCredentials: true
      });

      // ✅ Clear state on successful deletion
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });

      localStorage.clear(); // or sessionStorage if you use it
      window.location.href = '/'; // Redirect to home/login
    } catch (err) {
      console.error('[AuthStore] Delete failed:', err);
      const msg = err.response?.data?.message || 'Account deletion failed.';
      set({ isLoading: false, error: msg });
      throw new Error(msg);
    }
  },

  // 💤 Deactivate Account (soft delete with reason)
  deactivateAccount: async (reason) => {
    console.log('[AuthStore] Deactivating account...');
    set({ isLoading: true, error: null });

    try {
      await api.patch('/api/v1/users/deactivateAccount', { reason }, {
        withCredentials: true
      });

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });

      get().logout();
      window.location.href = '/';
    } catch (err) {
      console.error('[AuthStore] Deactivation failed:', err);
      const msg = err.response?.data?.message || 'Account deactivation failed.';
      set({ isLoading: false, error: msg });
      throw new Error(msg);
    }
  },


  // Audit logs 

getMyLogs: async () => {
    try {
      const res = await api.get('/api/v1/users/audit/my-logs', {
      withCredentials: true
    });
      set({ userLogs: res.data.data });
    } catch (err) {
      console.error('Failed to fetch user logs:', err);
    }
  },

  getAllLogs: async () => {
    try {
      const res = await api.get('/api/v1/admin/audit/all');
      set({ adminAuditLogs: res.data.data });
    } catch (err) {
      console.error('Failed to fetch all logs:', err);
    }
  },

  
updateProfile: async (data) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.patch('/api/v1/users/updateMe', data);
      const updatedUser = response.data.data.user;

      set({ user: updatedUser, isLoading: false });
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Update failed';
      set({ error: errorMessage, isLoading: false });
      throw err;
    }
  },

uploadProfilePic: async (formData) => {
  set({ isLoading: true, error: null });
  try {
    const response = await api.post('/api/v1/users/uploadProfilePic', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    const uploadedPic = response.data.data.profilePic;
    set((state) => ({
      user: {
        ...state.user,
        profilePic: uploadedPic,
      },
      isLoading: false,
    }));
    return uploadedPic;
  } catch (err) {
    set({ error: "Upload failed", isLoading: false });
    throw err;
  }
},

removeProfilePicAPI: async () => {
  set({ isLoading: true, error: null });
  try {
    await api.delete('/api/v1/users/removeProfilePic');
    set((state) => ({
      user: {
        ...state.user,
        profilePic: null,
      },
      isLoading: false,
    }));
  } catch (err) {
    set({ error: "Remove failed", isLoading: false });
    throw err;
  }
},

getInvoiceDownloadLink: (paymentId) => {
  return `${api.defaults.baseURL}/api/v1/invoice/${paymentId}`;
},




  // *********************************** Admin related handling ************************************************

  
  clearError: () => {
    console.debug('[AuthStore] Clearing error');
    set({ error: null });
  },

    fetchAllUsers: async () => {
    set({ isfetchingUser: true, error: null });
    try {
      const response = await api.get("/api/v1/admin/users", {
        withCredentials: true
      });
      
      const usersArray = Array.isArray(response.data.data) 
        ? response.data.data 
        : Array.isArray(response.data.data.users)
          ? response.data.data.users
          : [];
      
      set({ 
        AllUsers: usersArray,
        isfetchingUser: false 
      });
      return usersArray;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      set({ 
        error: error.response?.data?.message || error.message, 
        isfetchingUser: false 
      });
      throw error;
    }
  },
  // College Data Management Methods
  fetchCollegeData: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/api/v1/admin/college-data', {
        withCredentials: true
      });
      
      if (!response.data?.data) {
        throw new Error('Invalid data format received');
      }
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch college data:', error);
      set({ error: error.response?.data?.message || error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteCollegeData: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.delete(`/api/v1/admin/college-data/${id}`, {
        withCredentials: true
      });
      
      return response.data;
    } catch (error) {
      console.error('Failed to delete college data:', error);
      set({ error: error.response?.data?.message || error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateCollegeData: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.patch(`/api/v1/admin/college-data/${id}`, data, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      
      return response.data;
    } catch (error) {
      console.error('Failed to update college data:', error);
      set({ error: error.response?.data?.message || error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  uploadCollegeData: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/api/v1/admin/college-data/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      
      return response.data;
    } catch (error) {
      console.error('Failed to upload college data:', error);
      set({ error: error.response?.data?.message || error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  //******************************* */ Feedback APIs Handling Here ****************************************************
  

// for public 

getApprovedFeedbacks: async () => {
  try {
    const res = await api.get(`api/v1/public/feedback`);
    return {
      success: true,
      data: res.data.data
    };
  } catch (err) {
    console.error("Error fetching approved feedbacks:", err);
    return {
      success: false,
      error: err.response?.data?.error || "Failed to fetch testimonials"
    };
  }
},

// for mentee
// In useAuthStore.js
fetchFeedbackHistory: async () => {
  set({ loadingFeedback: true });
  try {
    const response = await api.get('/api/v1/mentee/feedbackHistory');
    
    // Handle different response structures
    const feedbackData = response.data?.data || response.data || [];
    
    // Ensure we always have an array
    const feedbackHistory = Array.isArray(feedbackData) 
      ? feedbackData 
      : [feedbackData].filter(Boolean);
    
    set({ 
      feedbackHistory,
      loadingFeedback: false 
    });
    
    return feedbackHistory;
  } catch (err) {
    console.error('Feedback fetch error:', err);
    set({ 
      feedbackHistory: [],
      loadingFeedback: false 
    });
    return [];
  }
},

  // Update the submitFeedback method to add to local state
  submitFeedback: async (feedbackData) => {
    try {
      const { message, category, starRating } = feedbackData;
      const response = await api.post('/api/v1/mentee/feedback', {
        message,
        category,
        starRating
      });
      
      // Update local feedback history
      set(state => ({
        feedbackHistory: [response.data.feedback, ...state.feedbackHistory],
        user: {
          ...state.user,
          feedbacks: [response.data.feedback._id, ...(state.user.feedbacks || [])]
        }
      }));
      
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to submit feedback");
    }
  },

  // Add this method to your auth store
// Add this method to your auth store
editFeedback: async (feedbackId, feedbackData) => {
  try {
    const { message, category, starRating } = feedbackData;
    const response = await api.patch(`/api/v1/mentee/editFeedback/${feedbackId}`, {
      message,
      category,
      starRating
    }, {
      withCredentials: true
    });
    
    // Update local feedback history
    set(state => ({
      feedbackHistory: state.feedbackHistory.map(fb => 
        fb._id === feedbackId ? response.data.feedback : fb
      )
    }));
    
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to update feedback");
  }
},

// In your useAuthStore.js
updateFeedBackStatus: async (feedbackId, status) => {
  try {
    const res = await api.patch(`/api/v1/admin/feedback/${feedbackId}`, status);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to update feedback status");
  }
},

AllFeedbackList: async (userId) => {
  try {
    const res = await api.get(`/api/v1/admin/feedback?userId=${userId}`);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch feedbacks");
  }
},

 startNotificationPolling: (interval = 30000) => {
    // Clear existing interval if any
    if (get().pollingInterval) {
      clearInterval(get().pollingInterval);
    }
    
    // Initial fetch
    get().fetchNotifications();
    
    // Set up new interval
    const intervalId = setInterval(() => {
      if (get().user?.role === 'admin') {
        get().fetchNotifications();
      }
    }, interval);
    
    set({ pollingInterval: intervalId });
  },
  
  // Stop polling
  stopNotificationPolling: () => {
    if (get().pollingInterval) {
      clearInterval(get().pollingInterval);
      set({ pollingInterval: null });
    }
  },



//***************************Payment Related API handling *********************************** */
createPaymentOrder: async (planId, couponCode = null) => {
  set({ isLoading: true });
  try {
    const response = await api.post('/api/v1/payments/create-order', {
      planId,
      couponCode
    }, {
      withCredentials: true
    });

    return { success: true, data: response.data };
  } catch (err) {
    console.error('Payment order creation failed:', err);
    return {
      success: false,
      message: err.response?.data?.message || 'Failed to create payment order'
    };
  } finally {
    set({ isLoading: false });
  }
},

loadRazorpayScript : async () => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true);
    } else {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => reject("Razorpay SDK failed to load");
      document.body.appendChild(script);
    }
  });
},
  
initiateRazorpayPayment: async (orderData, callbacks = {}) => {
  const { onPaymentSuccess } = callbacks;

  const loaded = await get().loadRazorpayScript();
  if (!loaded) {
    alert("Failed to load Razorpay SDK. Please check your connection.");
    return;
  }

  return new Promise((resolve, reject) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_TEST_KEY,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "College Secracy",
      description: `Purchase: ${orderData.planName}`,
      order_id: orderData.orderId,
      prefill: {
        name: orderData.fullName || undefined,
        email: orderData.email || undefined,
        contact: orderData.phone || undefined
      },
      theme: { color: "#4548F8" },
      notes: {
        userId: orderData.userId || '',
        planId: orderData.planId || '',
        purchaseId: orderData.purchaseId || '',
        couponCode: orderData.couponCode || 'none',
        validity: orderData.validity || ''
      },
      handler: async function (response) {
         if (typeof onPaymentSuccess === 'function') {
          onPaymentSuccess();
        }
        try {
          const verification = await get().verifyPayment({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            purchaseId: orderData.purchaseId
          });
          console.log("Verification result:", verification);
          resolve(verification);
        } catch (err) {
          console.error("Verification error:", err);
          reject(err);
        }
      },
      modal: {
        ondismiss: () => {
          console.log("Payment window closed by user");
          reject(new Error("Payment window closed"));
        }
      }
    };

    console.log("Opening Razorpay checkout with options:", options);
    const rzp = new window.Razorpay(options);
    rzp.open();
  });
},

  
  verifyPayment: async (paymentData) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/api/v1/payments/verify', paymentData, {
        withCredentials: true
      });
      console.log("VerifyPayment kya return kar rha ",response.data);
      return response.data;
    } catch (err) {
      console.error('Payment verification failed:', err);
      throw new Error(err.response?.data?.message || 'Payment verification failed');
    } finally {
      set({ isLoading: false });
    }
  },

 getAllPayments: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/api/v1/admin/payments', {
        withCredentials: true,
      });

      const payments = response.data?.data || [];
      const total = response.data?.totalPayments || payments.length;

      set({ payments, totalPayments: total });
      console.log('Payment Data:', payments);
      return payments;
    } catch (err) {
      console.error('Failed to fetch payment details', err);
      set({ error: 'Failed to fetch payments' });
      return [];
    } finally {
      set({ isLoading: false });
    }
  },


  fetchNotifications: async () => {
    set({ loadingNotifications: true });
    try {
      const response = await api.get('/api/v1/admin/notifications', {
        withCredentials: true
      });
      set({ 
        notifications: response.data,
        loadingNotifications: false 
      });
      //  console.log("Notication data :", response.data);
      return response.data;
    } catch (err) {
      set({ loadingNotifications: false });
      throw err;
    }
  },

  // Mark notification as read
  markNotificationAsRead: async (notificationId) => {
    try {
      const response = await api.patch(
        `/api/v1/admin/notifications/${notificationId}/read`,
        {},
        { withCredentials: true }
      );
      
      // Update local state
      set(state => ({
        notifications: state.notifications.map(n => 
          n._id === notificationId ? { ...n, isRead: true } : n
        )
      }));
      
      return response.data;
    } catch (err) {
      throw err;
    }
  },

  // Get unread count (computed value)
  getUnreadCount: () => {
    return get().notifications.filter(n => !n.isRead).length;
  },


  // ******************************Plan Controller APIs *********************

  
  AddPlan : async (planData) => {
    try {
      const res = await api.post("/api/v1/admin/plans", planData);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || "Failed to add plan");
    }
  },

  // 2. Get Plans (optionally by Plantype)
GetPlan: async (Plantype) => {
  try {
    const url = Plantype 
      ? `/api/v1/admin/plans/${Plantype}` 
      : `/api/v1/admin/plans`;
    const response = await api.get(url);
    return response.data; // This will now be the array of plans directly
  } catch (err) {
    throw new Error(err.response?.data?.error || "Failed to fetch plans");
  }
},

menteeGetPlan: async (Plantype) => {
  try {
    const url = Plantype 
      ? `/api/v1/mentee/plans/${Plantype}` 
      : `/api/v1/mentee/plans`;
    const response = await api.get(url);
     console.log('Plan response:', response);
    return response.data; // This will now be the array of plans directly
  } catch (err) {
    throw new Error(err.response?.data?.error || "Failed to fetch plans");
  }
},

  // 3. Update Plan
  UpdatePlan: async (id, planData) => {
    try {
      const res = await api.patch(`/api/v1/admin/plans/update/${id}`, planData);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || "Failed to update plan");
    }
  },

  // 4. Delete Plan
  DeletePlan: async (id) => {
    try {
      const res = await api.delete(`/api/v1/admin/plans/delete/${id}`);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || "Failed to delete plan");
    }
  },

  // *********************************** Events APIs handling ***********
  // Add to useAuthStore.js
// Event-related methods in useAuthStore
fetchEvents: async (params = {}) => {
  set({ isLoading: true });

  try {
    const { status, type, from, to } = params;
    let query = {};

    if (status) query.status = status;
    if (type) query.type = type;
    if (from && to) {
      query.date = {
        $gte: new Date(from),
        $lte: new Date(to),
      };
    }

    const role = get().user?.role;
    let endpoint = '/api/v1/events'; // default

    // Use different endpoint based on role
    if (role === 'mentee') {
      endpoint = '/api/v1/mentee/events';
    } else if (role === 'admin') {
      endpoint = '/api/v1/admin/events';
    }

    const response = await api.get(endpoint, {
      params: query,
      withCredentials: true,
    });

    return response.data.events || [];

  } catch (err) {
    console.error('Failed to fetch events:', err);
    throw new Error(err.response?.data?.message || 'Failed to fetch events');
  } finally {
    set({ isLoading: false });
  }
},

getEventById: async (eventId) => {
  set({ isLoading: true });
  try {
    const role = get().user?.role;
    let endpoint = `/api/v1/events/${eventId}`; // default

    // Use role-specific endpoint if needed
    if (role === 'mentee') {
      endpoint = `/api/v1/mentee/events/${eventId}`;
    } else if (role === 'admin') {
      endpoint = `/api/v1/admin/events/${eventId}`;
    }

    const response = await api.get(endpoint, {
      withCredentials: true
    });

    return response.data.event;
  } catch (err) {
    console.error('Failed to fetch event:', err);
    throw new Error(err.response?.data?.message || 'Failed to fetch event');
  } finally {
    set({ isLoading: false });
  }
},

fetchRegisteredEvents: async () => {
  if (!get().isAuthenticated) return [];
  
  set({ isLoading: true });
  try {
    const response = await api.get('/api/v1/mentee/events/registered', {
      withCredentials: true
    });
    return response.data.registeredEvents || [];
  } catch (err) {
    console.error('Failed to fetch registered events:', err);
    throw new Error(err.response?.data?.message || 'Failed to fetch registered events');
  } finally {
    set({ isLoading: false });
  }
},

registerForEvent: async (eventId) => {
  set({ isLoading: true });
  try {
    const response = await api.post(`/api/v1/mentee/events/register/${eventId}`, {}, {
      withCredentials: true
    });
    return response.data.registeredEvent;
  } catch (err) {
    console.error('Failed to register for event:', err);
    throw new Error(err.response?.data?.message || 'Failed to register for event');
  } finally {
    set({ isLoading: false });
  }
},

unregisterFromEvent: async (eventId) => {
  set({ isLoading: true });
  try {
    await api.delete(`/api/v1/mentee/events/unregister/${eventId}`, {
      withCredentials: true
    });
    return eventId;
  } catch (err) {
    console.error('Failed to unregister from event:', err);
    throw new Error(err.response?.data?.message || 'Failed to unregister from event');
  } finally {
    set({ isLoading: false });
  }
},

createEvent: async (eventData) => {
  if (get().user?.role !== 'admin') {
    throw new Error('Unauthorized');
  }
  
  set({ isLoading: true });
  try {
    // Convert dates to ISO strings if they exist
    if (eventData.date) eventData.date = new Date(eventData.date).toISOString();
    if (eventData.endDate) eventData.endDate = new Date(eventData.endDate).toISOString();
    
    const response = await api.post('/api/v1/admin/events', eventData, {
      withCredentials: true
    });
    return response.data.event;
  } catch (err) {
    console.error('Failed to create event:', err);
    throw new Error(err.response?.data?.message || 'Failed to create event');
  } finally {
    set({ isLoading: false });
  }
},

updateEvent: async (eventId, eventData) => {
  if (get().user?.role !== 'admin') {
    throw new Error('Unauthorized');
  }
  
  set({ isLoading: true });
  try {
    // Convert dates to ISO strings if they exist
    if (eventData.date) eventData.date = new Date(eventData.date).toISOString();
    if (eventData.endDate) eventData.endDate = new Date(eventData.endDate).toISOString();
    
    const response = await api.patch(`/api/v1/admin/events/${eventId}`, eventData, {
      withCredentials: true
    });
    return response.data.event;
  } catch (err) {
    console.error('Failed to update event:', err);
    throw new Error(err.response?.data?.message || 'Failed to update event');
  } finally {
    set({ isLoading: false });
  }
},

deleteEvent: async (eventId) => {
  if (get().user?.role !== 'admin') {
    throw new Error('Unauthorized');
  }
  
  set({ isLoading: true });
  try {
    await api.delete(`/api/v1/admin/events/${eventId}`, {
      withCredentials: true
    });
    return eventId;
  } catch (err) {
    console.error('Failed to delete event:', err);
    throw new Error(err.response?.data?.message || 'Failed to delete event');
  } finally {
    set({ isLoading: false });
  }
},

getEventAttendees: async (eventId) => {
  if (get().user?.role !== 'admin') {
    throw new Error('Unauthorized');
  }
  
  set({ isLoading: true });
  try {
    const response = await api.get(`/api/v1/admin/events/${eventId}/attendees`, {
      withCredentials: true
    });
    return response.data.attendees || [];
  } catch (err) {
    console.error('Failed to fetch attendees:', err);
    throw new Error(err.response?.data?.message || 'Failed to fetch attendees');
  } finally {
    set({ isLoading: false });
  }
}
}));





export default useAuthStore;