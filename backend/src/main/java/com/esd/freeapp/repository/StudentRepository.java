package com.esd.freeapp.repository;

import com.esd.freeapp.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Integer> {
    List<Student> findByDomain_Id(int domainId);
}