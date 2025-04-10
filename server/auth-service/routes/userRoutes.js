import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

const router = express.Router();

const authenticate = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user info' });
  }
});

router.put('/me', authenticate, async (req, res) => {
  try {
    const { interests, location } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { interests, location },
      { new: true }
    ).select('-password');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user info' });
  }
});

export default router;
