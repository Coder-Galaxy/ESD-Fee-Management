-- Domains
INSERT INTO `domain` (id, name) VALUES (1, 'Computer Science'), (2, 'Business Analytics');
INSERT INTO `domain` (id, name) VALUES (3, 'Electrical Engineering'), (4, 'Mechanical Engineering'), (5, 'Civil Engineering');

-- Students
INSERT INTO student (id, first_name, last_name, roll_number, domain_id) VALUES
(1, 'Piyush', 'Singh', 'CS2025', 1),
(2, 'Aarti', 'Sharma', 'BA2025', 2),
(3, 'Rahul', 'Verma', 'EE2025', 3),
(4, 'Sneha', 'Gupta', 'ME2025', 4),
(5, 'Vikram', 'Rao', 'CS2026', 1),
(6, 'Anjali', 'Nair', 'CE2025', 5),
(7, 'David', 'Miller', 'BA2026', 2);

-- Employee
INSERT INTO employee (id, first_name, last_name, email, password) VALUES
(1, 'Accounts', 'Admin', 'accounts-admin@esd.edu', 'admin123');

-- Bills
INSERT INTO bill (id, description, amount, deadline) VALUES
(1, 'Tuition Fee 2025', 100000.00, '2025-12-31'),
(2, 'Hostel Fee 2025', 50000.00, '2025-12-31'),
(3, 'Library Fine', 500.00, '2025-11-30'),
(4, 'Lab Breakage', 1500.00, '2025-11-15');

-- Student Bills (Mapping)
INSERT INTO student_bill (student_id, bill_id) VALUES
(1, 1), -- Piyush: Tuition
(1, 2), -- Piyush: Hostel
(2, 1), -- Aarti: Tuition
(3, 1), -- Rahul: Tuition
(3, 3), -- Rahul: Library Fine
(4, 1), -- Sneha: Tuition
(4, 2), -- Sneha: Hostel
(5, 1), -- Vikram: Tuition
(6, 1), -- Anjali: Tuition
(6, 4); -- Anjali: Lab Breakage