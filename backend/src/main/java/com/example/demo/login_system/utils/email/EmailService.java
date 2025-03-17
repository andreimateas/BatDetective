package com.example.demo.login_system.utils.email;

public interface EmailService {
    void sendEmail(String to, String subject, String body);
    void sendHtmlEmail(String to, String subject, String body);
}
