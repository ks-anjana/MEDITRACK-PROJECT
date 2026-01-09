// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem('token');
};

// Get user from localStorage
export const getUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }
  return null;
};

// Save auth data
export const saveAuthData = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

// Clear auth data
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getToken();
  const user = getUser();
  return !!(token && user);
};

// Check if user is admin
export const isAdmin = () => {
  const user = getUser();
  return user?.role === 'admin';
};

// Get user name
export const getUserName = () => {
  const user = getUser();
  return user?.name || 'User';
};

// Get user ID
export const getUserId = () => {
  const user = getUser();
  return user?.id || user?._id;
};
