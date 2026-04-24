package com.team12.parkinglotsystem.strategy;

public class CarFeeStrategy implements FeeStrategy {

    private static final double RATE_PER_HOUR = 20.0;

    @Override
    public double calculateFee(double hours) {
        if (hours <= 0)
            return 0;
        return hours * RATE_PER_HOUR;
    }
}
