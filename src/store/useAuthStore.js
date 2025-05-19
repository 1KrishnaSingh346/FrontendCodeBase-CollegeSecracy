import { create } from 'zustand';
import api from '../lib/axios';

const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isCheckingAuth: false,
  error: null,
  AllUsers : null,
  isfetchingUser : false,
  initialAuthCheckComplete: false,

initializeAuth: async () => {
  set({ isCheckingAuth: true });
  try {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await api.get('/api/v1/users/me');
      console.log('User role from API:', response.data.data.user.role); // Debug log
      
      set({
        user: response.data.data.user,
        token,
        isAuthenticated: true,
        isCheckingAuth: false,
        initialAuthCheckComplete: true
      });
    } else {
      set({ isCheckingAuth: false, initialAuthCheckComplete: true });
    }
  } catch (err) {
    console.error('Auth initialization error:', err);
    localStorage.removeItem('token');
    set({ 
      user: null,
      token: null,
      isAuthenticated: false,
      isCheckingAuth: false,
      initialAuthCheckComplete: true
    });
  }
},

  login: async (email, password) => {
  console.log('[AuthStore] Login initiated');

  // Handle both direct params and object param
  const loginData = typeof email === 'object' 
    ? { email: email.email, password: email.password }
    : { email, password };

  console.debug('Login credentials:', loginData);
  
  set({ isLoading: true, error: null });
  
  try {
    const response = await api.post('/api/v1/auth/login', {
      email: loginData.email.trim(),
      password: loginData.password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('[AuthStore] Login response:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });

    if (!response.data?.token) {
      console.error('[AuthStore] Missing token in response');
      throw new Error('Authentication token missing');
    }

    if (!response.data?.data?.user) {
      console.error('[AuthStore] Missing user data in response');
      throw new Error('User data missing');
    }

    const { token, data: { user } } = response.data;

    localStorage.setItem('token', token);
    console.debug('[AuthStore] Token stored in localStorage');

    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.debug('[AuthStore] Authorization header set');

    set({
      user,
      token,
      isAuthenticated: true,
      isLoading: false
    });

    console.log('[AuthStore] Login successful for:', user.email);
    return user;

  } catch (err) {
    console.error('[AuthStore] Login failed:', {
      name: err.name,
      message: err.message,
      stack: err.stack,
      response: {
        status: err.response?.status,
        data: err.response?.data,
        headers: err.response?.headers
      }
    });

    let errorMessage = 'Login failed. Please try again.';
    
    if (!err.response) {
      errorMessage = 'Network error. Please check your connection.';
    } else {
      switch (err.response.status) {
        case 400:
          errorMessage = err.response.data.message || 'Invalid request format';
          break;
        case 401:
          errorMessage = err.response.data.message || 'Invalid email or password';
          break;
        case 403:
          errorMessage = err.response.data.message || 'Account temporarily locked';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
      }
    }

    // Clear any partial auth state
    localStorage.removeItem('token');
    api.defaults.headers.common['Authorization'] = '';

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: errorMessage
    });

    throw new Error(errorMessage);
  }
},

signup: async (userData) => {
    console.debug('[AuthStore] Signup initiated with data:', userData);
    set({ isLoading: true, error: null });
  
    try {
      console.debug('[AuthStore] Making signup request...');
      const response = await api.post('/api/v1/auth/signup', userData);
      console.debug('[AuthStore] Signup response:', response.data);
      
      if (!response.data?.token || !response.data?.data?.user) {
        console.warn('[AuthStore] Invalid server response format');
        throw new Error('Invalid server response format');
      }

      localStorage.setItem('token', response.data.token);
      console.debug('[AuthStore] Token stored in localStorage');
      
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      console.debug('[AuthStore] Authorization header updated');
      
      set({
        user: response.data.data.user,
        token: response.data.token,
        isAuthenticated: true,
        isLoading: false
      });

      console.debug('[AuthStore] Signup successful, returning user data');
      return response.data.data.user;
      
    } catch (err) {
      console.error('[AuthStore] Signup error:', {
        error: err,
        response: err.response,
        config: err.config
      });
      
      // Don't set any error state here - just prepare the error to throw
      let errorMessage = 'Signup failed. Please try again.';
      let errorType = 'generic';
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Server is not responding. Please try again later.';
        errorType = 'timeout';
      } else if (err.response) {
        // Handle HTTP error responses
        if (err.response.status === 409) {
          errorMessage = err.response.data.message || 'Email already registered. Please log in.';
          errorType = 'email_conflict';
        } else if (err.response.status === 400) {
          errorMessage = err.response.data.message || 'Validation error. Please check your input.';
          errorType = 'validation';
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.message.includes('Network Error')) {
        errorMessage = 'Cannot connect to server. Check your internet connection.';
        errorType = 'network';
      }
      
      // Clear any error state in the store - let the component handle it
      set({ 
        error: null, 
        isLoading: false 
      });
      
      // Create an enriched error object
      const errorToThrow = new Error(errorMessage);
      errorToThrow.type = errorType;
      
      // Attach additional error details if available
      if (err.response?.data?.errors) {
        errorToThrow.errors = err.response.data.errors;
      }
      
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
      try {
        await api.post('/api/v1/auth/logout');
      } catch (err) {
        if (err.response?.status !== 404) {
          console.warn('[AuthStore] Logout endpoint not available, proceeding with client-side cleanup');
        }
      }
  
      // Client-side cleanup (always execute)
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false
      });
  
      // Clear cookies (works for same domain)
      document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      
      console.log('[AuthStore] Logout completed');
      
    } catch (err) {
      console.error('[AuthStore] Logout failed:', err);
      // Ensure state is cleared even if error occurs
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false
      });
      throw err;
    }
  },

// In useAuthStore.js
fetchAllUsers: async () => {
  set({ isfetchingUser: true, error: null });
  try {
    const response = await api.get("/api/v1/admin/users");
    
    // Ensure we're working with an array
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

  loadUser: async () => {
    console.debug('[AuthStore] Loading user session...');
    set({ isLoading: true });
    
    try {
      const token = localStorage.getItem('token');
      console.debug('[AuthStore] Token found in storage:', !!token);
      
      if (!token) {
        console.debug('[AuthStore] No token found, skipping user load');
        set({ isLoading: false });
        return null;
      }
      
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.debug('[AuthStore] Authorization header set');
      
      const response = await api.get('/api/v1/users/me');
       console.log(response.data.data.user.role);
      console.debug('[AuthStore] User session response:', response.data);
      
      if (!response.data?.data?.user) {
        console.warn('[AuthStore] Invalid user data received');
        throw new Error('Invalid user data received');
      }

      set({ 
        user: response.data.data.user,
        token: token,
        isAuthenticated: true,
        isLoading: false
      });
      
      console.debug('[AuthStore] User session loaded successfully');
      return response.data.data.user;
    } catch (err) {
      console.error('[AuthStore] Load user error:', err);
      localStorage.removeItem('token');
      set({ 
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false
      });
      throw err;
    }
  },
  
  updateProfile: async (data) => {
  set({ isLoading: true, error: null });
  
  try {
    // Ensure auth token is included
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');

    const response = await api.patch('/api/v1/users/updateMe', data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
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

/********************************************************************************************************* */

purchasePremium: async (planType = 'premium') => {
  console.debug('[AuthStore] Initiating purchase...');
  set({ isLoading: true, error: null });
  
  try {
    // Determine amount based on plan type
    let amount = 299; // Default premium amount
    if (planType === 'josaa') amount = 599;
    if (planType === 'jac-delhi') amount = 399;
    if (planType === 'uptac') amount = 399;
    if (planType === 'whatsapp') amount = 999;

    // Create order
    const orderResponse = await api.post('/api/v1/payments/create-order', {
      amount,
      planType
    });
    
    console.debug('[AuthStore] Order creation response:', orderResponse.data);
    
    if (!orderResponse.data?.data?.key || !orderResponse.data?.data?.order) {
      throw new Error('Invalid order data received');
    }

    // Load Razorpay script
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      throw new Error('Razorpay SDK failed to load');
    }

    return new Promise((resolve, reject) => {
      const options = {
        key: orderResponse.data.data.key,
        amount: orderResponse.data.data.order.amount,
        currency: orderResponse.data.data.order.currency,
        name: "CollegeSecrecy",
        description: planType === 'premium' 
          ? "Premium Membership" 
          : `Counseling Plan: ${planType}`,
        order_id: orderResponse.data.data.order.id,
        handler: async function(response) {
          try {
            console.debug('[AuthStore] Payment handler triggered:', response);
            
            // Verify payment
            const verificationResponse = await api.post('/api/v1/payments/verify-payment', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              planType
            });
            
            console.debug('[AuthStore] Payment verification response:', verificationResponse.data);
            
            // Update user state
            set((state) => {
              if (planType === 'premium') {
                return {
                  user: {
                    ...state.user,
                    premium: true,
                    premiumSince: new Date().toISOString(),
                    subscriptionPlan: 'premium'
                  },
                  isLoading: false
                };
              } else {
                const updatedPlans = {
                  ...state.user.counselingPlans,
                  [planType]: {
                    active: true,
                    purchasedOn: new Date().toISOString(),
                    validUntil: new Date(new Date().setMonth(new Date().getMonth() + (planType === 'whatsapp' || planType === 'josaa' ? 6 : 4))).toISOString(),
                    paymentId: response.razorpay_payment_id,
                    ...(planType === 'whatsapp' ? { 
                      whatsappGroupLink: verificationResponse.data.data.whatsappLink 
                    } : {})
                  }
                };
                
                return {
                  user: {
                    ...state.user,
                    counselingPlans: updatedPlans
                  },
                  isLoading: false
                };
              }
            });
            
            // Show success message
            toast.success(
              planType === 'premium'
                ? 'Premium membership activated!'
                : `Counseling plan activated! ${planType === 'whatsapp' ? 'WhatsApp group link sent to your mobile.' : ''}`
            );
            
            resolve(verificationResponse.data);
          } catch (err) {
            console.error('[AuthStore] Payment verification error:', err);
            set({ error: 'Payment verification failed', isLoading: false });
            toast.error(err.response?.data?.message || 'Payment verification failed');
            reject(err);
          }
        },
        prefill: {
          name: get().user?.fullName || '',
          email: get().user?.email || '',
          contact: get().user?.phone || ''
        },
        theme: {
          color: "#3399cc"
        },
        modal: {
          ondismiss: () => {
            console.debug('[AuthStore] Payment modal dismissed');
            set({ isLoading: false });
            reject(new Error('Payment window closed'));
          }
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();
    });
  } catch (err) {
    console.error('[AuthStore] Purchase error:', err);
    set({ 
      error: err.response?.data?.message || err.message || 'Payment failed', 
      isLoading: false 
    });
    toast.error(err.response?.data?.message || 'Payment failed');
    throw err;
  }
},

//helper function to load Razorpay script
loadRazorpayScript: () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
},
  
  clearError: () => {
    console.debug('[AuthStore] Clearing error');
    set({ error: null });
  },

/**************************************************************************************************************/

// College Data Management Methods
fetchCollegeData: async () => {
  set({ isLoading: true, error: null });
  try {
    const response = await api.get('/api/v1/admin/college-data', {
      headers: {
        'Authorization': `Bearer ${get().token}`
      }
    });
    
    if (!response.data?.data) {
      throw new Error('Invalid data format received');
    }
    console.log(response.data.data);
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
      headers: {
        'Authorization': `Bearer ${get().token}`
      }
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
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${get().token}`
      }
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
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${get().token}`
      }
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

}));

export default useAuthStore;