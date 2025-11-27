package com.esd.freeapp.repository;

import com.esd.freeapp.model.Domain;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DomainRepository extends JpaRepository<Domain, Integer> {
}