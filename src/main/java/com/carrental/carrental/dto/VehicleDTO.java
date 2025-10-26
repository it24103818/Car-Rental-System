package com.carrental.carrental.dto;

import com.carrental.carrental.model.Vehicle;
import java.math.BigDecimal;

public class VehicleDTO {
    private Long id;
    private String licensePlate;
    private String make;
    private String model;
    private Integer year;
    private String colour;
    private BigDecimal mileageLimitPerDay;
    private BigDecimal weeklyRate;
    private String status;

    // Constructors
    public VehicleDTO() {
    }

    public VehicleDTO(Vehicle vehicle) {
        this.id = vehicle.getId();
        this.licensePlate = vehicle.getLicensePlate();
        this.make = vehicle.getMake();
        this.model = vehicle.getModel();
        this.year = vehicle.getYear();
        this.colour = vehicle.getColour();
        this.mileageLimitPerDay = vehicle.getMileageLimitPerDay();
        this.weeklyRate = vehicle.getWeeklyRate();
        this.status = vehicle.getStatus();
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLicensePlate() {
        return licensePlate;
    }

    public void setLicensePlate(String licensePlate) {
        this.licensePlate = licensePlate;
    }

    public String getMake() {
        return make;
    }

    public void setMake(String make) {
        this.make = make;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public String getColour() {
        return colour;
    }

    public void setColour(String colour) {
        this.colour = colour;
    }

    public BigDecimal getMileageLimitPerDay() {
        return mileageLimitPerDay;
    }

    public void setMileageLimitPerDay(BigDecimal mileageLimitPerDay) {
        this.mileageLimitPerDay = mileageLimitPerDay;
    }

    public BigDecimal getWeeklyRate() {
        return weeklyRate;
    }

    public void setWeeklyRate(BigDecimal weeklyRate) {
        this.weeklyRate = weeklyRate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}