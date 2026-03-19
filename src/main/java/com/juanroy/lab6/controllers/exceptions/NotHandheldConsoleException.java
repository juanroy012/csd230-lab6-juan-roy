package com.juanroy.lab6.controllers.exceptions;

public class NotHandheldConsoleException extends RuntimeException {
    public NotHandheldConsoleException(Long id) {
        super("Item with the id " + id + " is not a handheld console!");
    }
}

