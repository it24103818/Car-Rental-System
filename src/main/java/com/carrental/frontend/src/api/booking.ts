// src/api/bookings.ts

export interface Booking {
    id: number;
    customerID: number;
    vehicleID: number;
    customerName: string;
    pickupDate: string;
    returnDate: string;
    pickupLocation: string;
    returnLocation: string;
    totalCost: number;
    bookingStatus: string;
}

export interface BookingWithEmail {
    bookingID: number;
    customerID: number;
    vehicleID: number;
    customerName: string;
    customerEmail: string;
    pickupDate: string;
    returnDate: string;
    pickupLocation: string;
    returnLocation: string;
    totalCost: number;
    bookingStatus: string;
}

const API_BASE = "http://localhost:8080/api/bookings"

/**
 * Get all bookings with customer email
 */
export const getBookingsWithEmail = async (): Promise<BookingWithEmail[]> => {
    try {
        const response = await fetch(API_BASE);
        if (!response.ok) throw new Error("Failed to fetch bookings");
        return await response.json();
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return [];
    }
};

/**
 * Get booking by ID with email
 */
export const getBookingById = async (id: number): Promise<BookingWithEmail | null> => {
    try {
        const response = await fetch(`${API_BASE}/${id}`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error('Error fetching booking:', error);
        return null;
    }
};

/**
 * Create a new booking
 */
export const createBooking = async (booking: Booking): Promise<Booking | null> => {
    try {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(booking),
        });
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error('Error creating booking:', error);
        return null;
    }
};

/**
 * Update a booking
 */
export const updateBooking = async (id: number, booking: Booking): Promise<Booking | null> => {
    try {
        const response = await fetch(`${API_BASE}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(booking),
        });
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error('Error updating booking:', error);
        return null;
    }
};

/**
 * Delete a booking
 */
export const deleteBooking = async (id: number): Promise<boolean> => {
    try {
        const response = await fetch(`${API_BASE}/${id}`, {
            method: 'DELETE',
        });
        return response.ok;
    } catch (error) {
        console.error('Error deleting booking:', error);
        return false;
    }
};