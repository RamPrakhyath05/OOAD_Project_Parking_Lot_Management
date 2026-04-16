package com.team12.parkinglotsystem.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vehicles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String numberPlate;

  @Column(nullable = false)
  private String ownerName;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private VehicleType vehicleType;

  public enum VehicleType {
    CAR, BIKE
  }

  public Vehicle(String numberPlate, String ownerName, VehicleType vehicleType) {
    this.numberPlate = numberPlate;
    this.ownerName = ownerName;
    this.vehicleType = vehicleType;
  }
}
