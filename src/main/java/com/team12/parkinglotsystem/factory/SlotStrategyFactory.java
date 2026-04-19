package com.team12.parkinglotsystem.factory;

import com.team12.parkinglotsystem.strategy.SlotAllocationStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class SlotStrategyFactory {

  private final Map<String, SlotAllocationStrategy> strategies;

  @Autowired
  public SlotStrategyFactory(Map<String, SlotAllocationStrategy> strategies) {
    this.strategies = strategies;
  }

  /**
   * Returns the appropriate slot allocation strategy by name.
   * Valid strategy names: "nearestSlot", "randomSlot"
   *
   * @param strategyName name of the strategy to use
   * @return SlotAllocationStrategy implementation
   */
  public SlotAllocationStrategy getStrategy(String strategyName) {
    SlotAllocationStrategy strategy = strategies.get(strategyName);
    if (strategy == null) {
      throw new IllegalArgumentException("Unknown slot strategy: " + strategyName);
    }
    return strategy;
  }
}
