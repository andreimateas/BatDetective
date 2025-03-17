package com.example.demo.security.recovery;

import com.example.demo.login_system.utils.dto.PasswordResetDto;

public interface RecoveryService {
    void recoveryRequest(String email);
    void resetPassword(String token);
    void resetPassword(PasswordResetDto passwordResetDto);

}
