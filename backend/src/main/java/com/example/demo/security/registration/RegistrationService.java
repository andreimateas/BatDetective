package com.example.demo.security.registration;


import com.example.demo.model.User;

public interface RegistrationService {
    void addUser(User user);

    boolean enableUser(String token);

    void removeUser(User user);

    boolean updateUser(User user);
}
