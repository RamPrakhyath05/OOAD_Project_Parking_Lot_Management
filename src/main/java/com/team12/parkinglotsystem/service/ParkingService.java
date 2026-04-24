package com.team12.parkinglotsystem.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.team12.parkinglotsystem.dto.TicketResponse;
import com.team12.parkinglotsystem.factory.FeeStrategyFactory;
import com.team12.parkinglotsystem.factory.SlotStrategyFactory;
import com.team12.parkinglotsystem.model.ParkingSlot;
import com.team12.parkinglotsystem.model.Ticket;
import com.team12.parkinglotsystem.model.Vehicle;
import com.team12.parkinglotsystem.repository.ParkingSlotRepository;
import com.team12.parkinglotsystem.repository.TicketRepository;
import com.team12.parkinglotsystem.repository.VehicleRepository;
import com.team12.parkinglotsystem.strategy.FeeStrategy;
import com.team12.parkinglotsystem.strategy.SlotAllocationStrategy;

@Service
public class ParkingService {

    private final VehicleRepository vehicleRepository;
    private final ParkingSlotRepository parkingSlotRepository;
    private final TicketRepository ticketRepository;
    private final SlotStrategyFactory slotStrategyFactory;
    private final FeeStrategyFactory feeStrategyFactory;

    public ParkingService(VehicleRepository vehicleRepository,
            ParkingSlotRepository parkingSlotRepository,
            TicketRepository ticketRepository,
            SlotStrategyFactory slotStrategyFactory,
            FeeStrategyFactory feeStrategyFactory) {
        this.vehicleRepository = vehicleRepository;
        this.parkingSlotRepository = parkingSlotRepository;
        this.ticketRepository = ticketRepository;
        this.slotStrategyFactory = slotStrategyFactory;
        this.feeStrategyFactory = feeStrategyFactory;
    }

    // 🚗 Vehicle entry — park a vehicle
    @Transactional
    public TicketResponse parkVehicle(String numberPlate, String ownerName,
            Vehicle.VehicleType vehicleType, String strategy) {

        // Find or create vehicle
        Vehicle vehicle = vehicleRepository.findByNumberPlate(numberPlate)
                .orElseGet(() -> vehicleRepository.save(
                        new Vehicle(null, numberPlate, ownerName, vehicleType)));

        // Prevent duplicate parking
        if (ticketRepository.existsByVehicle_IdAndStatus(vehicle.getId(), Ticket.TicketStatus.ACTIVE)) {
            throw new IllegalStateException("Vehicle " + numberPlate + " is already parked.");
        }

        // Get available slots
        List<ParkingSlot> availableSlots = parkingSlotRepository.findBySlotTypeAndOccupied(vehicleType, false);

        // Select strategy
        SlotAllocationStrategy allocationStrategy = slotStrategyFactory.getStrategy(strategy);

        ParkingSlot allocatedSlot = allocationStrategy.allocate(availableSlots, vehicleType);

        if (allocatedSlot == null) {
            throw new IllegalStateException("No available slots for vehicle type: " + vehicleType);
        }

        // Mark slot as occupied
        allocatedSlot.setOccupied(true);
        parkingSlotRepository.save(allocatedSlot);

        // Create ticket
        Ticket ticket = new Ticket(allocatedSlot, vehicle);
        ticketRepository.save(ticket);

        return TicketResponse.fromTicket(ticket);
    }

    // 🚪 Vehicle exit — calculate fee and free slot
    @Transactional
    public TicketResponse exitVehicle(String numberPlate) {

        Vehicle vehicle = vehicleRepository.findByNumberPlate(numberPlate)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found: " + numberPlate));

        Ticket ticket = ticketRepository
                .findByVehicle_IdAndStatus(vehicle.getId(), Ticket.TicketStatus.ACTIVE)
                .orElseThrow(() -> new IllegalStateException("No active ticket for vehicle: " + numberPlate));

        // Set exit time
        ticket.setExitTime(LocalDateTime.now());

        // Calculate fee using Strategy Pattern
        ticket.setFee(calculateFee(ticket));

        // Close ticket
        ticket.setStatus(Ticket.TicketStatus.CLOSED);
        ticketRepository.save(ticket);

        // Free the slot
        ParkingSlot slot = ticket.getSlot();
        slot.setOccupied(false);
        parkingSlotRepository.save(slot);

        return TicketResponse.fromTicket(ticket);
    }

    // 📋 Get all active tickets
    public List<TicketResponse> getActiveTickets() {
        return ticketRepository.findByStatus(Ticket.TicketStatus.ACTIVE)
                .stream()
                .map(TicketResponse::fromTicket)
                .collect(Collectors.toList());
    }

    // 🔍 Get ticket by ID
    public TicketResponse getTicketById(Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found: " + ticketId));
        return TicketResponse.fromTicket(ticket);
    }

    // 💰 Fee calculation using Strategy Pattern
    private double calculateFee(Ticket ticket) {
        long minutes = java.time.Duration
                .between(ticket.getEntryTime(), ticket.getExitTime())
                .toMinutes();

        double hours = Math.ceil(minutes / 60.0);

        FeeStrategy strategy = feeStrategyFactory
                .getStrategy(ticket.getVehicle().getVehicleType().name());

        return strategy.calculateFee(hours); // cleaner (no cast)
    }

    public TicketResponse findActiveTicketByVehicleNumber(String numberPlate) {

        Vehicle vehicle = vehicleRepository.findByNumberPlate(numberPlate)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));

        Ticket ticket = ticketRepository
                .findByVehicle_IdAndStatus(vehicle.getId(), Ticket.TicketStatus.ACTIVE)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle is not currently parked"));

        return TicketResponse.fromTicket(ticket);
    }
}
