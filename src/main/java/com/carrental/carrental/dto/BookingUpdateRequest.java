package com.carrental.carrental.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class BookingUpdateRequest {
    private LocalDate newStartDate;
    private LocalDate newEndDate;
}