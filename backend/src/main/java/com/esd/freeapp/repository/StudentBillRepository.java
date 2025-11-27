package com.esd.freeapp.repository;

import com.esd.freeapp.model.StudentBill;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StudentBillRepository extends JpaRepository<StudentBill, Integer> {
    List<StudentBill> findByStudent_Id(int studentId);

    List<StudentBill> findByBill_Id(int billId);
}
