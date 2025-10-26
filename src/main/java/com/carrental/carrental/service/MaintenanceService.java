package com.carrental.carrental.service;

import com.carrental.carrental.model.Maintenance;
import com.carrental.carrental.model.Vehicle;
import com.carrental.carrental.model.VehicleStatus;
import com.carrental.carrental.repository.MaintenanceRepository;
import com.carrental.carrental.enums.MaintenanceStatus;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;

@Service
public class MaintenanceService {

    private final MaintenanceRepository maintenanceRepository;
    private final VehicleService vehicleService;

    public MaintenanceService(MaintenanceRepository maintenanceRepository, VehicleService vehicleService) {
        this.maintenanceRepository = maintenanceRepository;
        this.vehicleService = vehicleService;
    }

    public Maintenance logMaintenance(Maintenance maintenance) {
        Vehicle vehicle = vehicleService.getVehicleById(maintenance.getVehicle().getId());
        if (MaintenanceStatus.PENDING.equals(maintenance.getStatus())) {
            // Use VehicleStatus constants instead of setAvailable(false)
            vehicle.setStatus(VehicleStatus.MAINTENANCE);
            vehicleService.updateVehicle(vehicle);
        }
        return maintenanceRepository.save(maintenance);
    }

    public List<Maintenance> getMaintenanceHistoryByCar(Long carId) {
        return maintenanceRepository.findByVehicle_IdOrderByServiceDateDesc(carId);
    }

    public List<Maintenance> getMaintenanceByCarAndStatus(Long carId, MaintenanceStatus status) {
        return maintenanceRepository.findByVehicle_IdAndStatusOrderByServiceDateDesc(carId, status);
    }

    public Maintenance updateMaintenance(Long id, Maintenance updatedMaintenance) {
        Maintenance maintenance = maintenanceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Maintenance entry not found"));

        if (updatedMaintenance.getIssue() != null) {
            maintenance.setIssue(updatedMaintenance.getIssue());
        }

        if (updatedMaintenance.getCost() != null &&
                updatedMaintenance.getCost().compareTo(BigDecimal.ZERO) > 0) {
            maintenance.setCost(updatedMaintenance.getCost());
        }

        if (updatedMaintenance.getStatus() != null) {
            maintenance.setStatus(updatedMaintenance.getStatus());
            if (MaintenanceStatus.COMPLETED.equals(updatedMaintenance.getStatus())) {
                Vehicle vehicle = maintenance.getVehicle();
                // Use VehicleStatus constants instead of setAvailable(true)
                vehicle.setStatus(VehicleStatus.AVAILABLE);
                vehicleService.updateVehicle(vehicle);
            }
        }

        if (updatedMaintenance.getServiceDate() != null) {
            maintenance.setServiceDate(updatedMaintenance.getServiceDate());
        }

        return maintenanceRepository.save(maintenance);
    }

    public void deleteMaintenance(Long id) {
        Maintenance maintenance = maintenanceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Maintenance entry not found"));
        maintenanceRepository.delete(maintenance);
    }
}