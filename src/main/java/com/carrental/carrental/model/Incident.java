
package com.carrental.carrental.model;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Incident {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;
    private LocalDateTime incidentDate;
    private Long rentalId;
    private Long vehicleId;
    private Long customerId;
    private String status;  // e.g., "OPEN", "RESOLVED"
    @Column(columnDefinition = "TEXT")
    private String followUpNotes;
}
