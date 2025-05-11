import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/test-db', async (req, res) => {
  try {
    // Check if MongoDB is connected
    const isConnected = mongoose.connection.readyState === 1;
    
    if (isConnected && mongoose.connection.db) {
      // Try to list all collections
      const collections = await mongoose.connection.db.listCollections().toArray();
      
      res.json({
        status: 'success',
        message: 'Database connection successful',
        collections: collections.map(col => col.name)
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Database not connected'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error testing database connection',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 