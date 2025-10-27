package com.carrental.carrental.repository;

import com.carrental.carrental.model.AvailabilitySlot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AvailabilitySlotRepository extends JpaRepository<AvailabilitySlot, Long> {
    List<AvailabilitySlot> findByVehicle_Id(Long vehicleId);
}
