package com.carrental.carrental.controller;

import com.carrental.carrental.model.Vehicle;
import com.carrental.carrental.dto.VehicleDTO;
import com.carrental.carrental.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/vehicles")  // Changed from "/api/cars" to match React frontend
public class VehicleController {

    private final VehicleService vehicleService;

    @Autowired
    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    // Get all vehicles (for dropdown selection)
    @GetMapping
    public ResponseEntity<List<VehicleDTO>> getAllVehicles() {
        List<Vehicle> vehicles = vehicleService.getAllCars();
        List<VehicleDTO> vehicleDTOs = vehicles.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(vehicleDTOs);
    }

    // Get vehicle by ID (for validation)
    @GetMapping("/{id}")
    public ResponseEntity<VehicleDTO> getVehicleById(@PathVariable Long id) {
        try {
            Vehicle vehicle = vehicleService.getCarById(id);
            VehicleDTO vehicleDTO = convertToDTO(vehicle);
            return ResponseEntity.ok(vehicleDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Check if vehicle exists (simple endpoint for validation)
    @GetMapping("/{id}/exists")
    public ResponseEntity<Boolean> checkVehicleExists(@PathVariable Long id) {
        try {
            Vehicle vehicle = vehicleService.getCarById(id);
            return ResponseEntity.ok(true);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.ok(false);
        }
    }

    // Add new vehicle
    @PostMapping
    public ResponseEntity<VehicleDTO> addVehicle(@RequestBody Vehicle vehicle) {
        Vehicle addedVehicle = vehicleService.addCar(vehicle);
        if (addedVehicle == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        VehicleDTO vehicleDTO = convertToDTO(addedVehicle);
        return ResponseEntity.status(HttpStatus.CREATED).body(vehicleDTO);
    }

    // Update vehicle
    @PutMapping("/{id}")
    public ResponseEntity<VehicleDTO> updateVehicle(@PathVariable Long id, @RequestBody Vehicle vehicle) {
        vehicle.setId(id);
        Vehicle updatedVehicle = vehicleService.updateCar(vehicle);
        if (updatedVehicle == null) {
            return ResponseEntity.notFound().build();
        }
        VehicleDTO vehicleDTO = convertToDTO(updatedVehicle);
        return ResponseEntity.ok(vehicleDTO);
    }

    // Delete vehicle
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteCar(id);
        return ResponseEntity.noContent().build();
    }

    // Helper method to convert Vehicle to VehicleDTO
    private VehicleDTO convertToDTO(Vehicle vehicle) {
        VehicleDTO dto = new VehicleDTO();
        dto.setId(vehicle.getId());
        dto.setLicensePlate(vehicle.getLicensePlate());
        dto.setMake(vehicle.getMake());
        dto.setModel(vehicle.getModel());
        dto.setYear(vehicle.getYear());
        dto.setColour(vehicle.getColour());
        dto.setMileageLimitPerDay(vehicle.getMileageLimitPerDay());
        dto.setWeeklyRate(vehicle.getWeeklyRate());
        dto.setStatus(vehicle.getStatus());
        return dto;
    }
}