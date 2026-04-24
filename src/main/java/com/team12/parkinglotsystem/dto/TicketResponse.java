package com.team12.parkinglotsystem.dto;

import com.team12.parkinglotsystem.model.Ticket;
import java.time.LocalDateTime;

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

    // No-args constructor
    public TicketResponse() {
    }

    // All-args constructor
    public TicketResponse(Long ticketId, String vehicleLicensePlate, String ownerName,
            String slotNumber, int floor, LocalDateTime entryTime,
            LocalDateTime exitTime, Double fee, String status) {
        this.ticketId = ticketId;
        this.vehicleLicensePlate = vehicleLicensePlate;
        this.ownerName = ownerName;
        this.slotNumber = slotNumber;
        this.floor = floor;
        this.entryTime = entryTime;
        this.exitTime = exitTime;
        this.fee = fee;
        this.status = status;
    }

    // Getters and Setters

    public Long getTicketId() {
        return ticketId;
    }

    public void setTicketId(Long ticketId) {
        this.ticketId = ticketId;
    }

    public String getVehicleLicensePlate() {
        return vehicleLicensePlate;
    }

    public void setVehicleLicensePlate(String vehicleLicensePlate) {
        this.vehicleLicensePlate = vehicleLicensePlate;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public String getSlotNumber() {
        return slotNumber;
    }

    public void setSlotNumber(String slotNumber) {
        this.slotNumber = slotNumber;
    }

    public int getFloor() {
        return floor;
    }

    public void setFloor(int floor) {
        this.floor = floor;
    }

    public LocalDateTime getEntryTime() {
        return entryTime;
    }

    public void setEntryTime(LocalDateTime entryTime) {
        this.entryTime = entryTime;
    }

    public LocalDateTime getExitTime() {
        return exitTime;
    }

    public void setExitTime(LocalDateTime exitTime) {
        this.exitTime = exitTime;
    }

    public Double getFee() {
        return fee;
    }

    public void setFee(Double fee) {
        this.fee = fee;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    // Static factory method
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
