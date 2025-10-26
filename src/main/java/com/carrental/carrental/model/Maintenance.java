package com.carrental.carrental.model;

import com.carrental.carrental.enums.MaintenanceStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Data
@Table(name = "Maintenance")
public class Maintenance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MaintenanceID")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "VehicleID", nullable = false)
    private Vehicle vehicle;

    @Column(name = "MaintenanceDate", nullable = false)
    private LocalDate maintenanceDate;

    @Column(name = "MechanicName")
    private String mechanicName;

    @Column(name = "Cost", precision = 10, scale = 2)
    private BigDecimal cost;

    @Column(name = "issue", columnDefinition = "TEXT")
    private String issue;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private MaintenanceStatus status = MaintenanceStatus.PENDING;

    @Column(name = "service_date")
    private LocalDate serviceDate;

}
