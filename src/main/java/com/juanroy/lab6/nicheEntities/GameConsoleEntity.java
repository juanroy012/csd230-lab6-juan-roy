package com.juanroy.lab6.nicheEntities;

import com.juanroy.lab6.entities.ProductEntity;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;

import java.util.Objects;

@MappedSuperclass
public abstract class GameConsoleEntity extends ProductEntity {

    @Column(name = "manufacturer")
    private String manufacturer;

    @Column(name = "console_price")
    private double price;

    @Column(name = "quantity")
    private int quantity;

    public GameConsoleEntity() {}

    public GameConsoleEntity(String name, String manufacturer, double price, int quantity){
        this.setName(name);
        this.manufacturer = manufacturer;
        this.price = price;
        this.quantity = quantity;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    @Override
    public double getPrice() {
        return price;
    }

    @Override public void sellItem() {
        if (quantity > 0) { quantity--; System.out.println("Sold '" + getName() + "'. Remaining quantities: " + quantity); }
        else { System.out.println("Cannot sell '" + getName() + "'. Out of stock."); }
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof GameConsoleEntity that)) return false;
        if (!super.equals(o)) return false;
        return Double.compare(price, that.price) == 0 && quantity == that.quantity && Objects.equals(getName(), that.getName()) && Objects.equals(manufacturer, that.manufacturer);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), getName(), manufacturer, price, quantity);
    }

    @Override
    public String toString() {
        return "GameConsoleEntity{" +
                "name='" + getName() + '\'' +
                ", manufacturer='" + manufacturer + '\'' +
                ", price=" + price +
                ", quantity=" + quantity +
                "} " + super.toString();
    }
}