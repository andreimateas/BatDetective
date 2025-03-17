package com.example.demo.controller;

import com.example.demo.login_system.utils.converter.RegistrationUserDtoConverter;
import com.example.demo.login_system.utils.dto.LoginRequest;
import com.example.demo.login_system.utils.dto.PasswordResetDto;
import com.example.demo.login_system.utils.dto.RegistrationUserDto;
import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.security.auth.AuthenticationService;
import com.example.demo.security.recovery.RecoveryService;
import com.example.demo.security.registration.RegistrationService;
import com.example.demo.service.UserService;
import com.example.demo.utils.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.endpoint.base-url}/auth")
@Tag(name = "Authentication")
public class AuthController {

    private final AuthenticationService authenticationService;
    private final RegistrationUserDtoConverter registrationUserDtoConverter;
    private final RegistrationService registrationService;
    private final RecoveryService recoveryService;
    private final UserService userService;

    @Operation(
            description = "Login endpoint.",
            summary = "Login endpoint. Generates the JWT needed for further operations."
    )
    @PostMapping("/login")
    public Result<String> login(@RequestBody LoginRequest loginRequest) {

        var token = this.authenticationService.authenticate(loginRequest);
        return new Result<>(true, HttpStatus.OK.value(), "Login successful.", token);
    }

    @Operation(
            description = "REGISTER",
            summary = "Registration endpoint. After registering it sends an email with confirmation token."
    )
    @PostMapping("/register")
    public Result<?> register(@RequestBody RegistrationUserDto registrationUserDto) {
        try {
            this.registrationService.addUser(this.registrationUserDtoConverter.createFromDto(registrationUserDto));
        } catch (Exception e){
            System.out.println(e.getMessage());
            System.out.println(Arrays.toString(e.getStackTrace()));
        }

       //this.registrationService.addUser(this.registrationUserDtoConverter.createFromDto(registrationUserDto));
        return new Result<>(true, HttpStatus.CREATED.value(), "User created successfully", null);
    }
    @Operation(
            description = "ENABLE USER",
            summary = "To enable the user the token received in the email must be passed to the endpoint."
    )
    @PutMapping("/enable/{token}")
    public Result<?> enableUser(@PathVariable String token) {
        this.registrationService.enableUser(token);
        return new Result<>(true, HttpStatus.OK.value(), "User enabled successfully.", null);
    }

//    @Operation(
//            description = "RESET PASSWORD REQUEST",
//            summary = "Forgot password. It will send an email with a token/link for password reset."
//    )
//    @PostMapping("/reset-password")
//    public Result<?> resetPasswordRequest(@RequestBody String email) {
//        this.recoveryService.recoveryRequest(email);
//        return new Result<>(true, HttpStatus.OK.value(), "Email with token sent. Please check your email.", null);
//    }
//    @Operation(
//            description = "RESET PASSWORD",
//            summary = "Token from the email must be passed as a path variable to reset the password. Random password is generated"
//    )
//    @PostMapping("/reset-password-email/{token}")
//    public Result<?> sendPassword(@PathVariable String token) {
//        this.recoveryService.resetPassword(token);
//        return new Result<>(true, HttpStatus.OK.value(), "Password sent to email.", null);
//    }
//
//    @Operation(
//            description = "RESET PASSWORD WITH LINK",
//            summary = "Input new password along with the token provided in email."
//    )
//    @PutMapping("/reset-password")
//    public Result<?> resetPassword(@RequestBody PasswordResetDto passwordResetDto) {
//        this.recoveryService.resetPassword(passwordResetDto);
//        return new Result<>(true, HttpStatus.OK.value(), "Password reset successfully", null);
//    }

    @Operation(
            description = "Promotion to admin by the owner",
            summary = "Input the email of the user to be promoted ."
    )
    @PutMapping("/promote_admin")
    public Result<?> promoteAdmin(@RequestBody String email) {
        User user = this.userService.getUserByEmail(email);
        if(user.getRole()!= Role.ADMIN && user.getRole()!=Role.OWNER){
            user.setRole(Role.ADMIN);
            this.userService.updateUser(user.getId(),user);
        }
        return new Result<>(true, HttpStatus.OK.value(), "Promote to admin succesful", null);
    }



}
