import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { selectAuthUser } from '../../store/slices/authSlice';

const ProtectedRoute = ({ children, requiredRole }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectAuthUser);
  const token = localStorage.getItem('token');

  useEffect(() => {
    // If no user or token, redirect to home
    if (!user && !token) {
      navigate('/', { replace: true });
      return;
    }

    // Prevent back navigation for authenticated users
    const handlePopState = (event) => {
      // If user is authenticated and tries to go back to home page
      if (location.pathname !== '/') {
        event.preventDefault();
        // Stay on current page
        window.history.pushState(null, '', location.pathname);
      }
    };

    // Add current state to history to prevent back navigation
    window.history.pushState(null, '', location.pathname);
    
    // Listen for back button
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [user, token, navigate, location.pathname]);

  // If no user or token, don't render children
  if (!user && !token) {
    return null;
  }

  // If requiredRole is set, check userRole
  if (requiredRole && user.userRole !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;