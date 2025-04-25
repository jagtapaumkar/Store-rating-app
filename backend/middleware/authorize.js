// middleware/authorize.js

/**
 * Middleware to check if a user has the required role(s)
 * @param {Array} allowedRoles - Array of roles allowed to access the route
 */
function authorizeRoles(allowedRoles) {
    return (req, res, next) => {
      // User should be attached to req by the authenticateToken middleware
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
  
      // Check if user's role is in the allowed roles
      if (allowedRoles.includes(req.user.role)) {
        next();
      } else {
        res.status(403).json({ 
          error: 'Access denied. You do not have permission to perform this action.' 
        });
      }
    };
  }
  
  module.exports = authorizeRoles;