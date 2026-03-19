package com.juanroy.lab6.controllers.exceptions;

public class BookNotFoundException extends RuntimeException {
    public BookNotFoundException(Long id) {
        super("Could not find book with ID: " + id);
    }
}
