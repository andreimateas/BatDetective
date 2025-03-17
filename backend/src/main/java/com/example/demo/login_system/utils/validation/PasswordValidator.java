package com.example.demo.login_system.utils.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordValidator implements ConstraintValidator<ValidPassword, String> {

    private int minLength;
    private String pattern;

    @Override
    public void initialize(ValidPassword constraintAnnotation) {
        this.minLength = constraintAnnotation.minLength();
        this.pattern = constraintAnnotation.pattern();
    }

    @Override
    public boolean isValid(String password, ConstraintValidatorContext context) {
        if (password == null || password.isBlank()) {
            return false;
        }

        // Check the minimum length
        if (password.length() < minLength) {
            return false;
        }

        // Check the pattern
        return password.matches(pattern);
    }
}
