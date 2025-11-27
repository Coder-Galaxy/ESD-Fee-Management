package com.esd.freeapp.dto;

import lombok.Data;

@Data
public class StudentRequest {
    private String firstName;
    private String lastName;
    private String rollNumber;
    private int domainId;
}
