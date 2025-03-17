package com.example.demo.login_system.utils.dto;

public record ChangePasswordDto(
        String oldPassword,
        String newPassword,
        String username
) {
}
