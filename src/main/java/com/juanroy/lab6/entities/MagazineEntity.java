package com.juanroy.lab6.entities;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

import java.time.LocalDateTime;

@Entity
@DiscriminatorValue("MAGAZINE")
public class MagazineEntity extends PublicationEntity {

    private int orderQty;

    private LocalDateTime currentIssue;

    public MagazineEntity() {}

    public MagazineEntity(String n, double p, int c, int o, LocalDateTime d) { super(n, p, c); this.orderQty = o; this.currentIssue = d; }

    public int getOrderQty() { return orderQty; }

    public void setOrderQty(int o) { this.orderQty = o; }

    public void setCurrentIssue(LocalDateTime d) { this.currentIssue = d; }

    public LocalDateTime getCurrentIssue() { return currentIssue; }

    @Override public String toString() { return "Mag{issue=" + currentIssue + ", " + super.toString() + "}"; }
}
