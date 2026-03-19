package com.juanroy.lab6.pojos;

public class Ticket extends Product {
    private String description = "";
    private double price = 0.0;

    @Override
    public void sellItem() {}

    @Override
    public double getPrice() {
        return price;
    }

    @Override
    public String toString() {
        return "Ticket{desc='" + description + "', price=" + price + "}";
    }
}
