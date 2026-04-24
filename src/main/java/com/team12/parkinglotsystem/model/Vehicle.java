package com.team12.parkinglotsystem.model;

import jakarta.persistence.*;

@Entity
@Table(name = "vehicles")
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

  // Constructors

  public Vehicle() {
  }

  public Vehicle(Long id, String numberPlate, String ownerName, VehicleType vehicleType) {
    this.id = id;
    this.numberPlate = numberPlate;
    this.ownerName = ownerName;
    this.vehicleType = vehicleType;
  }

  public Vehicle(String numberPlate, String ownerName, VehicleType vehicleType) {
    this.numberPlate = numberPlate;
    this.ownerName = ownerName;
    this.vehicleType = vehicleType;
  }

  // Getters & Setters

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getNumberPlate() {
    return numberPlate;
  }

  public void setNumberPlate(String numberPlate) {
    this.numberPlate = numberPlate;
  }

  public String getOwnerName() {
    return ownerName;
  }

  public void setOwnerName(String ownerName) {
    this.ownerName = ownerName;
  }

  public VehicleType getVehicleType() {
    return vehicleType;
  }

  public void setVehicleType(VehicleType vehicleType) {
    this.vehicleType = vehicleType;
  }
}
