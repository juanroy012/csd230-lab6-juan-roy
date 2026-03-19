package com.juanroy.lab6.pojos;

import java.util.Objects;

public class Book extends Publication {
    private String author = "";

    private String isbn = "";

    public Book() {
        super();
    }

    public Book(String author) {
        this.author = author;
    }

    public Book(String author, String title, double price, int copies) {
        super(title, price, copies);
        this.author = author;
    }

    @Override
    public void sellItem() {
        setCopies(getCopies() - 1);
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String isbn) {
        this.author = author;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    @Override
    public String toString() {
        return "Book{author='" + author + "', " + super.toString() + "}";
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Book)) return false;
        if (!super.equals(o)) return false;
        Book book = (Book) o;
        return Objects.equals(author, book.author);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), author);
    }
}
