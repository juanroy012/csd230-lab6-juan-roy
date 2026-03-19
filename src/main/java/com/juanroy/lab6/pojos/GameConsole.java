package com.juanroy.lab6.pojos;

/**
 * DTO for {@link csd230.lab1.GameConsoleEntity}
 */

import com.juanroy.lab6.nicheEntities.GameConsoleEntity;

/**
 * DTO for {@link GameConsoleEntity}
 */
public abstract class GameConsole extends Product {

    private String manufacturer;
    private double price;
    private int quantity;

    public String getManufacturer() {
        return manufacturer;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    @Override
    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
