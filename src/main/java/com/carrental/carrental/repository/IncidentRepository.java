
package com.carrental.carrental.repository;



import com.carrental.carrental.model.Incident;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IncidentRepository extends JpaRepository<Incident, Long> {
    List<Incident> findByVehicleId(Long vehicleId);
    List<Incident> findByCustomerId(Long customerId);
}
