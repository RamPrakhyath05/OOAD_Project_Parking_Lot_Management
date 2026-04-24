package com.team12.parkinglotsystem.controller;

import com.team12.parkinglotsystem.dto.StatusResponse;
import com.team12.parkinglotsystem.dto.TicketResponse;
import com.team12.parkinglotsystem.facade.ParkingFacade;
import com.team12.parkinglotsystem.model.Vehicle;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/parking")
public class ParkingController {

    private final ParkingFacade parkingFacade;

    // Constructor Injection (clean, no Lombok)
    public ParkingController(ParkingFacade parkingFacade) {
        this.parkingFacade = parkingFacade;
    }

    // POST /api/parking/entry
    @PostMapping("/entry")
    public ResponseEntity<?> vehicleEntry(@RequestBody Map<String, String> request) {
        try {
            String numberPlate = request.get("numberPlate");
            String ownerName = request.get("ownerName");
            Vehicle.VehicleType vehicleType = Vehicle.VehicleType.valueOf(request.get("vehicleType").toUpperCase());
            String strategy = request.getOrDefault("strategy", "nearestSlot");

            TicketResponse ticket = parkingFacade.parkVehicle(numberPlate, ownerName, vehicleType, strategy);

            return ResponseEntity.ok(ticket);

        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(StatusResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(StatusResponse.error("Something went wrong: " + e.getMessage()));
        }
    }

    // POST /api/parking/exit
    @PostMapping("/exit")
    public ResponseEntity<?> vehicleExit(@RequestBody Map<String, String> request) {
        try {
            String numberPlate = request.get("numberPlate");

            TicketResponse ticket = parkingFacade.exitVehicle(numberPlate);

            return ResponseEntity.ok(ticket);

        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(StatusResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(StatusResponse.error("Something went wrong: " + e.getMessage()));
        }
    }

    // GET /api/parking/active
    @GetMapping("/active")
    public ResponseEntity<List<TicketResponse>> getActiveTickets() {
        return ResponseEntity.ok(parkingFacade.getActiveTickets());
    }

    // GET /api/parking/ticket/{id}
    @GetMapping("/ticket/{id}")
    public ResponseEntity<?> getTicketById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(parkingFacade.getTicketById(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(StatusResponse.error(e.getMessage()));
        }
    }

    // GET /api/parking/search
    @GetMapping("/search")
    public ResponseEntity<?> searchVehicle(@RequestParam String vehicleNumber) {
        try {
            TicketResponse ticket = parkingFacade.searchVehicle(vehicleNumber);
            return ResponseEntity.ok(ticket);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(StatusResponse.error(e.getMessage()));
        }
    }
}
