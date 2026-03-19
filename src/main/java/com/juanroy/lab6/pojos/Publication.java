package com.juanroy.lab6.pojos;

import java.util.Objects;

public abstract class Publication extends Product {
    private String title = "";
    private double price = 0.0;
    private int copies = 0;

    public Publication() {
    }

    public Publication(String title, double price, int copies) {
        this.title = title;
        this.price = price;
        this.copies = copies;
    }

    @Override
    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getCopies() {
        return copies;
    }

    public void setCopies(int copies) {
        this.copies = copies;
    }

    @Override
    public String toString() {
        return "Publication{title='" + title + "', price=" + price + ", copies=" + copies + "}";
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Publication)) return false;
        Publication that = (Publication) o;
        return Double.compare(that.price, price) == 0 &&
                copies == that.copies &&
                Objects.equals(title, that.title);
    }

    @Override
    public int hashCode() {
        return Objects.hash(title, price, copies);
    }
}
