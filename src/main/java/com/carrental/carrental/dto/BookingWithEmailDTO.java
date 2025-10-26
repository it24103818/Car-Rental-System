package com.carrental.carrental.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingWithEmailDTO {
    private Long bookingID;
    private Long customerID;
    private Long vehicleID;
    private String customerName;
    private String customerEmail;
    private LocalDate pickupDate;
    private LocalDate returnDate;
    private String pickupLocation;
    private String returnLocation;
    private BigDecimal totalCost;
    private String bookingStatus;
}