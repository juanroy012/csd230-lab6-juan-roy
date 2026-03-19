package com.juanroy.lab6.controllers.exceptions;

public class NotDiscMagException extends RuntimeException {
    public NotDiscMagException(Long id) {
        super("Item with the id " + id + " is not a disc magazine!");
    }
}

