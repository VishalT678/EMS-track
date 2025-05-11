import { useState, useEffect } from 'react';
import { hospitalAPI } from '../lib/api';

interface Hospital {
  _id: string;
  name: string;
  address: string;
  contactNumber: string;
  emergencyContact: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  availableBeds: number;
  totalBeds: number;
  specialties: string[];
}

export const useHospitals = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const response = await hospitalAPI.getAll();
      setHospitals(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch hospitals');
    } finally {
      setLoading(false);
    }
  };

  const updateHospitalBeds = async (id: string, availableBeds: number) => {
    try {
      const response = await hospitalAPI.updateBeds(id, availableBeds);
      setHospitals((prevHospitals) =>
        prevHospitals.map((hospital) =>
          hospital._id === id ? response.data : hospital
        )
      );
      return response.data;
    } catch (err) {
      setError('Failed to update hospital beds');
      throw err;
    }
  };

  const createHospital = async (data: Omit<Hospital, '_id'>) => {
    try {
      const response = await hospitalAPI.create(data);
      setHospitals((prevHospitals) => [...prevHospitals, response.data]);
      return response.data;
    } catch (err) {
      setError('Failed to create hospital');
      throw err;
    }
  };

  const updateHospital = async (id: string, data: Partial<Hospital>) => {
    try {
      const response = await hospitalAPI.update(id, data);
      setHospitals((prevHospitals) =>
        prevHospitals.map((hospital) =>
          hospital._id === id ? response.data : hospital
        )
      );
      return response.data;
    } catch (err) {
      setError('Failed to update hospital');
      throw err;
    }
  };

  const deleteHospital = async (id: string) => {
    try {
      await hospitalAPI.delete(id);
      setHospitals((prevHospitals) =>
        prevHospitals.filter((hospital) => hospital._id !== id)
      );
    } catch (err) {
      setError('Failed to delete hospital');
      throw err;
    }
  };

  const getHospitalById = async (id: string) => {
    try {
      const response = await hospitalAPI.getById(id);
      return response.data;
    } catch (err) {
      setError('Failed to fetch hospital');
      throw err;
    }
  };

  return {
    hospitals,
    loading,
    error,
    fetchHospitals,
    updateHospitalBeds,
    createHospital,
    updateHospital,
    deleteHospital,
    getHospitalById,
  };
}; 