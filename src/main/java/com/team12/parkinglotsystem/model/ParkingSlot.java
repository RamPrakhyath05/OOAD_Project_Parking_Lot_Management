package com.team12.parkinglotsystem.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "parking_slots")
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

  // Constructors

  public ParkingSlot() {
  }

  public ParkingSlot(String slotNumber, Vehicle.VehicleType slotType,
      boolean occupied, int floor, List<Ticket> tickets) {
    this.slotNumber = slotNumber;
    this.slotType = slotType;
    this.occupied = occupied;
    this.floor = floor;
    this.tickets = tickets;
  }

  // Getters & Setters

  public String getSlotNumber() {
    return slotNumber;
  }

  public void setSlotNumber(String slotNumber) {
    this.slotNumber = slotNumber;
  }

  public Vehicle.VehicleType getSlotType() {
    return slotType;
  }

  public void setSlotType(Vehicle.VehicleType slotType) {
    this.slotType = slotType;
  }

  public boolean isOccupied() {
    return occupied;
  }

  public void setOccupied(boolean occupied) {
    this.occupied = occupied;
  }

  public int getFloor() {
    return floor;
  }

  public void setFloor(int floor) {
    this.floor = floor;
  }

  public List<Ticket> getTickets() {
    return tickets;
  }

  public void setTickets(List<Ticket> tickets) {
    this.tickets = tickets;
  }
}
