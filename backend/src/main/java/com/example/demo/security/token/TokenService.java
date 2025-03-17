package com.example.demo.security.token;


import com.example.demo.model.User;

public interface TokenService {
    boolean isTokenValid(UserToken userToken);

    UserToken createToken(User user, int availability);

    UserToken getToken(String token);

    void removeToken(UserToken userToken);
}
