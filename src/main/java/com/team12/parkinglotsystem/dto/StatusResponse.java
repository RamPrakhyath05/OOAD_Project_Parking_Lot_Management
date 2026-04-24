package com.team12.parkinglotsystem.dto;

public class StatusResponse {

    private boolean success;
    private String message;

    // No-args constructor
    public StatusResponse() {
    }

    // All-args constructor
    public StatusResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    // Getters
    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    // Setters
    public void setSuccess(boolean success) {
        this.success = success;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    // Static factory methods
    public static StatusResponse ok(String message) {
        return new StatusResponse(true, message);
    }

    public static StatusResponse error(String message) {
        return new StatusResponse(false, message);
    }
}
