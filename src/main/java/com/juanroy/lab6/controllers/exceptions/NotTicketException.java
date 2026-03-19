package com.juanroy.lab6.controllers.exceptions;

public class NotTicketException extends RuntimeException {
    public NotTicketException(Long id) {
        super("Item with the id " + id + " is not a ticket!");
    }
}

