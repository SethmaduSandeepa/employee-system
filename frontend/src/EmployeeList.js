
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EmployeeProfile from './EmployeeProfile';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Typography, TextField, Button, Box, Tooltip, InputAdornment, Divider, MenuItem } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';


function EmployeeList({ onBack }) {
  // State declarations must come first
  const [employees, setEmployees] = useState([]);
  const [districtFilter, setDistrictFilter] = useState('');
  // Get unique districts for dropdown
  const districts = Array.from(new Set(employees.map(emp => emp.district).filter(Boolean))).sort();
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

  // Filter employees by NIC number and district
  const filtered = employees.filter(emp => {
    const matchesSearch = emp.nicNumber && emp.nicNumber.toLowerCase().includes(search.toLowerCase());
    const matchesDistrict = !districtFilter || emp.district === districtFilter;
    return matchesSearch && matchesDistrict;
  });

  if (loading) return <Typography align="center" sx={{ mt: 4 }}>Loading employees...</Typography>;
  if (error) return <Typography color="error" align="center" sx={{ mt: 4 }}>{error}</Typography>;

  return (
    <Box sx={{ p: 0, pt: 0, mt: 0 }}>
      {/* Show titles only when all districts are selected */}
      {(!districtFilter || districtFilter === '') && (
        <>
          <Typography variant="h4" align="center" sx={{ fontWeight: 700, color: '#1976d2', mb: 1, mt: 8, width: '100%' }}>TASMA EMPLOYEE SYSTEM</Typography>
          <Typography variant="h6" align="center" sx={{ fontWeight: 600, color: '#1976d2', mb: 2, mt: 1, width: '100%' }}>Employee List</Typography>
        </>
      )}
      <Divider sx={{ mb: 1, background: '#b3c6e0' }} />
      {/* Download CSV for filtered employees */}
      <Typography variant="subtitle1" align="center" sx={{ fontWeight: 500, color: '#1976d2', mb: 0.5 }}>
        Export Data
      </Typography>
      <Box display="flex" justifyContent="center" width="100%" gap={2} mb={1}>
        <Button
          variant="contained"
          color="primary"
          sx={{ fontWeight: 600, borderRadius: 2, boxShadow: 'none', textTransform: 'none' }}
          onClick={() => {
            // Prepare CSV content for filtered employees
            const csvRows = [];
            const headers = ['Full Name', 'NIC Number', 'Date of Birth', 'Age', 'Sex', 'District', 'Permanent Address', 'Temporary Address', 'Contact Details'];
            csvRows.push(headers.join(','));
            filtered.forEach(emp => {
              const row = [
                emp.fullName,
                emp.nicNumber,
                new Date(emp.dateOfBirth).toLocaleDateString(),
                emp.age,
                emp.sex,
                emp.district,
                emp.permanentAddress,
                emp.temporaryAddress,
                emp.contactDetails
              ].map(val => '"' + (val ? String(val).replace(/"/g, '""') : '') + '"').join(',');
              csvRows.push(row);
            });
            const csvContent = csvRows.join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = districtFilter && districtFilter !== '' ? `employees_${districtFilter}.csv` : 'employees.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }}
        >
          Download CSV {districtFilter && districtFilter !== '' ? `(${districtFilter})` : ''}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          sx={{ fontWeight: 600, borderRadius: 2, boxShadow: 'none', textTransform: 'none' }}
          onClick={() => {
            // Prepare CSV content for ALL employees (all districts)
            const csvRows = [];
            const headers = ['Full Name', 'NIC Number', 'Date of Birth', 'Age', 'Sex', 'District', 'Permanent Address', 'Temporary Address', 'Contact Details'];
            csvRows.push(headers.join(','));
            employees.forEach(emp => {
              const row = [
                emp.fullName,
                emp.nicNumber,
                new Date(emp.dateOfBirth).toLocaleDateString(),
                emp.age,
                emp.sex,
                emp.district,
                emp.permanentAddress,
                emp.temporaryAddress,
                emp.contactDetails
              ].map(val => '"' + (val ? String(val).replace(/"/g, '""') : '') + '"').join(',');
              csvRows.push(row);
            });
            const csvContent = csvRows.join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'employees_all_districts.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }}
        >
          Download All Districts CSV
        </Button>
      </Box>
      {/* Show titles only when all districts are selected */}
      {(!districtFilter || districtFilter === '') && (
        <>
          <Typography variant="h4" align="center" sx={{ fontWeight: 700, color: '#1976d2', mb: 2, mt: 60, width: '100%' }}>TASMA EMPLOYEE SYSTEM</Typography>
          <Typography variant="h6" align="center" sx={{ fontWeight: 600, color: '#1976d2', mb: 4, mt: 24, width: '100%' }}>Employee List</Typography>
        </>
      )}
      <Box display="flex" justifyContent="center" width="100%" mb={1}>
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
      <Divider sx={{ my: 1, background: '#e3eafc' }} />
      {/* District filter dropdown below search bar */}
      <Typography variant="subtitle1" align="center" sx={{ fontWeight: 500, color: '#1976d2', mb: 0.5 }}>
        Filter Employees
      </Typography>
      <Box display="flex" justifyContent="center" width="100%" mb={3}>
        <TextField
          select
          label="Filter by District"
          value={districtFilter}
          onChange={e => setDistrictFilter(e.target.value)}
          sx={{ minWidth: 220, background: '#fff', borderRadius: 2 }}
        >
          <MenuItem value="">All Districts</MenuItem>
          {districts.map(d => (
            <MenuItem key={d} value={d}>{d}</MenuItem>
          ))}
        </TextField>
      </Box>
      <Divider sx={{ my: 1, background: '#e3eafc' }} />
      <Typography variant="subtitle1" align="center" sx={{ fontWeight: 500, color: '#1976d2', mb: 0.5 }}>
        Employee List
      </Typography>
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
      {/* Chart summary below the table */}
      {chartData.length > 0 && (
        <Paper elevation={3} sx={{ mt: 4, p: 2, maxWidth: 700, mx: 'auto', background: '#f5f7fa' }}>
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
      <EmployeeProfile
        open={profileOpen}
        onClose={handleProfileClose}
        employee={selectedEmployee}
        onUpdate={handleProfileUpdate}
      />
      {onBack && (
        <Box sx={{ position: 'fixed', top: 36, right: 36, zIndex: 1200 }}>
          <Button
            onClick={onBack}
            variant="outlined"
            color="primary"
            size="medium"
            sx={{
              fontWeight: 500,
              fontSize: 16,
              px: 2,
              py: 0.8,
              borderRadius: 2,
              boxShadow: 'none',
              background: '#fff',
              color: '#1976d2',
              border: '1.5px solid #1976d2',
              textShadow: 'none',
              transition: 'all 0.2s',
              '&:hover': {
                background: '#e3f2fd',
                color: '#1565c0',
                border: '2px solid #1565c0',
              }
            }}
          >
            ← Home
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default EmployeeList;

