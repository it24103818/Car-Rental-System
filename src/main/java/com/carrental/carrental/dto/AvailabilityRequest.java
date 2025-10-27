package com.carrental.carrental.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AvailabilityRequest {
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}
