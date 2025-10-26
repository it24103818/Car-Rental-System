// BookingRepository.java
package com.carrental.carrental.repository;

import com.carrental.carrental.model.Booking;
import com.carrental.carrental.dto.BookingWithEmailDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    // ✅ Rename method: findByVehicleID -> findByVehicle_Id
    // This tells Spring Data: "Find by the 'id' field of the 'vehicle' object."
    List<Booking> findByCustomer_Id(Long customerId);
    List<Booking> findByVehicle_Id(Long vehicleId); // ✅ Fixed name

    @Query(value = "SELECT " +
            "b.BookingID as bookingID, " +
            "b.CustomerID as customerID, " +
            "b.VehicleID as vehicleID, " +
            "b.CustomerName as customerName, " +
            "ce.EmailAddress as customerEmail, " +
            "b.PickupDate as pickupDate, " +
            "b.ReturnDate as returnDate, " +
            "b.PickupLocation as pickupLocation, " +
            "b.ReturnLocation as returnLocation, " +
            "b.TotalCost as totalCost, " +
            "b.BookingStatus as bookingStatus " +
            "FROM Booking b " +
            "LEFT JOIN Customer_Email ce ON b.CustomerID = ce.CustomerID AND ce.IsPrimary = true",
            nativeQuery = true)
    List<BookingWithEmailDTO> findAllBookingsWithEmail();

    @Query(value = "SELECT " +
            "b.BookingID as bookingID, " +
            "b.CustomerID as customerID, " +
            "b.VehicleID as vehicleID, " +
            "b.CustomerName as customerName, " +
            "ce.EmailAddress as customerEmail, " +
            "b.PickupDate as pickupDate, " +
            "b.ReturnDate as returnDate, " +
            "b.PickupLocation as pickupLocation, " +
            "b.ReturnLocation as returnLocation, " +
            "b.TotalCost as totalCost, " +
            "b.BookingStatus as bookingStatus " +
            "FROM Booking b " +
            "LEFT JOIN Customer_Email ce ON b.CustomerID = ce.CustomerID AND ce.IsPrimary = true " +
            "WHERE b.BookingID = :bookingId",
            nativeQuery = true)
    Optional<BookingWithEmailDTO> findBookingWithEmailById(@Param("bookingId") Long bookingId);
}