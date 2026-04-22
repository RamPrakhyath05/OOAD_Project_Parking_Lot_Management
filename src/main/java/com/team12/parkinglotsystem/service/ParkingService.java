ParkingService.java:

package com.team12.parkinglotsystem.service;

import com.team12.parkinglotsystem.dto.StatusResponse;
import com.team12.parkinglotsystem.dto.TicketResponse;
import com.team12.parkinglotsystem.factory.SlotStrategyFactory;
import com.team12.parkinglotsystem.model.ParkingSlot;
import com.team12.parkinglotsystem.model.Ticket;
import com.team12.parkinglotsystem.model.Vehicle;
import com.team12.parkinglotsystem.repository.ParkingSlotRepository;
import com.team12.parkinglotsystem.repository.TicketRepository;
import com.team12.parkinglotsystem.repository.VehicleRepository;
import com.team12.parkinglotsystem.strategy.SlotAllocationStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ParkingService {

    private final VehicleRepository vehicleRepository;
    private final ParkingSlotRepository parkingSlotRepository;
    private final TicketRepository ticketRepository;
    private final SlotStrategyFactory slotStrategyFactory;

    @Autowired
    public ParkingService(VehicleRepository vehicleRepository,
                          ParkingSlotRepository parkingSlotRepository,
                          TicketRepository ticketRepository,
                          SlotStrategyFactory slotStrategyFactory) {
        this.vehicleRepository = vehicleRepository;
        this.parkingSlotRepository = parkingSlotRepository;
        this.ticketRepository = ticketRepository;
        this.slotStrategyFactory = slotStrategyFactory;
    }

    // Vehicle entry — park a vehicle
    public TicketResponse parkVehicle(String numberPlate, String ownerName,
                                      Vehicle.VehicleType vehicleType, String strategy) {

        // Check if vehicle already has an active ticket
        Vehicle vehicle = vehicleRepository.findByNumberPlate(numberPlate)
                .orElseGet(() -> vehicleRepository.save(
                        new Vehicle(null, numberPlate, ownerName, vehicleType)));

        if (ticketRepository.existsByVehicle_IdAndStatus(vehicle.getId(), Ticket.TicketStatus.ACTIVE)) {
            throw new IllegalStateException("Vehicle " + numberPlate + " is already parked.");
        }

        // Get available slots and allocate using strategy
        List<ParkingSlot> availableSlots = parkingSlotRepository.findBySlotTypeAndOccupied(vehicleType, false);
        SlotAllocationStrategy allocationStrategy = slotStrategyFactory.getStrategy(strategy);
        ParkingSlot allocatedSlot = allocationStrategy.allocate(availableSlots, vehicleType);

        if (allocatedSlot == null) {
            throw new IllegalStateException("No available slots for vehicle type: " + vehicleType);
        }

        // Mark slot as occupied
        allocatedSlot.setOccupied(true);
        parkingSlotRepository.save(allocatedSlot);

        // Create and save ticket
        Ticket ticket = new Ticket(allocatedSlot, vehicle);
        ticketRepository.save(ticket);

        return TicketResponse.fromTicket(ticket);
    }

    // Vehicle exit — calculate fee and free the slot
    public TicketResponse exitVehicle(String numberPlate) {

        Vehicle vehicle = vehicleRepository.findByNumberPlate(numberPlate)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found: " + numberPlate));

        Ticket ticket = ticketRepository
                .findByVehicle_IdAndStatus(vehicle.getId(), Ticket.TicketStatus.ACTIVE)
                .orElseThrow(() -> new IllegalStateException("No active ticket for vehicle: " + numberPlate));

        // Set exit time and calculate fee
        ticket.setExitTime(LocalDateTime.now());
        ticket.setFee(calculateFee(ticket));
        ticket.setStatus(Ticket.TicketStatus.CLOSED);
        ticketRepository.save(ticket);

        // Free the slot
        ParkingSlot slot = ticket.getSlot();
        slot.setOccupied(false);
        parkingSlotRepository.save(slot);

        return TicketResponse.fromTicket(ticket);
    }

    // Get all active tickets
    public List<TicketResponse> getActiveTickets() {
        return ticketRepository.findByStatus(Ticket.TicketStatus.ACTIVE)
                .stream()
                .map(TicketResponse::fromTicket)
                .collect(Collectors.toList());
    }

    // Get ticket by id
    public TicketResponse getTicketById(Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found: " + ticketId));
        return TicketResponse.fromTicket(ticket);
    }

    // Fee calculation based on vehicle type and duration
    private double calculateFee(Ticket ticket) {
        long minutes = java.time.Duration.between(ticket.getEntryTime(), ticket.getExitTime()).toMinutes();
        double hours = Math.ceil(minutes / 60.0);

        return switch (ticket.getVehicle().getVehicleType()) {
            case CAR -> hours * 50.0;  // ₹50 per hour for cars
            case BIKE -> hours * 20.0; // ₹20 per hour for bikes
        };
    }
}
