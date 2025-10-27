package com.carrental.carrental.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvailabilityStatsDTO {
    private Long total;
    private Long available;
    private Long booked;
    private Long maintenance;
    private Long blocked;
}