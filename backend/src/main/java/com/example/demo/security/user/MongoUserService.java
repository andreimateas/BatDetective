package com.example.demo.security.user;

import com.example.demo.repository.IUsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class MongoUserService implements UserDetailsService {
    private final IUsersRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) {
        var user = userRepository.findByUsername(username);

        return user.map(SecurityUser::new)
                .orElseThrow(() -> new UsernameNotFoundException("Username not found"));
    }

    public UserDetails loadUserByEmail(String email){
        var user = userRepository.findByEmail(email);

        return user.map(SecurityUser::new)
                .orElseThrow(() -> new UsernameNotFoundException("Email is not registered;"));
    }
}
