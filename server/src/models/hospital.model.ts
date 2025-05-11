import mongoose, { Schema, Document } from 'mongoose';

export interface IHospital extends Document {
  name: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  totalBeds: number;
  availableBeds: number;
  contact: string;
  address: string;
  userId: mongoose.Types.ObjectId;
}

const hospitalSchema = new Schema<IHospital>({
  name: {
    type: String,
    required: [true, 'Hospital name is required'],
    trim: true
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
  totalBeds: {
    type: Number,
    required: [true, 'Total beds count is required'],
    min: [0, 'Total beds cannot be negative']
  },
  availableBeds: {
    type: Number,
    required: [true, 'Available beds count is required'],
    min: [0, 'Available beds cannot be negative'],
    validate: {
      validator: function(this: IHospital, value: number) {
        return value <= this.totalBeds;
      },
      message: 'Available beds cannot exceed total beds'
    }
  },
  contact: {
    type: String,
    required: [true, 'Contact number is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
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
hospitalSchema.index({ location: '2dsphere' });

export const Hospital = mongoose.model<IHospital>('Hospital', hospitalSchema); 