package com.example.demo.login_system.utils.converter;


import com.example.demo.login_system.utils.dto.RegistrationUserDto;
import com.example.demo.model.User;
import com.example.demo.utils.converter.Converter;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class RegistrationUserDtoConverter implements Converter<User, RegistrationUserDto> {

    @Override
    public User createFromDto(RegistrationUserDto dto) {
        return User.builder()
                .username(dto.getUsername())
                .password(dto.getPassword())
                .email(dto.getEmail())
                //.role(dto.getRole())
                .build();

    }

    @Override
    public RegistrationUserDto createFromEntity(User entity) {
        return null;
    }
}
