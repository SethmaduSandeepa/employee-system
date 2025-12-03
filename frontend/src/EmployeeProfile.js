import React, { useState } from 'react';
import { Dialog, DialogActions, Button, TextField, Avatar, Box, Card, CardContent, Typography, Divider, Chip, Fade, Tooltip } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import WcIcon from '@mui/icons-material/Wc';
import axios from 'axios';

function EmployeeProfile({ open, onClose, employee, onUpdate }) {
    const [deleting, setDeleting] = useState(false);
    const handleDelete = async () => {
      if (!window.confirm('Are you sure you want to delete this employee?')) return;
      setDeleting(true);
      try {
        const apiUrl = process.env.REACT_APP_API_URL || '';
        await axios.delete(`${apiUrl}/api/employees/${employee._id}`);
        if (onUpdate) onUpdate();
        onClose();
      } catch (err) {
        alert('Failed to delete employee.');
      }
      setDeleting(false);
    };
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(employee || {});
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    setForm(employee || {});
    setEdit(false);
  }, [employee]);

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
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || '';
      const res = await axios.put(`${apiUrl}/api/employees/${employee._id}`, form);
      setEdit(false);
      if (onUpdate) onUpdate(res.data); // Pass updated employee to parent
    } catch (err) {
      let msg = 'Failed to update employee.';
      if (err.response && err.response.data && err.response.data.message) {
        msg += `\nReason: ${err.response.data.message}`;
      } else if (err.message) {
        msg += `\nReason: ${err.message}`;
      }
      alert(msg);
    }
    setSaving(false);
  };

  if (!employee) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Fade in={open}>
        <Card sx={{
          mt: 3,
          mb: 3,
          boxShadow: '0 4px 24px 0 rgba(25, 118, 210, 0.10)',
          borderRadius: 8,
          overflow: 'visible',
          border: 'none',
          background: '#fff',
          position: 'relative',
          fontFamily: 'Segoe UI, Arial, sans-serif',
        }}>
          <Box sx={{
            background: '#f5f7fa',
            p: 4,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            textAlign: 'center',
            position: 'relative',
            minHeight: 180,
            borderBottom: '1px solid #e3eafc',
          }}>
            <Avatar src={form.photo ? `data:image/*;base64,${form.photo}` : undefined} sx={{ width: 110, height: 110, mx: 'auto', mb: 1, boxShadow: 2, border: '3px solid #1976d2', background: '#fff' }} />
            <Typography variant="h5" sx={{ color: '#1976d2', fontWeight: 700, mt: 1, letterSpacing: 1 }}>{form.fullName}</Typography>
            <Typography variant="subtitle2" sx={{ color: '#333', fontWeight: 400, mb: 1 }}>{form.nicNumber}</Typography>
            {edit && (
              <Button variant="contained" component="label" sx={{ mt: 1, background: '#1976d2', color: '#fff', fontWeight: 600 }}>
                Upload New Photo
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  hidden
                  onChange={handleChange}
                />
              </Button>
            )}
            {/* Status chip removed for a cleaner look */}
          </Box>
          <CardContent>
            <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={4} mb={2}>
              <Box>
                <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700, mb: 2, letterSpacing: 1, display: 'flex', alignItems: 'center' }}><WcIcon sx={{ mr: 1 }} /> Personal Details</Typography>
                <Typography sx={{ mb: 1 }}><b>Sex:</b> {form.sex}</Typography>
                <Typography sx={{ mb: 1 }}><b>DOB:</b> {form.dateOfBirth ? form.dateOfBirth.substring(0,10) : ''}</Typography>
                <Typography sx={{ mb: 1 }}><b>Age:</b> {form.age}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700, mb: 2, letterSpacing: 1, display: 'flex', alignItems: 'center' }}><LocationOnIcon sx={{ mr: 1 }} /> Contact & Address</Typography>
                <Typography sx={{ mb: 1 }}><b>District:</b> {form.district}</Typography>
                <Typography sx={{ mb: 1 }}><b>Permanent Address:</b> {form.permanentAddress}</Typography>
                <Typography sx={{ mb: 1 }}><b>Temporary Address:</b> {form.temporaryAddress}</Typography>
                <Typography sx={{ mb: 1 }}><b>Contact:</b> {form.contactDetails}</Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 3 }} />
            <Box display="flex" justifyContent="flex-start" alignItems="center" flexWrap="wrap" gap={2}>
              <Chip icon={<CalendarMonthIcon />} label={`Joined: ${new Date().toISOString().substring(0,10)}`} color="primary" variant="outlined" sx={{ fontWeight: 500, fontSize: 15, px: 2, py: 1 }} />
            </Box>
            {edit && (
              <Box mt={4}>
                <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700, mb: 2, letterSpacing: 1 }}>Edit Details</Typography>
                <Box display="flex" flexWrap="wrap" gap={2}>
                  <TextField label="Full Name" name="fullName" value={form.fullName || ''} onChange={handleChange} fullWidth margin="dense" sx={{ maxWidth: 260 }} />
                  <TextField label="NIC Number" name="nicNumber" value={form.nicNumber || ''} onChange={handleChange} fullWidth margin="dense" sx={{ maxWidth: 260 }} />
                  <TextField label="Date of Birth" name="dateOfBirth" type="date" value={form.dateOfBirth ? form.dateOfBirth.substring(0,10) : ''} onChange={handleChange} fullWidth margin="dense" InputLabelProps={{ shrink: true }} sx={{ maxWidth: 260 }} />
                  <TextField label="Age" name="age" value={form.age || ''} onChange={handleChange} fullWidth margin="dense" sx={{ maxWidth: 120 }} />
                  <TextField label="Sex" name="sex" value={form.sex || ''} onChange={handleChange} fullWidth margin="dense" sx={{ maxWidth: 120 }} InputProps={{ startAdornment: <WcIcon sx={{ color: '#1976d2', mr: 1 }} /> }} />
                  <TextField label="District" name="district" value={form.district || ''} onChange={handleChange} fullWidth margin="dense" sx={{ maxWidth: 180 }} InputProps={{ startAdornment: <LocationOnIcon sx={{ color: '#1976d2', mr: 1 }} /> }} />
                  <TextField label="Permanent Address" name="permanentAddress" value={form.permanentAddress || ''} onChange={handleChange} fullWidth margin="dense" sx={{ maxWidth: 260 }} />
                  <TextField label="Temporary Address" name="temporaryAddress" value={form.temporaryAddress || ''} onChange={handleChange} fullWidth margin="dense" sx={{ maxWidth: 260 }} />
                  <TextField label="Contact Details" name="contactDetails" value={form.contactDetails || ''} onChange={handleChange} fullWidth margin="dense" sx={{ maxWidth: 260 }} InputProps={{ startAdornment: <PhoneIcon sx={{ color: '#1976d2', mr: 1 }} /> }} />
                </Box>
              </Box>
            )}
          </CardContent>
          <Divider />
          <DialogActions sx={{ p: 2, display: 'flex', justifyContent: 'space-between', background: '#e3f2fd', borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
            <Box>
              {!edit ? (
                <Button onClick={() => setEdit(true)} variant="contained" color="primary">Edit</Button>
              ) : (
                <Button onClick={handleSave} variant="contained" color="success" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
              )}
              <Button onClick={onClose} color="secondary" sx={{ ml: 1 }}>Close</Button>
            </Box>
            <Button onClick={handleDelete} color="error" variant="outlined" disabled={deleting} sx={{ ml: 2 }}>
              {deleting ? 'Deleting...' : 'Delete Profile'}
            </Button>
          </DialogActions>
        </Card>
      </Fade>
    </Dialog>
  );
}

export default EmployeeProfile;
