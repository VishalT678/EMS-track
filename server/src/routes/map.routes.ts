import express from 'express';
import { body } from 'express-validator';
import { Hospital } from '../models/hospital.model';
import { Ambulance } from '../models/ambulance.model';
import { validateRequest } from '../middleware/validate-request';
import { CustomRequest, CustomResponse } from '../types/express';

const router = express.Router();

// Find nearest hospitals
router.post('/nearest-hospitals', [
  body('location.coordinates').isArray({ min: 2, max: 2 }),
  body('maxDistance').optional().isInt({ min: 1000 }),
  validateRequest
], async (req: CustomRequest, res: CustomResponse) => {
  try {
    const { coordinates, maxDistance = 5000 } = req.body;
    
    const hospitals = await Hospital.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates
          },
          $maxDistance: maxDistance
        }
      }
    });

    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: 'Error finding nearest hospitals' });
  }
});

// Find nearest available ambulances
router.post('/nearest-ambulances', [
  body('location.coordinates').isArray({ min: 2, max: 2 }),
  body('maxDistance').optional().isInt({ min: 1000 }),
  validateRequest
], async (req: CustomRequest, res: CustomResponse) => {
  try {
    const { coordinates, maxDistance = 5000 } = req.body;
    
    const ambulances = await Ambulance.find({
      status: 'available',
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates
          },
          $maxDistance: maxDistance
        }
      }
    }).populate('hospitalId');

    res.json(ambulances);
  } catch (error) {
    res.status(500).json({ message: 'Error finding nearest ambulances' });
  }
});

// Get hospitals with available beds
router.post('/hospitals-with-beds', [
  body('location.coordinates').isArray({ min: 2, max: 2 }),
  body('maxDistance').optional().isInt({ min: 1000 }),
  body('minBeds').optional().isInt({ min: 1 }),
  validateRequest
], async (req: CustomRequest, res: CustomResponse) => {
  try {
    const { coordinates, maxDistance = 5000, minBeds = 1 } = req.body;
    
    const hospitals = await Hospital.find({
      availableBeds: { $gte: minBeds },
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates
          },
          $maxDistance: maxDistance
        }
      }
    });

    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: 'Error finding hospitals with available beds' });
  }
});

export default router; 