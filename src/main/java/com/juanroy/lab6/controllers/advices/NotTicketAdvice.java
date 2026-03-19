package com.juanroy.lab6.controllers.advices;

import com.juanroy.lab6.controllers.exceptions.NotTicketException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
class NotTicketAdvice {
    @ExceptionHandler(NotTicketException.class)
    @ResponseStatus(HttpStatus.UNPROCESSABLE_CONTENT)
    String notTicketHandler(NotTicketException ex) {
        return ex.getMessage();
    }
}

