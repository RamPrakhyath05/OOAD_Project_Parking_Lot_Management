package com.team12.parkinglotsystem.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatusResponse {

    private boolean success;
    private String message;

    // Static factory methods for convenience
    public static StatusResponse ok(String message) {
        return new StatusResponse(true, message);
    }

    public static StatusResponse error(String message) {
        return new StatusResponse(false, message);
    }
}
