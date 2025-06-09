import { create } from 'zustand';
import api from '../lib/axios';

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

initializeAuth: async () => {
  set({ isCheckingAuth: true });
  try {
    console.log("Checking Session Begin");
    const response = await api.get('/api/v1/auth/check-session');

    // Check backend code field explicitly
    if (response.data?.code && response.data.code >= 400) {
      // Treat as unauthenticated or error
      set({
        user: null,
        isAuthenticated: false,
        isCheckingAuth: false,
        initialAuthCheckComplete: true
      });
      return;
    }

    if (response.data?.data?.user) {
      set({
        user: response.data.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
        initialAuthCheckComplete: true
      });
    } else {
      set({ 
        isCheckingAuth: false, 
        initialAuthCheckComplete: true,
        isAuthenticated: false,
        user: null
      });
    }
  } catch (err) {
    console.error('Auth initialization error:', err);
    set({ 
      user: null,
      isAuthenticated: false,
      isCheckingAuth: false,
      initialAuthCheckComplete: true
    });
  }
},

login: async (credentials) => {
  console.log('[AuthStore] Login initiated');
  set({ isLoading: true, error: null }); // Clear previous error
  
  try {
    // Client-side validation first
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

    const response = await api.post('/api/v1/auth/login', {
      email: credentials.email.trim(),
      password: credentials.password
    }, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
      timeout: 10000
    });

    if (response.data?.status === 'success' && response.data.data?.user) {
      const { user } = response.data.data;
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      return user;
    }

    throw new Error('Login successful but user data missing');

  } catch (err) {
    console.error('[AuthStore] Login failed:', err);
    
    let errorMessage = 'Login failed. Please try again.';
    
    if (err.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout. Please try again.';
    } else if (err.response) {
      // Use server-provided message if available
      if (err.response.data?.message) {
        errorMessage = err.response.data.message;
      }
    } else if (err.message.includes('Network Error')) {
      errorMessage = 'Network error. Please check your connection.';
    } else if (err.message) {
      // Use validation error messages
      errorMessage = err.message;
    }
    
    set({
      isLoading: false,
      error: errorMessage // Store just the message string
    });
    
    throw new Error(errorMessage);
  }
},

 signup: async (userData) => {
  console.debug('[AuthStore] Signup initiated with data:', userData);
  set({ isLoading: true, error: null });
  
  try {
    const response = await api.post('/api/v1/auth/signup', userData, {
      withCredentials: true,
      timeout: 10000 // 10 seconds timeout
    });
    
    if (!response.data?.data?.user) {
      console.warn('[AuthStore] Invalid server response format');
      throw new Error('Invalid server response format');
    }
    
    set({
      user: response.data.data.user,
      isAuthenticated: true,
      isLoading: false
    });

    return response.data.data.user;
    
  } catch (err) {
    console.error('[AuthStore] Signup error:', {
      error: err,
      response: err.response,
      config: err.config
    });
    
    let errorMessage = 'Signup failed. Please try again.';
    let errorType = 'generic';
    let errors = [];
    
    if (err.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout. Please try again.';
      errorType = 'timeout';
    } else if (err.response) {
      if (err.response.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      if (err.response.data?.errors) {
        errors = err.response.data.errors;
      }
      
      switch (err.response.status) {
        case 400:
          errorType = 'validation';
          break;
        case 409:
          errorType = 'email_conflict';
          break;
        case 422:
          errorType = 'validation';
          break;
      }
    } else if (err.message.includes('Network Error')) {
      errorMessage = 'Network error. Please check your connection.';
      errorType = 'network';
    }
    
    const errorToThrow = new Error(errorMessage);
    errorToThrow.type = errorType;
    errorToThrow.errors = errors;
    
    throw errorToThrow;
  }
},

  logout: async () => {
    console.log('[AuthStore] Initiating logout');

    if (!get().isAuthenticated) {
      console.log('[AuthStore] Not authenticated, skipping logout');
      return;
    }
    
    try {
      await api.post('/api/v1/auth/logout', {}, {
        withCredentials: true
      });
      
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
      
      console.log('[AuthStore] Logout completed');
    } catch (err) {
      console.error('[AuthStore] Logout failed:', err);
      // Ensure state is cleared even if error occurs
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
      throw err;
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
      await get().fetchFeedbackHistory();
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
  
  // *********************************** Admin related handling ************************************************
  updateProfile: async (data) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.patch('/api/v1/users/updateMe', data, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (!response.data?.data?.user) {
        throw new Error('Invalid profile data received');
      }

      set({ 
        user: response.data.data.user,
        isLoading: false
      });
      
      return response.data;
    } catch (err) {
      let errorMessage = 'Update failed';
      if (err.response) {
        errorMessage = err.response.data?.message || 
                     err.response.statusText || 
                     'Update failed';
      }
      set({ error: errorMessage, isLoading: false });
      throw err;
    }
  },

  
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

      return response.data;
    } catch (err) {
      console.error('Payment order creation failed:', err);
      throw new Error(err.response?.data?.message || 'Failed to create payment order');
    } finally {
      set({ isLoading: false });
    }
  },

  verifyPayment: async (paymentData) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/api/v1/payments/verify', paymentData, {
        withCredentials: true
      });

      // Refresh user data after successful payment
      await get().loadUser();

      return response.data;
    } catch (err) {
      console.error('Payment verification failed:', err);
      throw new Error(err.response?.data?.message || 'Payment verification failed');
    } finally {
      set({ isLoading: false });
    }
  },

  initiateRazorpayPayment: async (orderData) => {
    return new Promise((resolve, reject) => {
      const options = {
        key: process.env.RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "College Secracy",
        description: `Purchase: ${orderData.planName}`,
        order_id: orderData.orderId,
        handler: async function(response) {
          try {
            const verification = await get().verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              purchaseId: orderData.purchaseId
            });
            resolve(verification);
          } catch (err) {
            reject(err);
          }
        },
        prefill: {
          name: get().user?.fullName || '',
          email: get().user?.email || '',
          contact: get().user?.phone || ''
        },
        theme: {
          color: "#F37254"
        },
        modal: {
          ondismiss: function() {
            reject(new Error('Payment window closed'));
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    });
  },

  // Admin payment methods
  getAllTransactions: async () => {
    if (get().user?.role !== 'admin') {
      throw new Error('Unauthorized access');
    }

    set({ isLoading: true });
    try {
      const response = await api.get('/api/v1/admin/payments', {
        withCredentials: true
      });
      return response.data;
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
      throw new Error(err.response?.data?.message || 'Failed to fetch transactions');
    } finally {
      set({ isLoading: false });
    }
  },

  getTransactionDetails: async (paymentId) => {
    if (get().user?.role !== 'admin') {
      throw new Error('Unauthorized access');
    }

    set({ isLoading: true });
    try {
      const response = await api.get(`/api/v1/admin/payments/${paymentId}`, {
        withCredentials: true
      });
      return response.data;
    } catch (err) {
      console.error('Failed to fetch transaction details:', err);
      throw new Error(err.response?.data?.message || 'Failed to fetch transaction details');
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