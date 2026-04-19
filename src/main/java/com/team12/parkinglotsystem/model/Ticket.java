package com.team12.parkinglotsystem.model;

import jakarta.persistence.*;
import lombok.*;

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

  // Member B will complete this class
}
