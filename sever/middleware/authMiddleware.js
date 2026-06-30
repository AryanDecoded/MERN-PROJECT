const jwt = require('jsonwebtoken');

// Protect routes — attach user info to req.user
const protect = (req, res, next) => {
  // Token comes in the header: Authorization: Bearer <token>
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorised. No token.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email }
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorised. Token invalid.' });
  }
};

module.exports = { protect };
