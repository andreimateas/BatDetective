package com.example.demo.security.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;

@OpenAPIDefinition(
        info = @Info(
                contact = @Contact(name = "BatDetective"),
                description = "OpenApi documentation for BatDetective",
                title = "BatDetective",
                version = "1.0",
                summary ="sdf."
        ),
        servers = {
                @Server(
                        description = "BatDetective",
                        url = "/"
                )
        }


)
@SecurityScheme(
        name = "bearerAuth",
        description = "JWT authentication",
        scheme = "Bearer",
        type = SecuritySchemeType.HTTP,
        bearerFormat = "JWT",
        in = SecuritySchemeIn.HEADER
)
public class OpenApiConfig {
}