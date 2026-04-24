package com.team12.parkinglotsystem.factory;

import com.team12.parkinglotsystem.strategy.BikeFeeStrategy;
import com.team12.parkinglotsystem.strategy.CarFeeStrategy;
import com.team12.parkinglotsystem.strategy.FeeStrategy;
import org.springframework.stereotype.Component;

@Component
public class FeeStrategyFactory {

    public static FeeStrategy getStrategy(String vehicleType) {

        if (vehicleType == null) {
            throw new IllegalArgumentException("Vehicle type cannot be null");
        }

        return switch (vehicleType.toLowerCase()) {
            case "bike" -> new BikeFeeStrategy();
            case "car" -> new CarFeeStrategy();
            default -> throw new IllegalArgumentException("Invalid vehicle type: " + vehicleType);
        };
    }
}
