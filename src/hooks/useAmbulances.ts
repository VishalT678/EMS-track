import { useState, useEffect } from 'react';
import { ambulanceAPI } from '../lib/api';
import { io, Socket } from 'socket.io-client';

interface Ambulance {
  _id: string;
  vehicleNumber: string;
  driverName: string;
  driverContact: string;
  status: 'available' | 'busy' | 'maintenance';
  location: {
    type: string;
    coordinates: [number, number];
  };
  hospitalId: {
    _id: string;
    name: string;
  };
}

export const useAmbulances = () => {
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');
    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      // Listen for ambulance location updates
      socket.on('ambulance-location-updated', (updatedAmbulance: Ambulance) => {
        setAmbulances((prevAmbulances) =>
          prevAmbulances.map((ambulance) =>
            ambulance._id === updatedAmbulance._id ? updatedAmbulance : ambulance
          )
        );
      });
    }
  }, [socket]);

  const fetchAmbulances = async () => {
    try {
      setLoading(true);
      const response = await ambulanceAPI.getAll();
      setAmbulances(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch ambulances');
    } finally {
      setLoading(false);
    }
  };

  const updateAmbulanceLocation = async (id: string, location: { coordinates: [number, number] }) => {
    try {
      const response = await ambulanceAPI.updateLocation(id, location);
      setAmbulances((prevAmbulances) =>
        prevAmbulances.map((ambulance) =>
          ambulance._id === id ? response.data : ambulance
        )
      );
      return response.data;
    } catch (err) {
      setError('Failed to update ambulance location');
      throw err;
    }
  };

  const updateAmbulanceStatus = async (id: string, status: string) => {
    try {
      const response = await ambulanceAPI.updateStatus(id, status);
      setAmbulances((prevAmbulances) =>
        prevAmbulances.map((ambulance) =>
          ambulance._id === id ? response.data : ambulance
        )
      );
      return response.data;
    } catch (err) {
      setError('Failed to update ambulance status');
      throw err;
    }
  };

  const createAmbulance = async (data: Omit<Ambulance, '_id'>) => {
    try {
      const response = await ambulanceAPI.create(data);
      setAmbulances((prevAmbulances) => [...prevAmbulances, response.data]);
      return response.data;
    } catch (err) {
      setError('Failed to create ambulance');
      throw err;
    }
  };

  const deleteAmbulance = async (id: string) => {
    try {
      await ambulanceAPI.delete(id);
      setAmbulances((prevAmbulances) =>
        prevAmbulances.filter((ambulance) => ambulance._id !== id)
      );
    } catch (err) {
      setError('Failed to delete ambulance');
      throw err;
    }
  };

  return {
    ambulances,
    loading,
    error,
    fetchAmbulances,
    updateAmbulanceLocation,
    updateAmbulanceStatus,
    createAmbulance,
    deleteAmbulance,
  };
}; 