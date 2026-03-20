package com.juanroy.lab6.controllers.restControllers;

import com.juanroy.lab6.auth.JwtUtil;
import com.juanroy.lab6.entities.UserEntity;
import com.juanroy.lab6.repositories.UserEntityRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rest/auth")
@CrossOrigin(origins = "*")
public class AuthRestController {

    private final UserEntityRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthRestController(UserEntityRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
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

        String role = user.getRole();
        String grantedRole = role != null && role.startsWith("ROLE_") ? role : "ROLE_" + role;
        String token = jwtUtil.createToken(user.getUsername(), List.of(new SimpleGrantedAuthority(grantedRole)));

        return Map.of(
                "token", token,
                "username", user.getUsername(),
                "role", role
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

