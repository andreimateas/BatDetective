package com.example.demo.security.auth;

import com.example.demo.login_system.utils.dto.LoginRequest;
import com.example.demo.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class AuthenticationService {
    private static final Logger LOGGER = LoggerFactory.getLogger(AuthenticationService.class);

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public String authenticate(LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.username(), loginRequest.password())
            );
            return jwtService.generateToken(authentication);
        } catch (AuthenticationException ex) {
            LOGGER.error("Authentication failed with message: '{}' and stacktrace '{}' ", ex.getMessage(), ex.getStackTrace());
            throw new RuntimeException(ex);
        }
    }
}
