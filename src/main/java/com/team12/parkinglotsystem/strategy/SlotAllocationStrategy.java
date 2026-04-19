package com.team12.parkinglotsystem.strategy;

import com.team12.parkinglotsystem.model.ParkingSlot;
import com.team12.parkinglotsystem.model.Vehicle;

import java.util.List;

public interface SlotAllocationStrategy {
  ParkingSlot allocate(List<ParkingSlot> availableSlots, Vehicle.VehicleType vehicleType);
}
