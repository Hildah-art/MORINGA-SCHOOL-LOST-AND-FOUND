import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('user'); // Replace this with actual auth logic
  return isAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoute;
