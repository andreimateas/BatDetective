package com.example.demo.login_system.utils.dto;


import com.example.demo.model.Role;

public record UserAdminDto(
        String id,
        String username,
        String email,
        Role role,
        boolean isEnabled
) {
}
