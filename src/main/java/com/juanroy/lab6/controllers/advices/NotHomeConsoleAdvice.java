package com.juanroy.lab6.controllers.advices;

import com.juanroy.lab6.controllers.exceptions.NotHomeConsoleException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
class NotHomeConsoleAdvice {
    @ExceptionHandler(NotHomeConsoleException.class)
    @ResponseStatus(HttpStatus.UNPROCESSABLE_CONTENT)
    String notHomeConsoleHandler(NotHomeConsoleException ex) {
        return ex.getMessage();
    }
}

