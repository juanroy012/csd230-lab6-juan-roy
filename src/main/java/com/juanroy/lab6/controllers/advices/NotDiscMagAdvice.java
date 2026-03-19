package com.juanroy.lab6.controllers.advices;

import com.juanroy.lab6.controllers.exceptions.NotDiscMagException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
class NotDiscMagAdvice {
    @ExceptionHandler(NotDiscMagException.class)
    @ResponseStatus(HttpStatus.UNPROCESSABLE_CONTENT)
    String notDiscMagHandler(NotDiscMagException ex) {
        return ex.getMessage();
    }
}

