const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if token is present and follows "Bearer <token>" format
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // Extract token from header
  const token = authHeader.split(' ')[1];

  try {
    // Verify token using secret and decode payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request for downstream use
    req.user = decoded;

    next(); // proceed to next middleware/route
  } catch (err) {
    // Handle specific JWT errors
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }

    return res.status(401).json({ error: 'Invalid token' });
  }
};