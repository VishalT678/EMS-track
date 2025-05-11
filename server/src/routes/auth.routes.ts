import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.model';
import { validateRequest } from '../middleware/validate-request';
import { CustomRequest, CustomResponse } from '../types/express';

const router = express.Router();

// Register route
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').isIn(['hospital', 'ambulance']).withMessage('Role must be either hospital or ambulance'),
  validateRequest
], async (req: Request, res: Response) => {
  try {
    console.log('Registration attempt:', { email: req.body.email, role: req.body.role });
    
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Registration failed: Email already exists:', email);
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Create new user
    const user = new User({ name, email, password, role });
    
    // Log the user object before saving (without password)
    console.log('Attempting to save user:', {
      name: user.name,
      email: user.email,
      role: user.role
    });
    
    await user.save();
    console.log('User saved successfully');

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    console.log('JWT token generated successfully');

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Stack trace:', error.stack);
    }
    res.status(500).json({ 
      message: 'Error registering user',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Login route
router.post('/login', [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').trim().notEmpty().withMessage('Password is required'),
  validateRequest
], async (req: Request, res: Response) => {
  try {
    console.log('Login attempt for email:', req.body.email);
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Login failed: User not found with email:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    console.log('Checking password...');
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Login failed: Invalid password for email:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Password verified, generating token...');
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    console.log('Login successful for user:', email);
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Stack trace:', error.stack);
    }
    res.status(500).json({ 
      message: 'Error logging in',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get current user
router.get('/me', async (req: CustomRequest, res: CustomResponse) => {
  try {
    console.log('Fetching current user...');
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      console.log('No token provided in request');
      return res.status(401).json({ message: 'No token provided' });
    }

    console.log('Verifying token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; role: string };
    console.log('Token verified, fetching user with ID:', decoded.id);
    
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      console.log('User not found with ID:', decoded.id);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found successfully');
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Error in /me route:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Stack trace:', error.stack);
    }
    res.status(401).json({ message: 'Invalid token' });
  }
});

export default router; 