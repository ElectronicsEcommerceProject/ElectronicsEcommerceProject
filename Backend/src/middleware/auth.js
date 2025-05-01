import ROLES from '../constants/roles.js';

export const isAdmin = (req, res, next) => {
  if (req.user.role !== ROLES.ADMIN) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};