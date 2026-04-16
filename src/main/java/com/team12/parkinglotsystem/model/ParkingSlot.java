package com.team12.parkinglotsystem.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "parking_slots")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParkingSlot {

  @Id
  @Column(nullable = false, unique = true)
  private String slotNumber;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private Vehicle.VehicleType slotType;

  @Column(nullable = false)
  private boolean occupied;

  @Column(nullable = false)
  private int floor;

  @OneToMany(mappedBy = "slot", cascade = CascadeType.ALL)
  @JsonIgnore
  private List<Ticket> tickets;
}
