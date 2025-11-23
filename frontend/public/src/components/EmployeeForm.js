import React, { useState } from 'react';
import axios from 'axios';
import './EmployeeForm.css';

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    nicNumber: '',
    dateOfBirth: '',
    sex: 'Male',
    district: '',
    permanentAddress: '',
    temporaryAddress: '',
    contactDetails: '',
    photo: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/employees`, formData);
      alert('Employee saved successfully!');
      setFormData({
        fullName: '',
        nicNumber: '',
        dateOfBirth: '',
        sex: 'Male',
        district: '',
        permanentAddress: '',
        temporaryAddress: '',
        contactDetails: '',
        photo: ''
      });
    } catch (err) {
      console.error(err);
      alert('Error saving employee');
    }
  };

  return (
    <form className="employee-form" onSubmit={handleSubmit}>
      <h2>Add Employee</h2>

      <input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleInputChange} required />
      <input name="nicNumber" placeholder="NIC Number" value={formData.nicNumber} onChange={handleInputChange} required />
      <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} required />
      <select name="sex" value={formData.sex} onChange={handleInputChange} required>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
      <input name="district" placeholder="District" value={formData.district} onChange={handleInputChange} required />
      <textarea name="permanentAddress" placeholder="Permanent Address" value={formData.permanentAddress} onChange={handleInputChange} required />
      <textarea name="temporaryAddress" placeholder="Temporary Address" value={formData.temporaryAddress} onChange={handleInputChange} />
      <input name="contactDetails" placeholder="Contact Details (e.g., phone, email)" value={formData.contactDetails} onChange={handleInputChange} required />
      
      <input type="file" accept="image/*" onChange={handlePhotoChange} />
      
      <button type="submit">Save Employee</button>
    </form>
  );
};

export default EmployeeForm;