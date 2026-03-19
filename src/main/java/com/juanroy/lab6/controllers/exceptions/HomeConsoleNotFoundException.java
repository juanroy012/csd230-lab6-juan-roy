package com.juanroy.lab6.controllers.exceptions;

public class HomeConsoleNotFoundException extends RuntimeException {
    public HomeConsoleNotFoundException(Long id) {
        super("Could not find home console with ID: " + id);
    }
}

