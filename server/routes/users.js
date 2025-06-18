import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Role from '../models/Role.js';
import UserSession from '../models/UserSession.js';
import { authenticateToken } from '../middleware/auth.js';
import { checkPermission } from '../middleware/permissions.js';

const router = express.Router();

// Get all users (with pagination and filtering)
router.get('/', 
  authenticateToken, 
  checkPermission('user_management', 'view'),
  async (req, res) => {
    try {
      const { page = 1, limit = 10, search, role, status } = req.query;
      
      let query = {};
      
      // Search filter
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { company: { $regex: search, $options: 'i' } }
        ];
      }
      
      // Role filter
      if (role && role !== 'all') {
        query.role = role;
      }
      
      // Status filter
      if (status && status !== 'all') {
        query.isActive = status === 'active';
      }
      
      const users = await User.find(query)
        .select('-password')
        .populate('role')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);
      
      const total = await User.countDocuments(query);
      
      res.json({
        users,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// Create new user
router.post('/', 
  authenticateToken, 
  checkPermission('user_management', 'create'),
  async (req, res) => {
    try {
      const { email, password, name, role, company, avatar } = req.body;
      
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
      
      // Validate role exists
      const roleExists = await Role.findOne({ name: role });
      if (!roleExists) {
        return res.status(400).json({ message: 'Invalid role specified' });
      }
      
      const user = new User({
        email,
        password,
        name,
        role,
        company,
        avatar
      });
      
      await user.save();
      
      // Return user without password
      const userResponse = await User.findById(user._id).select('-password');
      
      res.status(201).json(userResponse);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// Update user
router.put('/:id', 
  authenticateToken, 
  checkPermission('user_management', 'edit'),
  async (req, res) => {
    try {
      const { name, role, company, avatar, isActive } = req.body;
      
      // Validate role if provided
      if (role) {
        const roleExists = await Role.findOne({ name: role });
        if (!roleExists) {
          return res.status(400).json({ message: 'Invalid role specified' });
        }
      }
      
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { name, role, company, avatar, isActive },
        { new: true }
      ).select('-password');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// Reset user password
router.put('/:id/reset-password', 
  authenticateToken, 
  checkPermission('user_management', 'edit'),
  async (req, res) => {
    try {
      const { newPassword } = req.body;
      
      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }
      
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      
      await User.findByIdAndUpdate(req.params.id, { password: hashedPassword });
      
      res.json({ message: 'Password reset successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// Delete user
router.delete('/:id', 
  authenticateToken, 
  checkPermission('user_management', 'delete'),
  async (req, res) => {
    try {
      // Prevent deleting own account
      if (req.params.id === req.user._id.toString()) {
        return res.status(400).json({ message: 'Cannot delete your own account' });
      }
      
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Clean up user sessions
      await UserSession.deleteMany({ userId: req.params.id });
      
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// Get user activity/sessions
router.get('/:id/sessions', 
  authenticateToken, 
  checkPermission('user_management', 'view'),
  async (req, res) => {
    try {
      const sessions = await UserSession.find({ userId: req.params.id })
        .sort({ lastActivity: -1 })
        .limit(10);
      
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// Deactivate user sessions
router.post('/:id/deactivate-sessions', 
  authenticateToken, 
  checkPermission('user_management', 'edit'),
  async (req, res) => {
    try {
      await UserSession.updateMany(
        { userId: req.params.id },
        { isActive: false }
      );
      
      res.json({ message: 'All user sessions deactivated' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

export default router;