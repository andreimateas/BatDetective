package com.example.demo.login_system.utils.exception;

public class PasswordMissmatchException extends RuntimeException {
    public PasswordMissmatchException() {
    }

    public PasswordMissmatchException(String message) {
        super(message);
    }

    public PasswordMissmatchException(String message, Throwable cause) {
        super(message, cause);
    }
}
