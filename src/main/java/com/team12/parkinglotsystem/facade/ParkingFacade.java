package com.team12.parkinglotsystem.facade;

import com.team12.parkinglotsystem.dto.TicketResponse;
import com.team12.parkinglotsystem.model.Vehicle;
import com.team12.parkinglotsystem.service.ParkingService;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ParkingFacade {

  private final ParkingService parkingService;

  public ParkingFacade(ParkingService parkingService) {
    this.parkingService = parkingService;
  }

  // ENTRY
  public TicketResponse parkVehicle(String numberPlate, String ownerName,
      Vehicle.VehicleType vehicleType, String strategy) {
    return parkingService.parkVehicle(numberPlate, ownerName, vehicleType, strategy);
  }

  // EXIT
  public TicketResponse exitVehicle(String numberPlate) {
    return parkingService.exitVehicle(numberPlate);
  }

  // SEARCH
  public TicketResponse searchVehicle(String numberPlate) {
    return parkingService.findActiveTicketByVehicleNumber(numberPlate);
  }

  // GET ACTIVE TICKETS
  public List<TicketResponse> getActiveTickets() {
    return parkingService.getActiveTickets();
  }

  // GET TICKET BY ID
  public TicketResponse getTicketById(Long id) {
    return parkingService.getTicketById(id);
  }
}
