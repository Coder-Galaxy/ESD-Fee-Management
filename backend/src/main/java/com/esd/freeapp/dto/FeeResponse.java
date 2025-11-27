package com.esd.freeapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDate;

@Data
@AllArgsConstructor
public class FeeResponse {
    private int billId;
    private String description;
    private double amount;
    private LocalDate deadline;
}
