package com.team12.parkinglotsystem.strategy;

import com.team12.parkinglotsystem.model.ParkingSlot;
import com.team12.parkinglotsystem.model.Vehicle;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;

@Component("nearestSlot")
public class NearestSlotStrategy implements SlotAllocationStrategy {
  @Override
  public ParkingSlot allocate(List<ParkingSlot> availableSlots, Vehicle.VehicleType vehicleType) {
    return availableSlots.stream()
        .filter(slot -> slot.getSlotType() == vehicleType)
        .filter(slot -> !slot.isOccupied())
        .sorted(Comparator.comparingInt(ParkingSlot::getFloor)
            .thenComparing(ParkingSlot::getSlotNumber))
        .findFirst()
        .orElse(null);
  }
}
