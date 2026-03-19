package com.juanroy.lab6.entities;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

import java.time.LocalDateTime;

@Entity
@DiscriminatorValue("DISCMAG")
public class DiscMagEntity extends MagazineEntity {

    private boolean hasDisc;

    public DiscMagEntity() {}

    public DiscMagEntity(String n, double p, int c, int o, LocalDateTime d, boolean h) { super(n, p, c, o, d); this.hasDisc = h; }

    public boolean isHasDisc() { return hasDisc; }

    public void setHasDisc(boolean h) { this.hasDisc = h; }

    @Override public String toString() { return "DiscMag{disc=" + hasDisc + ", " + super.toString() + "}"; }
}
