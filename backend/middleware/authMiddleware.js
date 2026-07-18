const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Check karo user logged in hai ya nahi (valid token hai ya nahi)
exports.protect = async (req, res, next) => {
  let token;

  // Header mein "Authorization: Bearer <token>" format mein token aata hai
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    // Token verify karo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Token se user ID nikal ke user object req mein daal do (aage use karne ke liye)
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

// Check karo user "admin" hai ya nahi (sirf admin routes ke liye)
exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied, admin only' });
  }
};