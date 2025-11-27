package com.esd.freeapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private int employeeId;
    private String email;
    private boolean emailVerified;
    private String name;
    private String token;
}
