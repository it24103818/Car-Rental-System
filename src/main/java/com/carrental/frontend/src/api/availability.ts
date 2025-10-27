// src/api/availability.ts

export interface VehicleAvailability {
    id: number;
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    status: 'AVAILABLE' | 'RENTED' | 'MAINTENANCE' | 'BLOCKED';
    currentBooking?: {
        customer: string;
        startDate: string;
        endDate: string;
    };
    nextAvailable: string;
    maintenanceScheduled?: string;
}

export interface BlockedPeriod {
    id: number;
    vehicleId: number;
    vehicleDescription: string;
    startDate: string;
    endDate: string;
    reason: string;
    createdDate: string;
}

export interface AvailabilityStats {
    total: number;
    available: number;
    booked: number;
    maintenance: number;
    blocked: number;
}

export interface BlockVehicleRequest {
    vehicleId: number;
    startDate: string;
    endDate: string;
    reason: string;
}

const API_BASE = "http://localhost:8080/api/availability";

/**
 * Get availability statistics
 */
export const getAvailabilityStats = async (): Promise<AvailabilityStats> => {
    try {
        const response = await fetch(`${API_BASE}/stats`);
        if (!response.ok) throw new Error("Failed to fetch availability stats");
        return await response.json();
    } catch (error) {
        console.error("Error fetching availability stats:", error);
        return { total: 0, available: 0, booked: 0, maintenance: 0, blocked: 0 };
    }
};

/**
 * Get all vehicles with availability information
 */
export const getAllVehiclesWithAvailability = async (): Promise<VehicleAvailability[]> => {
    try {
        const response = await fetch(`${API_BASE}/vehicles`);
        if (!response.ok) throw new Error("Failed to fetch vehicles with availability");
        return await response.json();
    } catch (error) {
        console.error("Error fetching vehicles with availability:", error);
        return [];
    }
};

/**
 * Get vehicles by status
 */
export const getVehiclesByStatus = async (status: string): Promise<VehicleAvailability[]> => {
    try {
        const response = await fetch(`${API_BASE}/vehicles/${status}`);
        if (!response.ok) throw new Error(`Failed to fetch vehicles with status: ${status}`);
        return await response.json();
    } catch (error) {
        console.error(`Error fetching vehicles with status ${status}:`, error);
        return [];
    }
};

/**
 * Get all blocked periods
 */
export const getAllBlockedPeriods = async (): Promise<BlockedPeriod[]> => {
    try {
        const response = await fetch(`${API_BASE}/blocked-periods`);
        if (!response.ok) throw new Error("Failed to fetch blocked periods");
        return await response.json();
    } catch (error) {
        console.error("Error fetching blocked periods:", error);
        return [];
    }
};

/**
 * Block a vehicle
 */
export const blockVehicle = async (request: BlockVehicleRequest): Promise<BlockedPeriod | null> => {
    try {
        const response = await fetch(`${API_BASE}/block`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error('Error blocking vehicle:', error);
        return null;
    }
};

/**
 * Unblock a vehicle
 */
export const unblockVehicle = async (vehicleId: number): Promise<boolean> => {
    try {
        const response = await fetch(`${API_BASE}/unblock/vehicle/${vehicleId}`, {
            method: 'DELETE',
        });
        return response.ok;
    } catch (error) {
        console.error('Error unblocking vehicle:', error);
        return false;
    }
};

/**
 * Unblock a specific period
 */
export const unblockPeriod = async (blockId: number): Promise<boolean> => {
    try {
        const response = await fetch(`${API_BASE}/unblock/period/${blockId}`, {
            method: 'DELETE',
        });
        return response.ok;
    } catch (error) {
        console.error('Error unblocking period:', error);
        return false;
    }
};

/**
 * Check vehicle availability for specific dates
 */
export const checkVehicleAvailability = async (
    vehicleId: number,
    startDate: string,
    endDate: string
): Promise<boolean> => {
    try {
        const response = await fetch(
            `${API_BASE}/check-availability?vehicleId=${vehicleId}&startDate=${startDate}&endDate=${endDate}`
        );
        if (!response.ok) return false;
        return await response.json();
    } catch (error) {
        console.error('Error checking vehicle availability:', error);
        return false;
    }
};