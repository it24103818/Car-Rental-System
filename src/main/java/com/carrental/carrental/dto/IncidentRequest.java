package com.carrental.carrental.dto;


import lombok.Data;

import java.time.LocalDateTime;

@Data
public class IncidentRequest {
    private String description;
    private LocalDateTime incidentDate;
    private Long rentalId;
    private Long vehicleId;
    private Long customerId;
}
