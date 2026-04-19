package com.team12.parkinglotsystem.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tickets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "slot_number", nullable = false)
    private ParkingSlot slot;

    @ManyToOne
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @Column(nullable = false)
    private LocalDateTime entryTime;

    private LocalDateTime exitTime;

    private Double fee;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketStatus status;

    public enum TicketStatus {
        ACTIVE,   // vehicle is currently parked
        CLOSED    // vehicle has exited and fee is paid
    }

    // Convenience constructor for when a vehicle enters
    public Ticket(ParkingSlot slot, Vehicle vehicle) {
        this.slot = slot;
        this.vehicle = vehicle;
        this.entryTime = LocalDateTime.now();
        this.status = TicketStatus.ACTIVE;
    }
}
