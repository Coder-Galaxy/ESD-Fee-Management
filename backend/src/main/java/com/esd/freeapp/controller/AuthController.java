package com.esd.freeapp.controller;

import com.esd.freeapp.dto.LoginResponse;
import com.esd.freeapp.model.Employee;
import com.esd.freeapp.repository.EmployeeRepository;
import com.esd.freeapp.service.GoogleTokenVerifierService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private GoogleTokenVerifierService tokenVerifier;

    @Autowired
    private EmployeeRepository employeeRepo;

    @Autowired
    private com.esd.freeapp.util.JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        String idTokenString = payload.get("idToken");
        if (idTokenString == null) {
            return ResponseEntity.badRequest().body("Missing idToken");
        }

        Optional<GoogleIdToken.Payload> payloadOpt = Optional.empty();

        // DEV BYPASS
        if ("dev-token".equals(idTokenString)) {
            GoogleIdToken.Payload devPayload = new GoogleIdToken.Payload();
            devPayload.setEmail("18BCS1429@gmail.com");
            devPayload.setEmailVerified(true);
            devPayload.set("name", "Dev Admin");
            payloadOpt = Optional.of(devPayload);
        } else {
            // Verify with Google
            payloadOpt = tokenVerifier.verify(idTokenString);
        }

        if (payloadOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Invalid Google Token");
        }

        GoogleIdToken.Payload googlePayload = payloadOpt.get();
        String email = googlePayload.getEmail();
        boolean emailVerified = googlePayload.getEmailVerified();
        String name = (String) googlePayload.get("name");

        // Check if employee exists
        Employee employee = employeeRepo.findByEmail(email);
        if (employee == null) {
            return ResponseEntity.status(403).body("User not authorized. Email not found in Employee records.");
        }

        String token = jwtUtils.generateToken(email);

        return ResponseEntity.ok(new LoginResponse(
                employee.getId(),
                employee.getEmail(),
                emailVerified,
                name,
                token));
    }

    @PostMapping("/login-email")
    public ResponseEntity<?> loginWithEmail(@RequestBody com.esd.freeapp.dto.LoginRequest request) {
        Employee employee = employeeRepo.findByEmail(request.getEmail());
        if (employee == null) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }

        // In a real app, verify password hash. For this demo, simple string check or
        // empty check.
        // Assuming plain text for this legacy system refactor as per context, or simple
        // check.
        if (!employee.getPassword().equals(request.getPassword())) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }

        String token = jwtUtils.generateToken(employee.getEmail());

        return ResponseEntity.ok(new LoginResponse(
                employee.getId(),
                employee.getEmail(),
                true,
                employee.getFirstName() + " " + employee.getLastName(),
                token));
    }
}