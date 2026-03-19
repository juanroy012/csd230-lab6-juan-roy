package com.juanroy.lab6.pojos;

import java.time.LocalDate;

public class DiscMag extends Magazine {
    private boolean hasDisc;

    public DiscMag() {
    }

    public DiscMag(boolean hasDisc, int orderQty, LocalDate currentIssue, String title, double price, int copies) {
        super(orderQty, currentIssue, title, price, copies);
        this.hasDisc = hasDisc;
    }

    public boolean isHasDisc() { return hasDisc; }
    public void setHasDisc(boolean h) { this.hasDisc = h; }

    @Override
    public String toString() {
        return "DiscMag{hasDisc=" + hasDisc + ", " + super.toString() + "}";
    }
}
