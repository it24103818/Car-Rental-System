package com.carrental.carrental.repository;

import com.carrental.carrental.model.Maintenance;
import com.carrental.carrental.enums.MaintenanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

// MaintenanceRepository.java
@Repository
public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {
    List<Maintenance> findByVehicle_IdOrderByServiceDateDesc(Long vehicleId);
    List<Maintenance> findByVehicle_IdAndStatusOrderByServiceDateDesc(Long vehicleId, MaintenanceStatus status);
}