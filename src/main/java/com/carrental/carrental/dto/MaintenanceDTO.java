package com.carrental.carrental.dto;

import com.carrental.carrental.model.Maintenance;
import com.carrental.carrental.enums.MaintenanceStatus;
import java.math.BigDecimal;
import java.time.LocalDate;

public class MaintenanceDTO {
    private Long id;
    private VehicleDTO vehicle;
    private LocalDate maintenanceDate;
    private BigDecimal cost;
    private String issue;
    private MaintenanceStatus status;
    private LocalDate serviceDate;

    // Default constructor
    public MaintenanceDTO() {
    }

    // Constructor from Maintenance entity
    public MaintenanceDTO(Maintenance maintenance) {
        this.id = maintenance.getId();
        this.vehicle = new VehicleDTO(maintenance.getVehicle());
        this.maintenanceDate = maintenance.getMaintenanceDate();
        this.cost = maintenance.getCost();
        this.issue = maintenance.getIssue();
        this.status = maintenance.getStatus();
        this.serviceDate = maintenance.getServiceDate();
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public VehicleDTO getVehicle() {
        return vehicle;
    }

    public void setVehicle(VehicleDTO vehicle) {
        this.vehicle = vehicle;
    }

    public LocalDate getMaintenanceDate() {
        return maintenanceDate;
    }

    public void setMaintenanceDate(LocalDate maintenanceDate) {
        this.maintenanceDate = maintenanceDate;
    }

    public BigDecimal getCost() {
        return cost;
    }

    public void setCost(BigDecimal cost) {
        this.cost = cost;
    }

    public String getIssue() {
        return issue;
    }

    public void setIssue(String issue) {
        this.issue = issue;
    }

    public MaintenanceStatus getStatus() {
        return status;
    }

    public void setStatus(MaintenanceStatus status) {
        this.status = status;
    }

    public LocalDate getServiceDate() {
        return serviceDate;
    }

    public void setServiceDate(LocalDate serviceDate) {
        this.serviceDate = serviceDate;
    }
}