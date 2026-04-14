const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach fresh user from DB
    const user = await User.findById(decoded.userId || decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const requireProvider = (req, res, next) => {
  if (req.user && (req.user.role === 'PROVIDER' || req.user.role === 'ADMIN')) {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied. Provider privileges required.' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
};

module.exports = {
  authMiddleware,
  requireProvider,
  requireAdmin
};
