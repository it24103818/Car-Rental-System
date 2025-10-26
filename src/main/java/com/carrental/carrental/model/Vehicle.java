package com.carrental.carrental.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Vehicle")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "VehicleID")
    private Long id;   // renamed from vehicleID — aligns with getId() and setId()

    @NotBlank(message = "License plate is required")
    @Column(name = "LicensePlate", unique = true)
    private String licensePlate;

    @NotBlank(message = "Make is required")
    @Column(name = "Make")
    private String make;

    @NotBlank(message = "Model is required")
    @Column(name = "Model")
    private String model;

    @NotNull(message = "Year is required")
    @Column(name = "Year")
    private Integer year;

    @Column(name = "Colour")
    private String colour;

    @DecimalMin(value = "0.0", message = "Mileage limit per day must be positive")
    @Column(name = "MileageLimitPerDay")
    private BigDecimal mileageLimitPerDay;

    @NotNull(message = "Weekly rate is required")
    @DecimalMin(value = "0.01", message = "Weekly rate must be positive")
    @Column(name = "WeeklyRate")
    private BigDecimal weeklyRate;


    @Column(name = "status", length = 20)
    private String status;
}
