package com.juanroy.lab6.nicheEntities;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

import java.util.Objects;

@Entity
@DiscriminatorValue("HANDHELD CONSOLE")
public class HandheldConsoleEntity extends GameConsoleEntity {
    @Column(name = "battery_life_hours")
    private int batteryLifeHours;

    public HandheldConsoleEntity() {}

    public HandheldConsoleEntity(String name, String manufacturer, double price, int quantity, int batteryLifeHours) {
        super(name, manufacturer, price, quantity);
        this.batteryLifeHours = batteryLifeHours;
    }

    public int getBatteryLifeHours() {
        return batteryLifeHours;
    }

    public void setBatteryLifeHours(int batteryLifeHours) {
        this.batteryLifeHours = batteryLifeHours;
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof HandheldConsoleEntity that)) return false;
        if (!super.equals(o)) return false;
        return batteryLifeHours == that.batteryLifeHours;
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), batteryLifeHours);
    }

    @Override
    public String toString() {
        return "HandheldConsoleEntity{" +
                "batteryLifeHours=" + batteryLifeHours +
                "} " + super.toString();
    }
}