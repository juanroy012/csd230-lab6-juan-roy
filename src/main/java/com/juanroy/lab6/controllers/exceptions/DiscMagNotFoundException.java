package com.juanroy.lab6.controllers.exceptions;

public class DiscMagNotFoundException extends RuntimeException {
    public DiscMagNotFoundException(Long id) {
        super("Could not find disc magazine with ID: " + id);
    }
}

