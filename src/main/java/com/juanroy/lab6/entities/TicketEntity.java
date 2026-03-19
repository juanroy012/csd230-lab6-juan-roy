package com.juanroy.lab6.entities;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("TICKET")
public class TicketEntity extends ProductEntity {

    @Column(name = "ticket_price")
    private double price;

    public TicketEntity() {}

    public TicketEntity(String name, double p) { this.setName(name); this.price = p; }

    @Override public void sellItem() { System.out.println("Selling Ticket: " + super.getName() + " for $" + price); }

    @Override public double getPrice() { return price; }

    public void setPrice(double p) { this.price = p; }

    @Override public String toString() { return "Ticket{desc='" + super.getName() + "', price=" + price + "}"; }
}
