package com.juanroy.lab6.controllers.exceptions;

public class HandheldConsoleNotFoundException extends RuntimeException {
    public HandheldConsoleNotFoundException(Long id) {
        super("Could not find handheld console with ID: " + id);
    }
}

