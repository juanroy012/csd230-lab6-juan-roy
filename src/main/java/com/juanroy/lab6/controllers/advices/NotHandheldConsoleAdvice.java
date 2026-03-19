package com.juanroy.lab6.controllers.advices;

import com.juanroy.lab6.controllers.exceptions.NotHandheldConsoleException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
class NotHandheldConsoleAdvice {
    @ExceptionHandler(NotHandheldConsoleException.class)
    @ResponseStatus(HttpStatus.UNPROCESSABLE_CONTENT)
    String notHandheldConsoleHandler(NotHandheldConsoleException ex) {
        return ex.getMessage();
    }
}

