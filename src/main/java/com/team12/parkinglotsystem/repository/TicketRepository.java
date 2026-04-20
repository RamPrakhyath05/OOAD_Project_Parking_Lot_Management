package com.team12.parkinglotsystem.repository;

import com.team12.parkinglotsystem.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    // Find active ticket by vehicle id
    Optional<Ticket> findByVehicle_IdAndStatus(Long vehicleId, Ticket.TicketStatus status);

    // Find all tickets by slot number
    List<Ticket> findBySlot_SlotNumber(String slotNumber);

    // Find all active tickets
    List<Ticket> findByStatus(Ticket.TicketStatus status);

    // Check if a vehicle already has an active ticket
    boolean existsByVehicle_IdAndStatus(Long vehicleId, Ticket.TicketStatus status);
}
