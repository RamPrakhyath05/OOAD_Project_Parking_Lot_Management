package com.team12.parkinglotsystem.controller;

import com.team12.parkinglotsystem.dto.StatusResponse;
import com.team12.parkinglotsystem.model.ParkingSlot;
import com.team12.parkinglotsystem.repository.ParkingSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ParkingSlotRepository slotRepository;

    // Add slot
    @PostMapping("/slot")
    public StatusResponse addSlot(@RequestBody ParkingSlot slot) {
        slotRepository.save(slot);
        return StatusResponse.ok("Slot added successfully");
    }

    // Get all slots
    @GetMapping("/slots")
    public List<ParkingSlot> getAllSlots() {
        return slotRepository.findAll();
    }

    // Delete slot
    @DeleteMapping("/slot/{slotNumber}")
    public StatusResponse deleteSlot(@PathVariable String slotNumber) {

        if (!slotRepository.existsById(slotNumber)) {
            throw new IllegalArgumentException("Slot not found: " + slotNumber);
        }

        slotRepository.deleteById(slotNumber);
        return StatusResponse.ok("Slot deleted successfully");
    }
}
