package com.esd.freeapp.controller;

import com.esd.freeapp.dto.FeeRequest;
import com.esd.freeapp.dto.FeeResponse;
import com.esd.freeapp.model.Bill;
import com.esd.freeapp.model.Student;
import com.esd.freeapp.model.StudentBill;
import com.esd.freeapp.model.Domain;
import com.esd.freeapp.repository.BillRepository;
import com.esd.freeapp.repository.StudentRepository;
import com.esd.freeapp.repository.StudentBillRepository;
import com.esd.freeapp.repository.DomainRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/fee")
@CrossOrigin(origins = "*")
public class FeeController {

    @Autowired
    private BillRepository billRepo;

    @Autowired
    private StudentRepository studentRepo;

    @Autowired
    private StudentBillRepository studentBillRepo;

    @Autowired
    private DomainRepository domainRepo;

    // 1. ADD FEE TO STUDENT
    @PostMapping("/student/{studentId}")
    public ResponseEntity<?> addFeeToStudent(
            @PathVariable int studentId,
            @RequestBody FeeRequest request) {
        try {
            if (request.getAmount() <= 0) {
                return ResponseEntity.badRequest().body("Fee amount must be positive");
            }
            if (request.getDeadline() != null && request.getDeadline().isBefore(java.time.LocalDate.now())) {
                return ResponseEntity.badRequest().body("Deadline cannot be in the past");
            }

            Student student = studentRepo.findById(studentId).orElse(null);
            if (student == null) {
                return ResponseEntity.status(404).body("Student not found with ID: " + studentId);
            }

            Bill bill = new Bill(request.getDescription(), request.getAmount(), request.getDeadline());
            billRepo.save(bill);

            StudentBill sb = new StudentBill(student, bill);
            studentBillRepo.save(sb);

            return ResponseEntity.ok("Fee added successfully to student: " + student.getFirstName());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error adding fee: " + e.getMessage());
        }
    }

    // 2. GET FEES FOR STUDENT
    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getFeesForStudent(@PathVariable int studentId) {
        try {
            Student student = studentRepo.findById(studentId).orElse(null);
            if (student == null) {
                return ResponseEntity.status(404).body("Student not found");
            }
            List<StudentBill> bills = studentBillRepo.findByStudent_Id(studentId);

            List<FeeResponse> response = bills.stream()
                    .map(sb -> new FeeResponse(
                            sb.getBill().getId(),
                            sb.getBill().getDescription(),
                            sb.getBill().getAmount(),
                            sb.getBill().getDeadline()))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching fees: " + e.getMessage());
        }
    }

    // 3. ADD FEE TO DOMAIN
    @PostMapping("/domain/{domainId}")
    public ResponseEntity<?> addFeeToDomain(
            @PathVariable int domainId,
            @RequestBody FeeRequest request) {
        try {
            if (request.getAmount() <= 0) {
                return ResponseEntity.badRequest().body("Fee amount must be positive");
            }
            if (request.getDeadline() != null && request.getDeadline().isBefore(java.time.LocalDate.now())) {
                return ResponseEntity.badRequest().body("Deadline cannot be in the past");
            }

            Domain domain = domainRepo.findById(domainId).orElse(null);
            if (domain == null) {
                return ResponseEntity.status(404).body("Domain not found with ID: " + domainId);
            }

            List<Student> students = studentRepo.findByDomain_Id(domainId);
            if (students.isEmpty()) {
                return ResponseEntity.status(404).body("No students found in domain: " + domain.getName());
            }

            Bill bill = new Bill(request.getDescription(), request.getAmount(), request.getDeadline());
            billRepo.save(bill);

            for (Student s : students) {
                StudentBill sb = new StudentBill(s, bill);
                studentBillRepo.save(sb);
            }

            return ResponseEntity.ok("Fee added to " + students.size() + " students in domain: " + domain.getName());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error adding fee to domain: " + e.getMessage());
        }
    }

    // 4. UPDATE FEE
    @PutMapping("/{billId}")
    public ResponseEntity<?> updateFee(
            @PathVariable int billId,
            @RequestBody FeeRequest request) {
        try {
            if (request.getAmount() <= 0) {
                return ResponseEntity.badRequest().body("Fee amount must be positive");
            }
            if (request.getDeadline() != null && request.getDeadline().isBefore(java.time.LocalDate.now())) {
                return ResponseEntity.badRequest().body("Deadline cannot be in the past");
            }

            Bill bill = billRepo.findById(billId).orElse(null);
            if (bill == null) {
                return ResponseEntity.status(404).body("Bill not found with ID: " + billId);
            }

            bill.setDescription(request.getDescription());
            bill.setAmount(request.getAmount());
            bill.setDeadline(request.getDeadline());

            billRepo.save(bill);
            return ResponseEntity.ok("Fee updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating fee: " + e.getMessage());
        }
    }

    // 5. DELETE FEE
    @DeleteMapping("/{billId}")
    public ResponseEntity<?> deleteFee(@PathVariable int billId) {
        try {
            if (!billRepo.existsById(billId)) {
                return ResponseEntity.status(404).body("Bill not found with ID: " + billId);
            }

            List<StudentBill> studentBills = studentBillRepo.findByBill_Id(billId);
            studentBillRepo.deleteAll(studentBills);

            billRepo.deleteById(billId);
            return ResponseEntity.ok("Fee deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting fee: " + e.getMessage());
        }
    }
}