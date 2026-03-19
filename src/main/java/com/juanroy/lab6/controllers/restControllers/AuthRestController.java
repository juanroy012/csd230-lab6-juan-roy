package com.juanroy.lab6.controllers.restControllers;

import com.juanroy.lab6.entities.UserEntity;
import com.juanroy.lab6.repositories.UserEntityRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;

@RestController
@RequestMapping("/api/rest/auth")
@CrossOrigin(origins = "*")
public class AuthRestController {

    private final UserEntityRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthRestController(UserEntityRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody LoginRequest request) {
        String username = request.getUsername();
        if ((username == null || username.isBlank()) && request.getEmail() != null) {
            username = request.getEmail();
        }

        if (username == null || username.isBlank() || request.getPassword() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "username and password are required");
        }

        UserEntity user = userRepository.findByUsername(username.trim());
        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        // Lightweight session token for frontend state; this app does not validate Bearer tokens server-side.
        String rawToken = user.getUsername() + ":" + Instant.now().toEpochMilli();
        String token = Base64.getEncoder().encodeToString(rawToken.getBytes(StandardCharsets.UTF_8));

        return Map.of(
                "token", token,
                "username", user.getUsername(),
                "role", user.getRole()
        );
    }

    public static class LoginRequest {
        private String username;
        private String email;
        private String password;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}

