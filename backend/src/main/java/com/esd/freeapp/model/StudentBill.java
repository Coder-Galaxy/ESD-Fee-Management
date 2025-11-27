package com.esd.freeapp.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class StudentBill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    /**
     * Link back to Student. We use @JsonIgnoreProperties to avoid serializing
     * the student's 'bills' field again and creating recursion.
     */
    @ManyToOne
    @JoinColumn(name = "student_id")
    @JsonIgnoreProperties({ "bills" })
    private Student student;

    @ManyToOne
    @JoinColumn(name = "bill_id")
    private Bill bill;

    public StudentBill(Student student, Bill bill) {
        this.student = student;
        this.bill = bill;
    }
}