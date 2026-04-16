package com.team12.parkinglotsystem.repository;

import com.team12.parkinglotsystem.model.ParkingSlot;
import com.team12.parkinglotsystem.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParkingSlotRepository extends JpaRepository<ParkingSlot, String> {

  List<ParkingSlot> findBySlotType(Vehicle.VehicleType slotType);

  List<ParkingSlot> findBySlotTypeAndOccupied(Vehicle.VehicleType slotType, boolean occupied);

  List<ParkingSlot> findByFloor(int floor);

  List<ParkingSlot> findBySlotTypeAndOccupiedAndFloor(Vehicle.VehicleType slotType, boolean occupied, int floor);

  long countBySlotTypeAndOccupied(Vehicle.VehicleType slotType, boolean occupied);
}
