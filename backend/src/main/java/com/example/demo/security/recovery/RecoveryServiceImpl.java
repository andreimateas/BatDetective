package com.example.demo.security.recovery;


import com.example.demo.login_system.utils.dto.PasswordResetDto;
import com.example.demo.login_system.utils.email.EmailService;
import com.example.demo.repository.IUsersRepository;
import com.example.demo.security.token.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.regex.Pattern;

@RequiredArgsConstructor
@Service
public class RecoveryServiceImpl implements RecoveryService {
    private final IUsersRepository userRepository;
    private final TokenService tokenService;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Override
    //@Transactional
    public void recoveryRequest(String email) {
        System.out.println(email);
        var user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        var token = tokenService.createToken(user, 5);
        String htmlContent = "<html>" +
                "<head>" +
                "<style>" +
                "body {font-family: Arial, sans-serif; margin: 20px;}" +
                "h1 {color: #4CAF50;}" +
                "p {font-size: 16px;}" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<h1>Hello. This is your token user for resetting the password</h1>" +
                "<p>If you did not request a password reset please check your account for any suspicious activity.</p>" +
                "<p>Clicking on the link it will generate and automatic password which will be sent via email.</p>" +
                "<p>" + token.getToken() + "</p>" +
                "<h1> We should put a link to the website here. </h1>" +
                "<p>The token will be available for 5 minutes. </p>" +
                "<p>Best regards,<br/>The Team</p>" +
                "</body>" +
                "</html>";
        emailService.sendHtmlEmail(user.getEmail(), "Password reset", htmlContent);
    }

    @Override
    //@Transactional
    public void resetPassword(String token) {
        var retrievedToken = tokenService.getToken(token);
        var user = retrievedToken.getUser();
        var password = PasswordGenerator.generateValidRandomPassword(12);
        String htmlContent = "<html>" +
                "<head>" +
                "<style>" +
                "body {font-family: Arial, sans-serif; margin: 20px;}" +
                "h1 {color: #4CAF50;}" +
                "p {font-size: 16px;}" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<h1>This is you new password.</h1>" +
                "<p>" + password + "</p>" +
                "<p>Best regards,<br/>The Team</p>" +
                "</body>" +
                "</html>";
        emailService.sendHtmlEmail(user.getEmail(), "Password reset", htmlContent);
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
        tokenService.removeToken(retrievedToken);
    }

    @Override
    //@Transactional
    public void resetPassword(PasswordResetDto passwordResetDto){
        var token = tokenService.getToken(passwordResetDto.token());
        var user = token.getUser();
        user.setPassword(passwordEncoder.encode(passwordResetDto.password()));
        tokenService.removeToken(token);
    }

}

class PasswordGenerator {

    private static final String UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
    private static final String DIGITS = "0123456789";
    private static final String SPECIAL_CHARACTERS = "!@#$%^&*()-_+=<>?";
    private static final String ALL_CHARACTERS = UPPERCASE + LOWERCASE + DIGITS + SPECIAL_CHARACTERS;
    private static final Pattern LETTER_PATTERN = Pattern.compile("[a-zA-Z]");
    private static final Pattern DIGIT_PATTERN = Pattern.compile("\\d");
    private static final Pattern SPECIAL_PATTERN = Pattern.compile("[!@#$%^&*()\\-_=+<>?]");
    private static final SecureRandom RANDOM = new SecureRandom();

    public static String generateValidRandomPassword(int length) {
        if (length < 4) {
            throw new IllegalArgumentException("Password length must be at least 4 characters");
        }

        StringBuilder password = new StringBuilder(length);

        // Ensure at least one character from each set
        password.append(UPPERCASE.charAt(RANDOM.nextInt(UPPERCASE.length())));
        password.append(LOWERCASE.charAt(RANDOM.nextInt(LOWERCASE.length())));
        password.append(DIGITS.charAt(RANDOM.nextInt(DIGITS.length())));
        password.append(SPECIAL_CHARACTERS.charAt(RANDOM.nextInt(SPECIAL_CHARACTERS.length())));

        // Fill the remaining characters
        for (int i = 4; i < length; i++) {
            password.append(ALL_CHARACTERS.charAt(RANDOM.nextInt(ALL_CHARACTERS.length())));
        }

        // Shuffle the characters to ensure randomness
        return shuffleString(password.toString());
    }

    private static String shuffleString(String input) {
        char[] characters = input.toCharArray();
        for (int i = 0; i < characters.length; i++) {
            int randomIndex = RANDOM.nextInt(characters.length);
            char temp = characters[i];
            characters[i] = characters[randomIndex];
            characters[randomIndex] = temp;
        }
        return new String(characters);
    }

    private static boolean isValidPassword(String password) {
        return LETTER_PATTERN.matcher(password).find() &&
                DIGIT_PATTERN.matcher(password).find() &&
                SPECIAL_PATTERN.matcher(password).find();
    }
}



