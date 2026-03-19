package com.juanroy.lab6.entities;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("BOOK")
public class BookEntity extends PublicationEntity {

    private String author;

    public BookEntity() {}

    public BookEntity(String name, double price, int copies, String author) { super(name, price, copies); this.author = author; }

    public String getAuthor() { return author; }

    public void setAuthor(String author) { this.author = author; }

    @Override public String toString() { return "Book{author='" + author + "', " + super.toString() + "}"; }
}
