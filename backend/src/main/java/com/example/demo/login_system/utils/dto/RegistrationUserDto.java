package com.example.demo.login_system.utils.dto;

import com.example.demo.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class RegistrationUserDto {
    private String username;
    private String password;
    private String email;
    //private Role role;
}
