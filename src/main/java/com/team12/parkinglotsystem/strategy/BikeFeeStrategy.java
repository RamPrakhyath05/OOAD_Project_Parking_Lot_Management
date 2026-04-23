package com.team12.parkinglotsystem.strategy;

public class BikeFeeStrategy implements FeeStrategy {

    private static final double RATE_PER_HOUR = 10.0;

    @Override
    public double calculateFee(int hours) {
        if (hours <= 0) {
            return 0;
        }
        return hours * RATE_PER_HOUR;
    }
}