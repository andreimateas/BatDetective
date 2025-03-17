package com.example.demo.login_system.utils.exception;

import com.example.demo.utils.Result;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AccountStatusException;
import org.springframework.security.authentication.CredentialsExpiredException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.server.resource.InvalidBearerTokenException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.servlet.NoHandlerFoundException;

@RestControllerAdvice
public class ExceptionHandlerAdvice {

    @ExceptionHandler(EntityNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    Result<String> handleEntityNotFoundException(EntityNotFoundException ex) {
        return new Result<>(false, HttpStatus.NOT_FOUND.value(), ex.getMessage());
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    Result<String> handleAuthenticationException(Exception ex) {
        return new Result<>(false, HttpStatus.UNAUTHORIZED.value(), ex.getMessage());
    }

    @ExceptionHandler(InsufficientAuthenticationException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    Result<String> handleInsufficientAuthenticationException(InsufficientAuthenticationException ex) {
        return new Result<>(false, HttpStatus.UNAUTHORIZED.value(), "Login credentials are missing.", ex.getMessage());
    }

    @ExceptionHandler(AccountStatusException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    Result<String> handleAccountStatusException(AccountStatusException ex) {
        return new Result<>(false, HttpStatus.UNAUTHORIZED.value(), "User account is abnormal.", ex.getMessage());
    }

    @ExceptionHandler(InvalidBearerTokenException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    Result<String> handleInvalidBearerTokenException(InvalidBearerTokenException ex) {
        return new Result<>(false, HttpStatus.UNAUTHORIZED.value(), "The access token provided is expired, revoked, malformed, or invalid for other reasons.", ex.getMessage());
    }

    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    Result<String> handleAccessDeniedException(AccessDeniedException ex) {
        return new Result<>(false, HttpStatus.FORBIDDEN.value(), "No permission.", ex.getMessage());
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    Result<String> handleNoHandlerFoundException(NoHandlerFoundException ex) {
        return new Result<>(false, HttpStatus.NOT_FOUND.value(), "This API endpoint is not found.", ex.getMessage());
    }

    @ExceptionHandler(CredentialsExpiredException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    Result<String> handleCredentialsExpiredException(CredentialsExpiredException ex) {
        return new Result<>(false, HttpStatus.UNAUTHORIZED.value(), "This API endpoint is not found.", ex.getMessage());
    }

    @ExceptionHandler(UserServiceException.class)
    @ResponseStatus(HttpStatus.NOT_ACCEPTABLE)
    Result<String> handleUserServiceException(UserServiceException ex) {
        return new Result<>(false, HttpStatus.NOT_ACCEPTABLE.value(), "Input was invalid.", ex.getMessage());
    }

    @ExceptionHandler(PasswordMissmatchException.class)
    @ResponseStatus(HttpStatus.NOT_ACCEPTABLE)
    Result<String> handleUserServiceException(PasswordMissmatchException ex) {
        return new Result<>(false, HttpStatus.NOT_ACCEPTABLE.value(), "Input was invalid.", ex.getMessage());
    }

    @ExceptionHandler({HttpClientErrorException.class, HttpServerErrorException.class})
    ResponseEntity<Result<String>> handleRestClientException(HttpStatusCodeException ex) throws JsonProcessingException {
        String exceptionMessage = ex.getMessage();

        // Replace <EOL> with actual newlines.
        exceptionMessage = exceptionMessage.replace("<EOL>", "\n");

        // Extract the JSON part from the string.
        String jsonPart = exceptionMessage.substring(exceptionMessage.indexOf("{"), exceptionMessage.lastIndexOf("}") + 1);

        // Create an ObjectMapper instance.
        ObjectMapper mapper = new ObjectMapper();

        // Parse the JSON string to a JsonNode.
        JsonNode rootNode = mapper.readTree(jsonPart);

        // Extract the message.
        String formattedExceptionMessage = rootNode.path("error").path("message").asText();

        return new ResponseEntity<>(
                new Result<>(false,
                        ex.getStatusCode().value(),
                        "A rest client error occurs, see data for details.",
                        formattedExceptionMessage),
                ex.getStatusCode());
    }


    /**
     * Fallback handles any unhandled exceptions.
     */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    Result handleOtherException(Exception ex) {
        return new Result(false, HttpStatus.INTERNAL_SERVER_ERROR.value(), ex.getMessage(), "");
    }
}
