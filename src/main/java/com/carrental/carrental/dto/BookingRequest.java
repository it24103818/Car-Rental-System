package com.carrental.carrental.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {
    private Long carId;
    private LocalDate startDate;
    private LocalDate endDate;
    private String pickupLocation;
    private String returnLocation;
    private BigDecimal totalCost;

    // If you need customer information in the request
    private String customerName;
    private String customerEmail;
}