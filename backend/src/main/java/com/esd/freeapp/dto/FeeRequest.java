package com.esd.freeapp.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class FeeRequest {
    private String description;
    private double amount;
    private LocalDate deadline;
}
