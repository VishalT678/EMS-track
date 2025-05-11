import mongoose, { Schema, Document } from 'mongoose';

export interface IAmbulance extends Document {
  vehicleNumber: string;
  status: 'available' | 'busy' | 'maintenance';
  location: {
    type: string;
    coordinates: [number, number];
  };
  hospitalId: mongoose.Types.ObjectId | null;
  userId: mongoose.Types.ObjectId;
}

const ambulanceSchema = new Schema<IAmbulance>({
  vehicleNumber: {
    type: String,
    required: [true, 'Vehicle number is required'],
    unique: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['available', 'busy', 'maintenance'],
    required: [true, 'Status is required'],
    default: 'available'
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: (value: number[]) => value.length === 2,
        message: 'Coordinates must be an array of two numbers [longitude, latitude]'
      }
    }
  },
  hospitalId: {
    type: Schema.Types.ObjectId,
    ref: 'Hospital',
    default: null
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Create geospatial index
ambulanceSchema.index({ location: '2dsphere' });
// Create index for status
ambulanceSchema.index({ status: 1 });

export const Ambulance = mongoose.model<IAmbulance>('Ambulance', ambulanceSchema); 