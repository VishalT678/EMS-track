import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import authRoutes from './routes/auth.routes';
import mapRoutes from './routes/map.routes';
import hospitalRoutes from './routes/hospital.routes';
import ambulanceRoutes from './routes/ambulance.routes';
import testRoutes from './routes/test.routes';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/map', mapRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/ambulances', ambulanceRoutes);
app.use('/api/test', testRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 