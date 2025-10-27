package com.carrental.carrental.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlockedPeriodDTO {
    private Long id;
    private Long vehicleId;
    private String vehicleDescription;
    private LocalDate startDate;
    private LocalDate endDate;
    private String reason;
    private LocalDate createdDate;
}