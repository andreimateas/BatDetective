package com.example.demo.security.registration;

import com.example.demo.login_system.utils.email.EmailService;
import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.repository.IUsersRepository;
import com.example.demo.security.token.TokenService;
import com.example.demo.security.token.UserToken;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.CredentialsExpiredException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;


@RequiredArgsConstructor
@Service
public class RegistrationServiceImpl implements RegistrationService {

    private final IUsersRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final TokenService tokenService;


    @Override
    //@Transactional
    public void addUser(User user) {
        var newUser = this.userRepository.save(User.builder()
                .username(user.getUsername())
                .password(passwordEncoder.encode(user.getPassword()))
                .email(user.getEmail())
                //.role(user.getRole())
                .role(Role.BASIC)
                .isEnabled(true)//default
                .build());
        this.userRepository.save(newUser);
        var token = this.tokenService.createToken(newUser, 60);

        String htmlContent = getHtmlContent(token);
        try {
            emailService.sendHtmlEmail(newUser.getEmail(), "Registration", htmlContent);

        } catch (Exception e){
            System.out.println(e.getMessage());
            System.out.println(Arrays.toString(e.getStackTrace()));
        }
    }



    @Override
    //@Transactional
    public boolean enableUser(String token) {
        var retrievedToken = this.tokenService.getToken(token);
        if (this.tokenService.isTokenValid(retrievedToken)) {
            var user = this.userRepository.findById(retrievedToken.getUser().getId()).orElseThrow(() -> new EntityNotFoundException("No user associated with token."));
            //user.setEnabled(true);
            userRepository.save(user);
            this.tokenService.removeToken(retrievedToken);
            return true;
        } else {
            throw new CredentialsExpiredException("Token is expired.");
        }
    }

    @Override
    public void removeUser(User user) {
        this.userRepository.delete(user);
    }

    //@Transactional
    @Override
    public boolean updateUser(User user) {
        this.userRepository.findByUsername(user.getUsername()).ifPresentOrElse(fetchedUser -> {

                },
                () -> {
                    throw new EntityNotFoundException("User not found");
                });

        return true;
    }


    private  String getHtmlContent(UserToken token) {
        //String validationUrl = "http://localhost:5173/enable/" + token.getToken();
        String validationToken = token.getToken();
        return "<html>" +
                "<head>" +
                "<style>" +
                "body {font-family: Arial, sans-serif; margin: 20px;}" +
                "h1 {color: #4CAF50;}" +
                "p {font-size: 16px;}" +
                "a.button {display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;}" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<h1>Welcome to BatDetective!</h1>" +
                "<p>Thank you for signing up. We're excited to have you on board.</p>" +
                "<p>Please copy the token below to activate your account:</p>" +
                "<p>" + validationToken + "</p>" +
                "<p>The token will be available for 60 minutes. </p>" +
                "<p>Best regards,<br/>Urban Bat Detective</p>" +
                "</body>" +
                "</html>";
    }
}
