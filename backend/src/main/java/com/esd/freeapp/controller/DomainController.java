package com.esd.freeapp.controller;

import com.esd.freeapp.model.Domain;
import com.esd.freeapp.repository.DomainRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/domain")
public class DomainController {

    @Autowired
    private DomainRepository domainRepository;

    // CREATE DOMAIN
    @PostMapping
    public Domain addDomain(@RequestBody com.esd.freeapp.dto.DomainRequest request) {
        Domain d = new Domain();
        d.setName(request.getName());
        return domainRepository.save(d);
    }

    // LIST ALL DOMAINS
    @GetMapping
    public List<Domain> getAllDomains() {
        return domainRepository.findAll();
    }

    @Autowired
    private com.esd.freeapp.repository.StudentRepository studentRepository;

    // DELETE DOMAIN
    @DeleteMapping("/{id}")
    public org.springframework.http.ResponseEntity<?> deleteDomain(@PathVariable int id) {
        if (!domainRepository.existsById(id)) {
            return org.springframework.http.ResponseEntity.notFound().build();
        }

        List<com.esd.freeapp.model.Student> students = studentRepository.findByDomain_Id(id);
        if (!students.isEmpty()) {
            return org.springframework.http.ResponseEntity.badRequest()
                    .body("Cannot delete domain. It has " + students.size() + " associated students.");
        }

        domainRepository.deleteById(id);
        return org.springframework.http.ResponseEntity.ok().build();
    }
}
