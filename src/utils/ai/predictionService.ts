
import { pipeline } from '@huggingface/transformers';

// Configure transformers.js to always download models
const env = (window as any).transformers?.env;
if (env) {
  env.allowLocalModels = false;
  env.useBrowserCache = false;
}

export interface PredictionResult {
  estimatedArrivalTime: number;
  suggestedRoute: string;
  confidence: number;
}

export interface TrafficData {
  congestionLevel: number; // 0-1 scale
  roadClosures: string[];
  accidents: { location: string; severity: number }[];
}

export const predictArrivalTime = async (
  startLocation: { lat: number; lng: number },
  endLocation: { lat: number; lng: number },
  trafficData: TrafficData
): Promise<PredictionResult> => {
  try {
    // Calculate base time (mock implementation)
    const distance = Math.sqrt(
      Math.pow(endLocation.lat - startLocation.lat, 2) + 
      Math.pow(endLocation.lng - startLocation.lng, 2)
    ) * 111; // Rough km conversion

    // Adjust for traffic congestion
    const trafficMultiplier = 1 + (trafficData.congestionLevel * 1.5);
    
    // Adjust for road closures and accidents
    const incidentFactor = 
      (trafficData.roadClosures.length * 2) + 
      trafficData.accidents.reduce((sum, accident) => sum + accident.severity, 0);
    
    // Calculate estimated time
    const baseTime = distance * 2; // Assuming 30 km/h average speed
    const adjustedTime = baseTime * trafficMultiplier + incidentFactor;
    
    // Generate route suggestion
    let suggestedRoute = "Main St -> 5th Ave -> Hospital Drive";
    if (trafficData.congestionLevel > 0.7) {
      suggestedRoute = "Alternate route via Riverside Dr -> Bridge St -> Hospital Drive";
    }
    if (trafficData.roadClosures.length > 0) {
      suggestedRoute = "Detour via Commerce St -> Park Ave -> Hospital Drive";
    }
    
    // Calculate confidence based on data quality
    const confidence = 0.9 - (trafficData.congestionLevel * 0.2) - (trafficData.roadClosures.length * 0.05);
    
    return {
      estimatedArrivalTime: adjustedTime,
      suggestedRoute,
      confidence: Math.max(0.6, Math.min(0.95, confidence)) // Clamp between 0.6 and 0.95
    };
  } catch (error) {
    console.error('Error making prediction:', error);
    throw error;
  }
};

// Define proper interfaces for text classification results
interface TextClassificationItem {
  label: string;
  score: number;
}

type TextClassificationOutput = TextClassificationItem[];

// Define a type that represents what the classifier might return
type ClassifierResult = 
  | TextClassificationOutput 
  | TextClassificationItem 
  | { [key: string]: any };

export const analyzeMedicalEmergency = async (symptoms: string[]): Promise<string> => {
  try {
    const classifier = await pipeline(
      'text-classification',
      'Xenova/medical-symptom-classification',
      { device: 'webgpu' }
    );
    
    const result = await classifier(symptoms.join(', ')) as ClassifierResult;
    
    // Handle different possible return formats from the classifier
    if (Array.isArray(result) && result.length > 0) {
      // Handle array result
      const firstItem = result[0];
      return firstItem.label || 'Unable to analyze';
    } else if (typeof result === 'object' && result !== null) {
      // Handle single object result - safely access the label property
      if ('label' in result) {
        return result.label;
      }
    }
    
    return 'Unable to analyze';
  } catch (error) {
    console.error('Error analyzing medical emergency:', error);
    return 'Unable to analyze';
  }
};

export interface EmergencySeverity {
  level: 'Low' | 'Moderate' | 'Severe' | 'Critical';
  score: number;
  recommendedResources: string[];
}

export const assessEmergencySeverity = async (
  symptoms: string[],
  vitalSigns: { 
    heartRate?: number; 
    bloodPressure?: { systolic: number; diastolic: number }; 
    oxygenSaturation?: number;
    respiratoryRate?: number;
  }
): Promise<EmergencySeverity> => {
  try {
    // For now, use rule-based assessment until ML model is integrated
    let severityScore = 0;
    
    // Analyze symptoms
    const diagnosis = await analyzeMedicalEmergency(symptoms);
    
    // Add severity based on diagnosis
    if (diagnosis.toLowerCase().includes('cardiac')) severityScore += 40;
    if (diagnosis.toLowerCase().includes('stroke')) severityScore += 45;
    if (diagnosis.toLowerCase().includes('trauma')) severityScore += 35;
    if (diagnosis.toLowerCase().includes('respiratory')) severityScore += 30;
    if (diagnosis.toLowerCase().includes('burn')) severityScore += 25;
    
    // Add severity based on vital signs
    if (vitalSigns.heartRate) {
      if (vitalSigns.heartRate > 120 || vitalSigns.heartRate < 50) severityScore += 20;
    }
    
    if (vitalSigns.bloodPressure) {
      if (vitalSigns.bloodPressure.systolic > 180 || vitalSigns.bloodPressure.systolic < 90) severityScore += 20;
    }
    
    if (vitalSigns.oxygenSaturation) {
      if (vitalSigns.oxygenSaturation < 90) severityScore += 25;
    }
    
    if (vitalSigns.respiratoryRate) {
      if (vitalSigns.respiratoryRate > 30 || vitalSigns.respiratoryRate < 10) severityScore += 20;
    }
    
    // Determine severity level
    let level: 'Low' | 'Moderate' | 'Severe' | 'Critical' = 'Low';
    if (severityScore > 80) level = 'Critical';
    else if (severityScore > 50) level = 'Severe';
    else if (severityScore > 30) level = 'Moderate';
    
    // Recommend resources
    const recommendedResources = [];
    if (level === 'Critical') {
      recommendedResources.push('Advanced Life Support', 'Trauma Team', 'Specialized Equipment');
    } else if (level === 'Severe') {
      recommendedResources.push('Advanced Life Support', 'Trauma Team');
    } else if (level === 'Moderate') {
      recommendedResources.push('Basic Life Support', 'Medical Doctor');
    } else {
      recommendedResources.push('Basic Life Support');
    }
    
    return {
      level,
      score: severityScore,
      recommendedResources
    };
  } catch (error) {
    console.error('Error assessing emergency severity:', error);
    return {
      level: 'Moderate', // Default to moderate if assessment fails
      score: 40,
      recommendedResources: ['Basic Life Support', 'Medical Doctor']
    };
  }
};

export interface HospitalBedPrediction {
  hospitalId: number;
  predictedAvailableIn1Hour: number;
  predictedAvailableIn3Hours: number;
  dischargeRate: number;
  admissionRate: number;
  confidence: number;
}

export const predictHospitalBedAvailability = (
  hospitals: {
    id: number;
    beds: { total: number; available: number };
    er: { waitTime: number; capacity: number };
    ambulancesEnRoute: number;
  }[]
): HospitalBedPrediction[] => {
  return hospitals.map(hospital => {
    // Calculate current rates
    const admissionRate = (hospital.er.capacity / 100) * 0.3; // 30% of ER patients get admitted
    const dischargeRate = hospital.beds.total * 0.08; // 8% of beds get discharged per hour
    
    // Calculate predictions
    const incomingPatients = hospital.ambulancesEnRoute * 0.8; // 80% of incoming ambulances will need beds
    const pendingAdmissions = Math.ceil(admissionRate * 2); // Estimate based on current admission rate
    
    // Calculate hourly changes
    const hourlyNetChange = Math.round(dischargeRate - admissionRate - (incomingPatients / 3));
    
    // Predict future availability
    const availableIn1Hour = Math.max(0, hospital.beds.available + hourlyNetChange);
    const availableIn3Hours = Math.max(0, availableIn1Hour + (hourlyNetChange * 2));
    
    // Calculate confidence based on ER capacity and current bed availability
    const confidence = 0.9 - (hospital.er.capacity / 200) - (hospital.ambulancesEnRoute * 0.03);
    
    return {
      hospitalId: hospital.id,
      predictedAvailableIn1Hour: availableIn1Hour,
      predictedAvailableIn3Hours: availableIn3Hours,
      dischargeRate: Math.round(dischargeRate * 10) / 10,
      admissionRate: Math.round(admissionRate * 10) / 10,
      confidence: Math.max(0.6, Math.min(0.95, confidence)) // Clamp between 0.6 and 0.95
    };
  });
};
