package com.esd.freeapp.controller;

import com.esd.freeapp.model.Student;
import com.esd.freeapp.model.Domain;
import com.esd.freeapp.repository.StudentRepository;
import com.esd.freeapp.repository.DomainRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/student")
public class StudentController {

    @Autowired
    private StudentRepository studentRepo;

    @Autowired
    private DomainRepository domainRepo;

    // ADD
    @PostMapping
    public String addStudent(@RequestBody com.esd.freeapp.dto.StudentRequest request) {

        Domain d = domainRepo.findById(request.getDomainId()).orElse(null);
        if (d == null)
            return "Domain not found";

        Student s = new Student();
        s.setFirstName(request.getFirstName());
        s.setLastName(request.getLastName());
        s.setRollNumber(request.getRollNumber());
        s.setDomain(d);

        studentRepo.save(s);
        return "Student added";
    }

    // GET ALL
    @GetMapping
    public List<Student> getAllStudents() {
        return studentRepo.findAll();
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String deleteStudent(@PathVariable int id) {
        studentRepo.deleteById(id);
        return "Student deleted";
    }

    // UPDATE
    @PutMapping("/{id}")
    public String updateStudent(@PathVariable int id,
            @RequestBody com.esd.freeapp.dto.StudentRequest request) {

        Student s = studentRepo.findById(id).orElse(null);
        if (s == null)
            return "Student not found";

        Domain d = domainRepo.findById(request.getDomainId()).orElse(null);
        if (d == null)
            return "Domain not found";

        s.setFirstName(request.getFirstName());
        s.setLastName(request.getLastName());
        s.setRollNumber(request.getRollNumber());
        s.setDomain(d);

        studentRepo.save(s);
        return "Student updated";
    }
}