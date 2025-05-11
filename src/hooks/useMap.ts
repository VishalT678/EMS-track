import { useState } from 'react';
import { mapAPI } from '../lib/api';

interface Location {
  coordinates: [number, number];
}

interface Hospital {
  _id: string;
  name: string;
  address: string;
  location: Location;
  availableBeds: number;
  totalBeds: number;
}

interface Ambulance {
  _id: string;
  vehicleNumber: string;
  status: string;
  location: Location;
  hospitalId: {
    _id: string;
    name: string;
  };
}

export const useMap = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const findNearestHospitals = async (location: Location, maxDistance?: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await mapAPI.getNearestHospitals(location, maxDistance);
      return response.data as Hospital[];
    } catch (err) {
      setError('Failed to find nearest hospitals');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const findNearestAmbulances = async (location: Location, maxDistance?: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await mapAPI.getNearestAmbulances(location, maxDistance);
      return response.data as Ambulance[];
    } catch (err) {
      setError('Failed to find nearest ambulances');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const findHospitalsWithBeds = async (
    location: Location,
    maxDistance?: number,
    minBeds?: number
  ) => {
    try {
      setLoading(true);
      setError(null);
      const response = await mapAPI.getHospitalsWithBeds(location, maxDistance, minBeds);
      return response.data as Hospital[];
    } catch (err) {
      setError('Failed to find hospitals with available beds');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (point1: Location, point2: Location) => {
    const [lat1, lon1] = point1.coordinates;
    const [lat2, lon2] = point2.coordinates;

    const R = 6371; // Earth's radius in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };

  const toRad = (value: number) => {
    return (value * Math.PI) / 180;
  };

  return {
    loading,
    error,
    findNearestHospitals,
    findNearestAmbulances,
    findHospitalsWithBeds,
    calculateDistance,
  };
}; 