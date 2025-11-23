const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// GET all employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new employee
router.post('/', async (req, res) => {
  const { fullName, nicNumber, dateOfBirth, sex, district, permanentAddress, temporaryAddress, contactDetails, photo } = req.body;

  // Auto-calculate age
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  const employee = new Employee({
    fullName,
    nicNumber,
    dateOfBirth: dob,
    age,
    sex,
    district,
    permanentAddress,
    temporaryAddress,
    contactDetails,
    photo
  });

  try {
    const newEmployee = await employee.save();
    res.status(201).json(newEmployee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



// PUT update employee by ID
router.put('/:id', async (req, res) => {
  try {
    const { fullName, nicNumber, dateOfBirth, sex, district, permanentAddress, temporaryAddress, contactDetails, photo } = req.body;
    // Auto-calculate age if dateOfBirth is present
    let age;
    if (dateOfBirth) {
      const dob = new Date(dateOfBirth);
      const today = new Date();
      age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
    }
    const update = {
      fullName,
      nicNumber,
      dateOfBirth,
      sex,
      district,
      permanentAddress,
      temporaryAddress,
      contactDetails,
      photo
    };
    if (age !== undefined) update.age = age;
    const employee = await Employee.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE employee by ID
router.delete('/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;