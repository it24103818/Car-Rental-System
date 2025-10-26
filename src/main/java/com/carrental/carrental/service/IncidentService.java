

package com.carrental.carrental.service;


import com.carrental.carrental.model.Incident;
import com.carrental.carrental.repository.IncidentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class IncidentService {
    @Autowired
    private IncidentRepository repository;

    public Incident createIncident(Incident incident) {
        if (incident == null) {
            throw new IllegalArgumentException("Incident cannot be null");
        }
        incident.setStatus("OPEN");
        return repository.save(incident);
    }

    public List<Incident> getByVehicle(Long vehicleId) {
        if (vehicleId == null) {
            throw new IllegalArgumentException("Vehicle ID cannot be null");
        }
        return repository.findByVehicleId(vehicleId);
    }

    public List<Incident> getByCustomer(Long customerId) {
        if (customerId == null) {
            throw new IllegalArgumentException("Customer ID cannot be null");
        }
        return repository.findByCustomerId(customerId);
    }

    public Incident addFollowUp(Long id, String notes) {
        if (id == null) {
            throw new IllegalArgumentException("Incident ID cannot be null");
        }
        if (notes == null || notes.trim().isEmpty()) {
            throw new IllegalArgumentException("Follow-up notes cannot be null or empty");
        }
        Incident incident = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Incident not found with ID: " + id));
        String existingNotes = incident.getFollowUpNotes() != null ? incident.getFollowUpNotes() : "";
        incident.setFollowUpNotes(existingNotes + "\n" + notes.trim());
        return repository.save(incident);
    }

    public void deleteIncident(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Incident ID cannot be null");
        }
        if (!repository.existsById(id)) {
            throw new RuntimeException("Incident not found with ID: " + id);
        }
        repository.deleteById(id);
    }
}


