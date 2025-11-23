
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EmployeeProfile from './EmployeeProfile';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Typography, TextField, Button, Box, Tooltip, InputAdornment, Divider } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';


function EmployeeList({ onBack }) {

  // State declarations must come first
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Prepare chart data: count employees by district (after employees is defined)
  const districtCounts = employees.reduce((acc, emp) => {
    if (emp.district) {
      acc[emp.district] = (acc[emp.district] || 0) + 1;
    }
    return acc;
  }, {});
  const chartData = Object.entries(districtCounts).map(([district, count]) => ({ district, count }));

  useEffect(() => {
    axios.get('http://localhost:5000/api/employees')
      .then(res => {
        setEmployees(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch employees');
        setLoading(false);
      });
  }, []);

  const showProfile = (emp) => {
    setSelectedEmployee(emp);
    setProfileOpen(true);
  };

  const handleProfileClose = () => {
    setProfileOpen(false);
    setSelectedEmployee(null);
  };

  const handleProfileUpdate = (updatedEmp) => {
    if (!updatedEmp || !updatedEmp._id) {
      setProfileOpen(false);
      setSelectedEmployee(null);
      return;
    }
    setEmployees(prev => prev.map(emp => emp._id === updatedEmp._id ? updatedEmp : emp));
    setProfileOpen(false);
    setSelectedEmployee(null);
  };

  // Filter employees by NIC number only
  const filtered = employees.filter(emp =>
    emp.nicNumber && emp.nicNumber.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Typography align="center" sx={{ mt: 4 }}>Loading employees...</Typography>;
  if (error) return <Typography color="error" align="center" sx={{ mt: 4 }}>{error}</Typography>;

  return (
    <Box sx={{ p: 0, pt: 0, mt: 0 }}>
      {/* Chart summary above the table */}
      {chartData.length > 0 && (
        <Paper elevation={3} sx={{ mb: 4, p: 2, maxWidth: 700, mx: 'auto', background: '#f5f7fa' }}>
          <Typography variant="h6" align="center" sx={{ fontWeight: 600, color: '#1976d2', mb: 2 }}>
            Employee Count by District
          </Typography>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="district" fontSize={13} angle={-20} textAnchor="end" height={60} interval={0} />
              <YAxis allowDecimals={false} fontSize={13} />
              <RechartsTooltip />
              <Legend />
              <Bar dataKey="count" fill="#1976d2" name="Employees" barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      )}
      <Typography variant="h4" align="center" sx={{ fontWeight: 700, color: '#1976d2', mb: 2, mt: 0, width: '100%' }}>TASMA EMPLOYEE SYSTEM</Typography>
      <Typography variant="h6" align="center" sx={{ fontWeight: 600, color: '#1976d2', mb: 2, width: '100%' }}>Employee List</Typography>
      <Box display="flex" justifyContent="center" width="100%" mb={3}>
        <TextField
          variant="outlined"
          placeholder="Search by NIC number"
          value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{
            width: 360,
            borderRadius: 4,
            background: '#f5f7fa',
            boxShadow: '0 2px 8px #e3eafc',
            '& .MuiOutlinedInput-root': {
              borderRadius: 4,
              fontSize: 18,
              fontWeight: 500,
              background: '#f5f7fa',
              '& fieldset': {
                borderColor: '#b3c6e0',
              },
              '&:hover fieldset': {
                borderColor: '#1976d2',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#1976d2',
                boxShadow: '0 0 0 2px #e3eafc',
              },
            },
            transition: 'box-shadow 0.2s',
          }}
        />
      </Box>
      {filtered.length === 0 ? (
        <Typography color="text.secondary" align="center">No employees found.</Typography>
      ) : (
        <Box display="flex" justifyContent="center" width="100%">
          <TableContainer component={Paper} sx={{ mt: 2, width: '100vw', maxWidth: '100vw', minWidth: '100vw', overflowX: 'auto' }}>
            <Table sx={{ minWidth: 1200, width: '100%' }}>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Photo</TableCell>
                  <TableCell align="center">Full Name</TableCell>
                  <TableCell align="center">NIC Number</TableCell>
                  <TableCell align="center">Date of Birth</TableCell>
                  <TableCell align="center">Age</TableCell>
                  <TableCell align="center">Sex</TableCell>
                  <TableCell align="center">District</TableCell>
                  <TableCell align="center">Permanent Address</TableCell>
                  <TableCell align="center">Temporary Address</TableCell>
                  <TableCell align="center">Contact Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((emp, idx) => (
                  <TableRow
                    key={emp._id}
                    hover
                    onClick={() => showProfile(emp)}
                    sx={{
                      cursor: 'pointer',
                      backgroundColor: idx % 2 === 0 ? '#f8fbff' : '#e3eafc',
                      transition: 'background 0.2s',
                      '&:hover': {
                        backgroundColor: '#bbdefb',
                      },
                    }}
                  >
                    <TableCell align="center" sx={{ verticalAlign: 'middle', py: 1 }}>
                      {emp.photo ? (
                        <Avatar src={`data:image/*;base64,${emp.photo}`} alt={emp.fullName} />
                      ) : (
                        <Avatar><PersonIcon /></Avatar>
                      )}
                    </TableCell>
                    <TableCell align="center" sx={{ verticalAlign: 'middle', py: 1 }}>
                      <Tooltip title={emp.fullName} arrow>
                        <span style={{ fontWeight: 600 }}>{emp.fullName}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center" sx={{ verticalAlign: 'middle', py: 1 }}>
                      <Tooltip title={emp.nicNumber} arrow>
                        <span>{emp.nicNumber}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center" sx={{ verticalAlign: 'middle', py: 1 }}>{new Date(emp.dateOfBirth).toLocaleDateString()}</TableCell>
                    <TableCell align="center" sx={{ verticalAlign: 'middle', py: 1 }}>{emp.age}</TableCell>
                    <TableCell align="center" sx={{ verticalAlign: 'middle', py: 1 }}>
                      <span style={{ fontWeight: 600, color: emp.sex === 'Male' ? '#1976d2' : emp.sex === 'Female' ? '#e91e63' : '#333' }}>
                        {emp.sex}
                      </span>
                    </TableCell>
                    <TableCell align="center" sx={{ verticalAlign: 'middle', py: 1 }}>
                      <Tooltip title={emp.district} arrow>
                        <span>{emp.district}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center" sx={{ verticalAlign: 'middle', py: 1 }}>
                      <Tooltip title={emp.permanentAddress} arrow>
                        <span style={{ maxWidth: 120, display: 'inline-block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{emp.permanentAddress}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center" sx={{ verticalAlign: 'middle', py: 1 }}>
                      <Tooltip title={emp.temporaryAddress} arrow>
                        <span style={{ maxWidth: 120, display: 'inline-block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{emp.temporaryAddress}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center" sx={{ verticalAlign: 'middle', py: 1 }}>
                      <Tooltip title={emp.contactDetails} arrow>
                        <span>{emp.contactDetails}</span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
      <EmployeeProfile
        open={profileOpen}
        onClose={handleProfileClose}
        employee={selectedEmployee}
        onUpdate={handleProfileUpdate}
      />
      {onBack && (
        <Box sx={{ position: 'fixed', top: 32, right: 32, zIndex: 1200 }}>
          <Button onClick={onBack} variant="contained" color="secondary" sx={{ fontWeight: 700, fontSize: 18, px: 3, py: 1.2, borderRadius: 3, boxShadow: '0 2px 8px #bdbdbd' }}>
            ← Home
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default EmployeeList;

