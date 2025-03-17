package com.example.demo.security.jwt;

import com.example.demo.security.user.SecurityUser;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RequiredArgsConstructor
@Service
public class JwtService {

    private final JwtEncoder jwtEncoder;
    private final JwtDecoder jwtDecoder;

    public String generateToken(Authentication authentication){
        Instant now = Instant.now();
        String scope = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(" "));
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(now.plus(24, ChronoUnit.HOURS))
                .subject(authentication.getName())
                .claim("userId",((SecurityUser)(authentication.getPrincipal())).getUser().getId())
                .claim("scope", scope)
                .build();
        return this.jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }

    public void authenticateToken(String token) {
        // Decode the token to extract JWT claims
        Jwt decodedJwt = jwtDecoder.decode(token);

        // Extract authorities from the 'scope' claim
        String scope = decodedJwt.getClaimAsString("scope");
        List<GrantedAuthority> authorities = Stream.of(scope.split(" "))
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
        System.out.println(authorities);

        // Create an Authentication object
        Authentication authentication = new JwtAuthenticationToken(decodedJwt, authorities);

        // Set the Authentication object in the SecurityContext
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}
