const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  nicNumber: { type: String, required: true, unique: true },
  dateOfBirth: { type: Date, required: true },
  age: { type: Number, required: true },
  sex: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  district: { type: String, required: true },
  permanentAddress: { type: String, required: true },
  temporaryAddress: { type: String },
  contactDetails: { type: String, required: true },
  photo: { type: String } // base64 string
});

module.exports = mongoose.model('Employee', employeeSchema);