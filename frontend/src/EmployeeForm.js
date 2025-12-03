import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, MenuItem, Paper, Alert, CircularProgress, Divider, Avatar, Tooltip, InputAdornment } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import WcIcon from '@mui/icons-material/Wc';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIcon from '@mui/icons-material/Phone';

function EmployeeForm({ onSuccess }) {
  const [form, setForm] = useState({
    fullName: '',
    nicNumber: '',
    dateOfBirth: '',
    sex: '',
    district: '',
    permanentAddress: '',
    temporaryAddress: '',
    contactDetails: '',
    photo: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'photo' && files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, photo: reader.result.split(',')[1] }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setForm({ ...form, [name]: value });
    }
    setError('');
  };

  const validate = () => {
    if (!form.fullName || !form.nicNumber || !form.dateOfBirth || !form.sex || !form.district || !form.permanentAddress || !form.contactDetails) {
      setError('Please fill in all required fields.');
      return false;
    }
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || '';
      await axios.post(`${apiUrl}/api/employees`, form);
      setMessage('Employee added successfully!');
      setForm({
        fullName: '', nicNumber: '', dateOfBirth: '', sex: '', district: '', permanentAddress: '', temporaryAddress: '', contactDetails: '', photo: ''
      });
      setError('');
      if (onSuccess) onSuccess();
    } catch (err) {
      setMessage('');
      setError('Failed to add employee. Please check your data.');
    }
    setLoading(false);
  };

  return (
    <Paper elevation={1} sx={{ maxWidth: 480, mx: 'auto', my: 4, p: 3, borderRadius: 3, background: '#fafbfc', boxShadow: 1 }}>
      <Box display="flex" flexDirection="column" alignItems="center" mb={1}>
        <Avatar sx={{ bgcolor: '#bdbdbd', width: 48, height: 48, mb: 1 }}>
          <PersonIcon sx={{ fontSize: 28, color: '#757575' }} />
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 500, color: '#424242', letterSpacing: 0.5 }}>Add Employee</Typography>
      </Box>
      <Divider sx={{ mb: 1 }} />
      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit} autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} required InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon color="primary" /></InputAdornment> }} />
        <TextField label="NIC Number" name="nicNumber" value={form.nicNumber} onChange={handleChange} required InputProps={{ startAdornment: <InputAdornment position="start"><BadgeIcon color="primary" /></InputAdornment> }} />
        <TextField label="Date of Birth" name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} required InputLabelProps={{ shrink: true }} InputProps={{ startAdornment: <InputAdornment position="start"><CalendarMonthIcon color="primary" /></InputAdornment> }} />
        <TextField select label="Sex" name="sex" value={form.sex} onChange={handleChange} required InputProps={{ startAdornment: <InputAdornment position="start"><WcIcon color="primary" /></InputAdornment> }}>
          <MenuItem value="">Select Sex</MenuItem>
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </TextField>
        <TextField label="District" name="district" value={form.district} onChange={handleChange} required InputProps={{ startAdornment: <InputAdornment position="start"><LocationOnIcon color="primary" /></InputAdornment> }} />
        <TextField label="Permanent Address" name="permanentAddress" value={form.permanentAddress} onChange={handleChange} required InputProps={{ startAdornment: <InputAdornment position="start"><HomeIcon color="primary" /></InputAdornment> }} />
        <TextField label="Temporary Address" name="temporaryAddress" value={form.temporaryAddress} onChange={handleChange} InputProps={{ startAdornment: <InputAdornment position="start"><HomeIcon color="action" /></InputAdornment> }} />
        <TextField label="Contact Details" name="contactDetails" value={form.contactDetails} onChange={handleChange} required InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon color="primary" /></InputAdornment> }} />
        <Button
          variant="outlined"
          component="label"
          sx={{ textAlign: 'left', borderColor: '#1976d2', color: '#1976d2', fontWeight: 600, mt: 1 }}
        >
          Upload Photo
          <input
            type="file"
            name="photo"
            accept="image/*"
            hidden
            onChange={handleChange}
          />
        </Button>
        {form.photo && (
          <Box mt={2} textAlign="center">
            <img
              src={`data:image/*;base64,${form.photo}`}
              alt="Preview"
              style={{ maxWidth: 180, maxHeight: 180, borderRadius: 12, border: '2px solid #1976d2', boxShadow: '0 2px 8px #90caf9' }}
            />
          </Box>
        )}
        <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ mt: 2, fontWeight: 600, letterSpacing: 1 }}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Add Employee'}
        </Button>
      </Box>
    </Paper>
  );
}

export default EmployeeForm;
