package com.example.demo.utils.validations;


import jakarta.validation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class GenericValidator<T> {

    // Create a single ValidatorFactory instance and reuse it
    private static final ValidatorFactory validatorFactory = Validation.buildDefaultValidatorFactory();
    private static final Validator validator = validatorFactory.getValidator();

    // Logger instance
    private static final Logger logger = LoggerFactory.getLogger(GenericValidator.class);

    // Shutdown hook to close the factory when the application stops
    static {
        Runtime.getRuntime().addShutdownHook(new Thread(validatorFactory::close));
    }

    public void validate(T t) {
        // Use the validator to validate the object
        Set<ConstraintViolation<T>> violations = validator.validate(t);

        // If violations are found, log them and throw a ConstraintViolationException
        if (!violations.isEmpty()) {
            // Log each violation
            for (ConstraintViolation<T> violation : violations) {
                logger.error("Validation error: {} - invalid value: {}, violation: {}",
                        violation.getPropertyPath(),
                        violation.getInvalidValue(),
                        violation.getMessage());
            }
            // Throw exception after logging
            throw new ConstraintViolationException(violations);
        }
    }
}