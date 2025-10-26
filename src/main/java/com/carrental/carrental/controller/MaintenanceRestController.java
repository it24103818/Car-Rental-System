package com.carrental.carrental.controller;

import com.carrental.carrental.model.Maintenance;
import com.carrental.carrental.service.MaintenanceService;
import com.carrental.carrental.dto.MaintenanceDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/maintenance")
public class MaintenanceRestController {
    private final MaintenanceService maintenanceService;

    public MaintenanceRestController(MaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }

    @GetMapping("/car/{carId}") // ✅ Matches frontend
    public ResponseEntity<List<MaintenanceDTO>> getByCar(@PathVariable Long carId) {
        List<Maintenance> maintenanceList = maintenanceService.getMaintenanceHistoryByCar(carId);
        List<MaintenanceDTO> dtoList = maintenanceList.stream()
                .map(MaintenanceDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtoList);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MaintenanceDTO> update(@PathVariable Long id, @RequestBody Maintenance updated) {
        Maintenance maintenance = maintenanceService.updateMaintenance(id, updated);
        MaintenanceDTO dto = new MaintenanceDTO(maintenance);
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        maintenanceService.deleteMaintenance(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<MaintenanceDTO> create(@RequestBody Maintenance maintenance) {
        Maintenance savedMaintenance = maintenanceService.logMaintenance(maintenance);
        MaintenanceDTO dto = new MaintenanceDTO(savedMaintenance);
        return ResponseEntity.ok(dto);
    }
}