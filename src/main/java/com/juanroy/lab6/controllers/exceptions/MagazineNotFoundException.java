package com.juanroy.lab6.controllers.exceptions;

public class MagazineNotFoundException extends RuntimeException {
    public MagazineNotFoundException(Long id) {
        super("Could not find magazine with ID: " + id);
    }
}
