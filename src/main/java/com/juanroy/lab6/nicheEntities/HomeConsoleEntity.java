package com.juanroy.lab6.nicheEntities;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

import java.util.Objects;

@Entity
@DiscriminatorValue("HOME CONSOLE")
public class HomeConsoleEntity extends GameConsoleEntity {
    @Column(name = "max_resolution")
    private String maxResolution;

    public HomeConsoleEntity() {}

    public HomeConsoleEntity(String name, String manufacturer, double price, int quantity, String maxResolution) {
        super(name, manufacturer, price, quantity);
        this.maxResolution = maxResolution;
    }

    public String getMaxResolution() {
        return maxResolution;
    }

    public void setMaxResolution(String maxResolution) {
        this.maxResolution = maxResolution;
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof HomeConsoleEntity that)) return false;
        if (!super.equals(o)) return false;
        return Objects.equals(maxResolution, that.maxResolution);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), maxResolution);
    }

    @Override
    public String toString() {
        return "HomeConsoleEntity{" +
                "maxResolution='" + maxResolution + '\'' +
                "} " + super.toString();
    }
}