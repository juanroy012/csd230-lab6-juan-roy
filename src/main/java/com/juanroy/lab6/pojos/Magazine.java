package com.juanroy.lab6.pojos;

import java.time.LocalDate;

public class Magazine extends Publication {
    private int orderQty = 0;
    private LocalDate currentIssue = LocalDate.now();

    public Magazine() {
    }

    public Magazine(int orderQty, LocalDate currentIssue, String title, double price, int copies) {
        super(title, price, copies);
        this.orderQty = orderQty;
        this.currentIssue = currentIssue;
    }

    @Override
    public void sellItem() {
        setCopies(getCopies() - 1);
    }

    public int getOrderQty() { return orderQty; }
    public void setOrderQty(int o) { this.orderQty = o; }
    public LocalDate getCurrentIssue() { return currentIssue; }
    public void setCurrentIssue(LocalDate d) { this.currentIssue = d; }

    @Override
    public String toString() {
        return "Magazine{orderQty=" + orderQty + ", issue=" + currentIssue + ", " + super.toString() + "}";
    }
}
