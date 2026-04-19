package com.team12.parkinglotsystem.dto;

import com.team12.parkinglotsystem.model.Ticket;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketResponse {

    private Long ticketId;
    private String vehicleLicensePlate;
    private String ownerName;
    private String slotNumber;
    private int floor;
    private LocalDateTime entryTime;
    private LocalDateTime exitTime;
    private Double fee;
    private String status;

    // Static factory method to build from a Ticket entity
    public static TicketResponse fromTicket(Ticket ticket) {
        TicketResponse response = new TicketResponse();
        response.setTicketId(ticket.getId());
        response.setVehicleLicensePlate(ticket.getVehicle().getNumberPlate());
        response.setOwnerName(ticket.getVehicle().getOwnerName());
        response.setSlotNumber(ticket.getSlot().getSlotNumber());
        response.setFloor(ticket.getSlot().getFloor());
        response.setEntryTime(ticket.getEntryTime());
        response.setExitTime(ticket.getExitTime());
        response.setFee(ticket.getFee());
        response.setStatus(ticket.getStatus().name());
        return response;
    }
}
