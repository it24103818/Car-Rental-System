package com.carrental.carrental.controller;

import com.carrental.carrental.dto.*;
import com.carrental.carrental.model.BlockedPeriod;
import com.carrental.carrental.service.AvailabilityService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/availability")
@CrossOrigin(origins = "http://localhost:3000")
public class AvailabilityController {

    @Autowired
    private AvailabilityService availabilityService;

    @GetMapping("/stats")
    public ResponseEntity<AvailabilityStatsDTO> getAvailabilityStats() {
        AvailabilityStatsDTO stats = availabilityService.getAvailabilityStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/vehicles")
    public ResponseEntity<List<VehicleAvailabilityDTO>> getAllVehiclesWithAvailability() {
        List<VehicleAvailabilityDTO> vehicles = availabilityService.getAllVehiclesWithAvailability();
        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/vehicles/{status}")
    public ResponseEntity<List<VehicleAvailabilityDTO>> getVehiclesByStatus(@PathVariable String status) {
        List<VehicleAvailabilityDTO> allVehicles = availabilityService.getAllVehiclesWithAvailability();
        List<VehicleAvailabilityDTO> filteredVehicles = allVehicles.stream()
                .filter(vehicle -> vehicle.getStatus().name().equalsIgnoreCase(status))
                .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(filteredVehicles);
    }

    @GetMapping("/blocked-periods")
    public ResponseEntity<List<BlockedPeriodDTO>> getAllBlockedPeriods() {
        List<BlockedPeriodDTO> blockedPeriods = availabilityService.getAllBlockedPeriods();
        return ResponseEntity.ok(blockedPeriods);
    }

    @PostMapping("/block")
    public ResponseEntity<BlockedPeriod> blockVehicle(@Valid @RequestBody BlockVehicleRequest request) {
        BlockedPeriod blockedPeriod = availabilityService.blockVehicle(request);
        return ResponseEntity.ok(blockedPeriod);
    }

    @DeleteMapping("/unblock/vehicle/{vehicleId}")
    public ResponseEntity<Void> unblockVehicle(@PathVariable Long vehicleId) {
        availabilityService.unblockVehicle(vehicleId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/unblock/period/{blockId}")
    public ResponseEntity<Void> unblockPeriod(@PathVariable Long blockId) {
        availabilityService.unblockPeriod(blockId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/check-availability")
    public ResponseEntity<Boolean> checkVehicleAvailability(
            @RequestParam Long vehicleId,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        boolean isAvailable = availabilityService.isVehicleAvailable(
                vehicleId, java.time.LocalDate.parse(startDate), java.time.LocalDate.parse(endDate));
        return ResponseEntity.ok(isAvailable);
    }
}