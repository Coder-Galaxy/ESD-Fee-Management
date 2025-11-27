package com.esd.freeapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FreeappApplication {

	public static void main(String[] args) {
		SpringApplication.run(FreeappApplication.class, args);
	}

	@org.springframework.context.annotation.Bean
	public org.springframework.boot.CommandLineRunner demo(com.esd.freeapp.repository.EmployeeRepository repository) {
		return (args) -> {
			if (repository.findByEmail("18BCS1429@gmail.com") == null) {
				com.esd.freeapp.model.Employee admin = new com.esd.freeapp.model.Employee();
				admin.setFirstName("Admin");
				admin.setLastName("User");
				admin.setEmail("18BCS1429@gmail.com");
				admin.setPassword("password"); // Not used for Google Auth but good to have
				repository.save(admin);
				System.out.println("Seeded Admin User: 18BCS1429@gmail.com");
			}
		};
	}

}
