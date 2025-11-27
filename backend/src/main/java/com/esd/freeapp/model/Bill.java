package com.esd.freeapp.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String description;
    private double amount;
    private LocalDate deadline;

    // DEFAULT CONSTRUCTOR (required by JPA)
    public Bill() {
    }

    // ✅ ADDED CONSTRUCTOR (this fixes your error)
    public Bill(String description, double amount, LocalDate deadline) {
        this.description = description;
        this.amount = amount;
        this.deadline = deadline;
    }

    // Getters & Setters

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }
}
