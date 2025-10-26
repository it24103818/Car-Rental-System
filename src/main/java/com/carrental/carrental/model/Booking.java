package com.carrental.carrental.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "Booking")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    // @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BookingID")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CustomerID", nullable = false)
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "VehicleID", nullable = false) // Matches your DB FK
    private Vehicle vehicle;

    @Column(name = "CustomerName") // ADD THIS FIELD
    private String customerName;

    @NotNull(message = "Pickup date is required")
    @Column(name = "PickupDate", nullable = false)
    private LocalDate pickupDate;

    @NotNull(message = "Return date is required")
    @Column(name = "ReturnDate", nullable = false)
    private LocalDate returnDate;

    @Column(name = "PickupLocation")
    private String pickupLocation;

    @Column(name = "ReturnLocation")
    private String returnLocation;

    @Positive(message = "Total cost must be positive")
    @Column(name = "TotalCost", precision = 10, scale = 2)
    private BigDecimal totalCost;

    @Column(name = "BookingStatus", length = 30)
    private String bookingStatus = "Pending";
}