package com.juanroy.lab6.entities;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("PUBLICATION")
public abstract class PublicationEntity extends ProductEntity {

    @Column(name = "pub_price") private double price;

    private int copies;

    public PublicationEntity() {}

    public PublicationEntity(String name, double price, int copies) { super(name); this.price = price; this.copies = copies; }

    @Override public void sellItem() {
        if (copies > 0) { copies--; System.out.println("Sold '" + getName() + "'. Remaining copies: " + copies); }
        else { System.out.println("Cannot sell '" + getName() + "'. Out of stock."); }
    }

    @Override public double getPrice() { return price; }

    public void setPrice(double price) { this.price = price; }

    public int getCopies() { return copies; }

    public void setCopies(int copies) { this.copies = copies; }

    @Override public String toString() { return "Pub{title='" + getName() + "', price=" + price + ", copies=" + copies + "}"; }
}
