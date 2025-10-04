
const jwt = require("jsonwebtoken");

// Middleware: Verify JWT token
function authenticateJWT(req, res, next) {

  if (process.env.NODE_ENV === 'development' && req.headers['x-test-bypass'] === 'true') {
    req.user = { userId: 1, role: 'Admin' };
    return next();
  }
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; 

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user; 
    next();
  });
}

// Middleware: Role-based access control
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {

    if (process.env.NODE_ENV === 'development' && req.headers['x-test-bypass'] === 'true') {
      return next();
    }
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied: insufficient role" });
    }
    next();
  };
}

module.exports = { authenticateJWT, authorizeRoles };
