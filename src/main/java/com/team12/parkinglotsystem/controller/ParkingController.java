package com.team12.parkinglotsystem.controller;

import com.team12.parkinglotsystem.dto.StatusResponse;
import com.team12.parkinglotsystem.dto.TicketResponse;
import com.team12.parkinglotsystem.model.Vehicle;
import com.team12.parkinglotsystem.service.ParkingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/parking")
public class ParkingController {

    private final ParkingService parkingService;

    @Autowired
    public ParkingController(ParkingService parkingService) {
        this.parkingService = parkingService;
    }

    // POST /api/parking/entry
    // Body: { "numberPlate": "KA01AB1234", "ownerName": "John", "vehicleType":
    // "CAR", "strategy": "nearestSlot" }
    @PostMapping("/entry")
    public ResponseEntity<?> vehicleEntry(@RequestBody Map<String, String> request) {
        try {
            String numberPlate = request.get("numberPlate");
            String ownerName = request.get("ownerName");
            Vehicle.VehicleType vehicleType = Vehicle.VehicleType.valueOf(request.get("vehicleType").toUpperCase());
            String strategy = request.getOrDefault("strategy", "nearestSlot");

            TicketResponse ticket = parkingService.parkVehicle(numberPlate, ownerName, vehicleType, strategy);
            return ResponseEntity.ok(ticket);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(StatusResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(StatusResponse.error("Something went wrong: " + e.getMessage()));
        }
    }

    // POST /api/parking/exit
    // Body: { "numberPlate": "KA01AB1234" }
    @PostMapping("/exit")
    public ResponseEntity<?> vehicleExit(@RequestBody Map<String, String> request) {
        try {
            String numberPlate = request.get("numberPlate");
            TicketResponse ticket = parkingService.exitVehicle(numberPlate);
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
        return ResponseEntity.ok(parkingService.getActiveTickets());
    }

    // GET /api/parking/ticket/{id}
    @GetMapping("/ticket/{id}")
    public ResponseEntity<?> getTicketById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(parkingService.getTicketById(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(StatusResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchVehicle(@RequestParam String vehicleNumber) {
        try {
            TicketResponse ticket = parkingService.findActiveTicketByVehicleNumber(vehicleNumber);
            return ResponseEntity.ok(ticket);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(StatusResponse.error(e.getMessage()));
        }
    }
}
