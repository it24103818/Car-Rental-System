


package com.carrental.carrental.controller;

import com.carrental.carrental.dto.FollowUpRequest;
import com.carrental.carrental.dto.IncidentRequest;
import com.carrental.carrental.model.Incident;
import com.carrental.carrental.service.IncidentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.MethodArgumentNotValidException;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/incidents")
public class IncidentController {
    @Autowired
    private IncidentService service;

    @PostMapping
    public ResponseEntity<Incident> logIncident(@Valid @RequestBody IncidentRequest request) {
        Incident incident = new Incident();
        incident.setDescription(request.getDescription());
        incident.setIncidentDate(request.getIncidentDate());
        incident.setRentalId(request.getRentalId());
        incident.setVehicleId(request.getVehicleId());
        incident.setCustomerId(request.getCustomerId());
        return ResponseEntity.ok(service.createIncident(incident));
    }

    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<Incident>> viewByVehicle(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(service.getByVehicle(vehicleId));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Incident>> viewByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(service.getByCustomer(customerId));
    }

    @PutMapping("/{id}/followup")
    public ResponseEntity<Incident> addFollowUp(@PathVariable Long id, @Valid @RequestBody FollowUpRequest request) {
        return ResponseEntity.ok(service.addFollowUp(id, request.getNotes()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeIncident(@PathVariable Long id) {
        service.deleteIncident(id);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Validation error: " + ex.getBindingResult().getAllErrors().get(0).getDefaultMessage());
    }
}

