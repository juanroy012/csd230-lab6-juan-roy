package com.juanroy.lab6.controllers.exceptions;

public class NotBookException extends RuntimeException {
    public NotBookException(Long id) {
        super("Item with the id " + id + " is not a book!");
    }
}
