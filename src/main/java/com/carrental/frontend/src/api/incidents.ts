// src/api/incidents.ts

export interface IncidentReport {
    id: number;
    vehicleID: number;
    vehicleDescription: string;
    incidentDate: string;
    incidentType: string;
    severity: string;
    description: string;
    reporterName: string;
    status: string;
    estimatedCost: number;
    resolutionNotes: string;
    createdDate: string;
    updatedDate: string;
}

const API_BASE = "http://localhost:8080/api/incidents";

/**
 * Get all incident reports
 */
export const getIncidentReports = async (): Promise<IncidentReport[]> => {
    try {
        const response = await fetch(API_BASE);
        if (!response.ok) throw new Error("Failed to fetch incident reports");
        return await response.json();
    } catch (error) {
        console.error("Error fetching incident reports:", error);
        return [];
    }
};

/**
 * Get incident report by ID
 */
export const getIncidentReportById = async (id: number): Promise<IncidentReport | null> => {
    try {
        const response = await fetch(`${API_BASE}/${id}`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error('Error fetching incident report:', error);
        return null;
    }
};

/**
 * Create a new incident report
 */
export const createIncidentReport = async (incident: Omit<IncidentReport, 'id'>): Promise<IncidentReport | null> => {
    try {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(incident),
        });
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error('Error creating incident report:', error);
        return null;
    }
};

/**
 * Update an incident report
 */
export const updateIncidentReport = async (id: number, incident: Partial<IncidentReport>): Promise<IncidentReport | null> => {
    try {
        const response = await fetch(`${API_BASE}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(incident),
        });
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error('Error updating incident report:', error);
        return null;
    }
};

/**
 * Delete an incident report
 */
export const deleteIncidentReport = async (id: number): Promise<boolean> => {
    try {
        const response = await fetch(`${API_BASE}/${id}`, {
            method: 'DELETE',
        });
        return response.ok;
    } catch (error) {
        console.error('Error deleting incident report:', error);
        return false;
    }
};

/**
 * Get incidents by vehicle ID
 */
export const getIncidentsByVehicle = async (vehicleID: number): Promise<IncidentReport[]> => {
    try {
        const response = await fetch(`${API_BASE}/vehicle/${vehicleID}`);
        if (!response.ok) return [];
        return await response.json();
    } catch (error) {
        console.error('Error fetching incidents by vehicle:', error);
        return [];
    }
};

/**
 * Get incidents by status
 */
export const getIncidentsByStatus = async (status: string): Promise<IncidentReport[]> => {
    try {
        const response = await fetch(`${API_BASE}/status/${status}`);
        if (!response.ok) return [];
        return await response.json();
    } catch (error) {
        console.error('Error fetching incidents by status:', error);
        return [];
    }
};