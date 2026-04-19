package com.team12.parkinglotsystem.strategy;

import com.team12.parkinglotsystem.model.ParkingSlot;
import com.team12.parkinglotsystem.model.Vehicle;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component("randomSlot")
public class RandomSlotStrategy implements SlotAllocationStrategy {

  /**
   * Allocates a random available slot from the list
   * of unoccupied slots matching the vehicle type.
   */
  @Override
  public ParkingSlot allocate(List<ParkingSlot> availableSlots, Vehicle.VehicleType vehicleType) {
    List<ParkingSlot> filtered = availableSlots.stream()
        .filter(slot -> slot.getSlotType() == vehicleType)
        .filter(slot -> !slot.isOccupied())
        .collect(java.util.stream.Collectors.toList());

    if (filtered.isEmpty()) {
      return null;
    }

    Collections.shuffle(filtered);
    return filtered.get(0);
  }
}
