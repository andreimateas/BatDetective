package com.example.demo.login_system.utils.converter;

import com.example.demo.login_system.utils.dto.UserDto;
import com.example.demo.model.User;
import com.example.demo.utils.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class UserDtoConverter implements Converter<User, UserDto> {
    @Override
    public User createFromDto(UserDto dto) {
        return User.builder()
                .id(dto.id())
                .username(dto.username())
                .email(dto.email())
                .role(dto.role())
                .build();
    }

    @Override
    public UserDto createFromEntity(User entity) {
        return new UserDto(
                entity.getId(),
                entity.getUsername(),
                entity.getEmail(),
                entity.getRole());
    }
}
