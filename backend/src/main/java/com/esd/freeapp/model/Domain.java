package com.esd.freeapp.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Domain {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;
}