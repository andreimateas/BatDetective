package com.example.demo.security.token;


import com.example.demo.model.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@RequiredArgsConstructor
@Service
public class TokenServiceImpl implements TokenService{
    private final TokenRepository tokenRepository;
    @Override
    public boolean isTokenValid(UserToken userToken) {
        return LocalDateTime.now().isBefore(userToken.getExpires());
    }

    @Override
    public UserToken createToken(User user, int availability) {
        return this.tokenRepository.save(UserToken.builder()
                .token(TokenGenerator.generateToken())
                .expires(LocalDateTime.now().plusMinutes(availability))
                .user(user)
                .build());
    }

    @Override
    public UserToken getToken(String token) {
        return this.tokenRepository.findByToken(token).orElseThrow(() -> new EntityNotFoundException("Token not found"));
    }

    @Override
    public void removeToken(UserToken userToken) {
        this.tokenRepository.delete(userToken);
    }
}
