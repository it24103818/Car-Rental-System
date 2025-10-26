// BookingService.java
package com.carrental.carrental.service;

import com.carrental.carrental.dto.BookingWithEmailDTO;
import com.carrental.carrental.model.Booking;
import com.carrental.carrental.repository.BookingRepository;
import com.carrental.carrental.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.springframework.http.HttpStatus.*;

@Service
@Transactional
public class BookingService {
    private final BookingRepository bookingRepository;
    private final VehicleRepository vehicleRepository;

    public BookingService(BookingRepository bookingRepository,
                          VehicleRepository vehicleRepository) {
        this.bookingRepository = bookingRepository;
        this.vehicleRepository = vehicleRepository;
    }

    public Booking createBooking(Booking booking) {
        // Validate vehicle availability
        if (booking.getVehicle() == null) {
            throw new ResponseStatusException(BAD_REQUEST, "Vehicle ID is required");
        }
        // Fetch Vehicle by ID from the booking object
        // If you need to check availability, you might need to add a method to VehicleRepository
        // For now, assume it's valid or add validation later.
        // Vehicle vehicle = vehicleRepository.findById(booking.getVehicleID())
        //         .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Vehicle not found"));

        // Set default status if not provided
        if (booking.getBookingStatus() == null) {
            booking.setBookingStatus("ACTIVE");
        }

        // Update vehicle status (if needed, you'll need to implement this logic)
        // vehicle.setStatus(VehicleStatus.RENTED);
        // vehicleRepository.save(vehicle);

        return bookingRepository.save(booking);
    }

    public Booking updateBooking(Booking booking) {
        if (!bookingRepository.existsById(booking.getId())) {
            throw new ResponseStatusException(NOT_FOUND, "Booking not found");
        }
        return bookingRepository.save(booking);
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Booking not found"));
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<BookingWithEmailDTO> getAllBookingsWithEmail() {
        return bookingRepository.findAllBookingsWithEmail();
    }

    @Transactional(readOnly = true)
    public BookingWithEmailDTO getBookingWithEmailById(Long id) {
        return bookingRepository.findBookingWithEmailById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Booking not found with ID: " + id));
    }

    public Booking cancelBooking(Long id) {
        Booking booking = getBookingById(id);
        if ("CANCELLED".equals(booking.getBookingStatus())) {
            throw new ResponseStatusException(BAD_REQUEST, "Booking already cancelled");
        }
        booking.setBookingStatus("CANCELLED");

        // Make vehicle available again (if needed, implement this logic)
        // Vehicle vehicle = vehicleRepository.findById(booking.getVehicleID())
        //         .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Vehicle not found"));
        // vehicle.setStatus(VehicleStatus.AVAILABLE);
        // vehicleRepository.save(vehicle);

        return bookingRepository.save(booking);
    }

    public void deleteBooking(Long id) {
        Booking booking = getBookingById(id);
        // If the booking is active, make the vehicle available again (if needed)
        // if ("ACTIVE".equals(booking.getBookingStatus())) {
        //     Vehicle vehicle = vehicleRepository.findById(booking.getVehicleID())
        //             .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Vehicle not found"));
        //     vehicle.setStatus(VehicleStatus.AVAILABLE);
        //     vehicleRepository.save(vehicle);
        // }
        bookingRepository.delete(booking);
    }

    @Transactional(readOnly = true)
    public List<Booking> getBookingsByCustomerId(Long customerId) {
        return bookingRepository.findByCustomer_Id(customerId); // Updated method name
    }

    @Transactional(readOnly = true)
    public List<Booking> getBookingsByVehicleId(Long vehicleId) {
        return bookingRepository.findByVehicle_Id(vehicleId); // Updated method name
    }
}