package com.team12.parkinglotsystem.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping
    public String test() {
        return "Parking Lot System is running 🚀";
    }
}
