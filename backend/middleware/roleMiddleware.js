/**
 * Role Authorization Middleware
 * Enforces route access control based on user roles injected by authMiddleware.
 * 
 * Usage in routes:
 * router.post('/schedule', authMiddleware, roleMiddleware('investor'), scheduleController);
 * router.put('/accept/:id', authMiddleware, roleMiddleware('entrepreneur'), acceptController);
 */
const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    // 1. Ensure authMiddleware has executed and attached the decoded user object
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Authentication details missing."
      });
    }

    // 2. Verify if the user's role exists within the allowed array parameters
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access forbidden. Your account type does not have permission to perform this action."
      });
    }

    // 3. Authorization successful, proceed to the next handler
    next();
  };
};

module.exports = roleMiddleware;