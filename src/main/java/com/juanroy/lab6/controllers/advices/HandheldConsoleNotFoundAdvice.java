package com.juanroy.lab6.controllers.advices;

import com.juanroy.lab6.controllers.exceptions.HandheldConsoleNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
class HandheldConsoleNotFoundAdvice {
    @ExceptionHandler(HandheldConsoleNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    String handheldConsoleNotFoundHandler(HandheldConsoleNotFoundException ex) {
        return ex.getMessage();
    }
}

