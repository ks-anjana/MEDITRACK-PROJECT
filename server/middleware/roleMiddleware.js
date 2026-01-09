// Middleware to verify admin role
const adminMiddleware = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized - No user found' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied - Admin only' });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = adminMiddleware;
