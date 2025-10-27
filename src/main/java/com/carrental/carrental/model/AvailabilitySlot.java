package com.carrental.carrental.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class AvailabilitySlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "car_id")
    private Vehicle vehicle;

    private LocalDateTime startDate;
    private LocalDateTime endDate;
}

