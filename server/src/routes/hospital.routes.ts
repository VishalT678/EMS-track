import express, { Response } from 'express';
import { body } from 'express-validator';
import { Hospital } from '../models/hospital.model';
import { validateRequest } from '../middleware/validate-request';
import { auth, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all hospitals
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const hospitals = await Hospital.find().select('-__v');
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hospitals' });
  }
});

// Get hospital by ID
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const hospital = await Hospital.findById(req.params.id).select('-__v');
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }
    res.json(hospital);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hospital' });
  }
});

// Create hospital (protected route)
router.post('/', [
  auth,
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('location.coordinates').isArray({ min: 2, max: 2 }).withMessage('Invalid coordinates'),
  body('totalBeds').isInt({ min: 0 }).withMessage('Total beds must be a positive number'),
  body('availableBeds').isInt({ min: 0 }).withMessage('Available beds must be a positive number'),
  body('contact').trim().notEmpty().withMessage('Contact is required'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  validateRequest
], async (req: AuthRequest, res: Response) => {
  try {
    const hospital = new Hospital({
      ...req.body,
      userId: req.user?.id
    });
    await hospital.save();
    res.status(201).json(hospital);
  } catch (error) {
    res.status(500).json({ message: 'Error creating hospital' });
  }
});

// Update hospital (protected route)
router.put('/:id', [
  auth,
  body('name').optional().trim().notEmpty(),
  body('location.coordinates').optional().isArray({ min: 2, max: 2 }),
  body('totalBeds').optional().isInt({ min: 0 }),
  body('availableBeds').optional().isInt({ min: 0 }),
  body('contact').optional().trim().notEmpty(),
  body('address').optional().trim().notEmpty(),
  validateRequest
], async (req: AuthRequest, res: Response) => {
  try {
    const hospital = await Hospital.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?.id },
      req.body,
      { new: true }
    );
    
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }
    
    res.json(hospital);
  } catch (error) {
    res.status(500).json({ message: 'Error updating hospital' });
  }
});

// Delete hospital (protected route)
router.delete('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const hospital = await Hospital.findOneAndDelete({
      _id: req.params.id,
      userId: req.user?.id
    });
    
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }
    
    res.json({ message: 'Hospital deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting hospital' });
  }
});

export default router; 