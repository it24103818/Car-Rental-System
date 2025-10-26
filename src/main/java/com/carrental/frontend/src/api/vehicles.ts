// src/api/vehicles.ts

export interface Vehicle {
    id: number;
    licensePlate: string;
    make: string;
    model: string;
    year: number;
    colour: string;
    mileageLimitPerDay?: number;
    weeklyRate?: number;
    status?: string;
}
const API_BASE = "http://localhost:8080/api/vehicles";
/**
 * Check if a vehicle exists by ID
 */
export const checkVehicleExists = async (vehicleId: number): Promise<boolean> => {
    try {
        const response = await fetch(`${API_BASE}/${vehicleId}/exists`);
        if (!response.ok) return false;
        return await response.json();
    } catch (error) {
        console.error("Error checking vehicle:", error);
        return false;
    }
};

/**
 * Get all vehicles
 */
export const getVehicles = async (): Promise<Vehicle[]> => {
    try {
        const response = await fetch(API_BASE);
        if (!response.ok) throw new Error("Failed to fetch vehicles");
        return await response.json();
    } catch (error) {
        console.error("Error fetching vehicles:", error);
        return [];
    }
};

/**
 * Get vehicle by ID
 */
export const getVehicleById = async (id: number): Promise<Vehicle | null> => {
    try {
        const response = await fetch(`/api/vehicles/${id}`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error('Error fetching vehicle:', error);
        return null;
    }
};

/**
 * Create a new vehicle
 */
export const createVehicle = async (vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle | null> => {
    try {
        const response = await fetch('/api/vehicles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(vehicle),
        });
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error('Error creating vehicle:', error);
        return null;
    }
};

/**
 * Update a vehicle
 */
export const updateVehicle = async (id: number, vehicle: Partial<Vehicle>): Promise<Vehicle | null> => {
    try {
        const response = await fetch(`/api/vehicles/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(vehicle),
        });
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error('Error updating vehicle:', error);
        return null;
    }
};

/**
 * Delete a vehicle
 */
export const deleteVehicle = async (id: number): Promise<boolean> => {
    try {
        const response = await fetch(`/api/vehicles/${id}`, {
            method: 'DELETE',
        });
        return response.ok;
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        return false;
    }
};