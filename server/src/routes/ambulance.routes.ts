import express, { Response } from 'express';
import { body } from 'express-validator';
import { Ambulance } from '../models/ambulance.model';
import { validateRequest } from '../middleware/validate-request';
import { auth, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all ambulances
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const ambulances = await Ambulance.find()
      .populate('hospitalId', 'name location')
      .select('-__v');
    res.json(ambulances);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ambulances' });
  }
});

// Get ambulance by ID
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const ambulance = await Ambulance.findById(req.params.id)
      .populate('hospitalId', 'name location')
      .select('-__v');
    
    if (!ambulance) {
      return res.status(404).json({ message: 'Ambulance not found' });
    }
    
    res.json(ambulance);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ambulance' });
  }
});

// Create ambulance (protected route)
router.post('/', [
  auth,
  body('vehicleNumber').trim().notEmpty().withMessage('Vehicle number is required'),
  body('location.coordinates').isArray({ min: 2, max: 2 }).withMessage('Invalid coordinates'),
  body('status').isIn(['available', 'busy', 'maintenance']).withMessage('Invalid status'),
  body('hospitalId').optional().isMongoId().withMessage('Invalid hospital ID'),
  validateRequest
], async (req: AuthRequest, res: Response) => {
  try {
    const ambulance = new Ambulance({
      ...req.body,
      userId: req.user?.id
    });
    await ambulance.save();
    res.status(201).json(ambulance);
  } catch (error) {
    res.status(500).json({ message: 'Error creating ambulance' });
  }
});

// Update ambulance location (protected route)
router.patch('/:id/location', [
  auth,
  body('location.coordinates').isArray({ min: 2, max: 2 }).withMessage('Invalid coordinates'),
  validateRequest
], async (req: AuthRequest, res: Response) => {
  try {
    const ambulance = await Ambulance.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?.id },
      { location: req.body.location },
      { new: true }
    );
    
    if (!ambulance) {
      return res.status(404).json({ message: 'Ambulance not found' });
    }
    
    res.json(ambulance);
  } catch (error) {
    res.status(500).json({ message: 'Error updating ambulance location' });
  }
});

// Update ambulance status (protected route)
router.patch('/:id/status', [
  auth,
  body('status').isIn(['available', 'busy', 'maintenance']).withMessage('Invalid status'),
  validateRequest
], async (req: AuthRequest, res: Response) => {
  try {
    const ambulance = await Ambulance.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?.id },
      { status: req.body.status },
      { new: true }
    );
    
    if (!ambulance) {
      return res.status(404).json({ message: 'Ambulance not found' });
    }
    
    res.json(ambulance);
  } catch (error) {
    res.status(500).json({ message: 'Error updating ambulance status' });
  }
});

// Delete ambulance (protected route)
router.delete('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const ambulance = await Ambulance.findOneAndDelete({
      _id: req.params.id,
      userId: req.user?.id
    });
    
    if (!ambulance) {
      return res.status(404).json({ message: 'Ambulance not found' });
    }
    
    res.json({ message: 'Ambulance deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting ambulance' });
  }
});

export default router; 