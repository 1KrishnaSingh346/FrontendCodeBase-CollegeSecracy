// LandingRedirect.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/useAuthStore.js'; // adjust import to your auth store

const LandingRedirect = () => {
  const { user, initialAuthCheckComplete } = useAuthStore(); // assuming your auth store has these
  const navigate = useNavigate();

  useEffect(() => {
    if (!initialAuthCheckComplete) return; // wait until auth state is ready

    if (user?.role === 'admin') {
      navigate('/admin');  // redirect admin to admin page
    } else if (user?.role === 'mentee') {
      navigate('/mentee');  // redirect mentee to mentee page
    } else {
      navigate('/');  // if no user, go to login
    }
  }, [user, initialAuthCheckComplete, navigate]);

  return null; // no UI, just redirecting
};

export default LandingRedirect;
