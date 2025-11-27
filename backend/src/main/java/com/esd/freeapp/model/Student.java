package com.esd.freeapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String firstName;
    private String lastName;
    private String rollNumber;

    @ManyToOne
    @JoinColumn(name = "domain_id")
    private Domain domain;

    /**
     * Cascade all operations to StudentBill and remove orphaned StudentBill rows when
     * they are no longer referenced by this Student.
     *
     * Json is ignored here to avoid infinite recursion when serializing Student.
     * If you want to include bills in some API, use DTOs or a @JsonManagedReference/@JsonBackReference pair.
     */
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<StudentBill> bills = new ArrayList<>();
}
