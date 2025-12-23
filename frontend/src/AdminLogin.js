
import React, { useState } from 'react';
// Use external logo URL
const logoUrl = 'https://media.licdn.com/dms/image/C561BAQGn1RsrhhtNmg/company-background_10000/0/1624761677901/tasma_group_of_companies_cover?e=2147483647&v=beta&t=xv4JLHn0yTWIAwPuS2fd8pb-_8jzJyhKdmAt8z3wVIY';
import axios from 'axios';
import { Button, TextField, Typography, Container, Box, Paper, InputAdornment, CircularProgress } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Use environment variable for backend URL
      const apiUrl = process.env.REACT_APP_API_URL || '';
      const res = await axios.post(
        `${apiUrl}/api/admin/login`,
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (res.data && res.data.success) {
        setError('');
        if (onLogin) onLogin();
      } else {
        setError(res.data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box mt={10}>
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
            <Typography variant="h4" align="center" fontWeight={700} color="primary.main" gutterBottom>
              Welcome to Empower HR Solutions
            </Typography>
          </Box>
          <Typography variant="subtitle1" align="center" color="text.secondary" mb={2}>
            Please log in to access the system
          </Typography>
          <form onSubmit={handleSubmit} autoComplete="off">
            <TextField
              label="Username"
              variant="outlined"
              margin="normal"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="off"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            {error && (
              <Typography color="error" variant="body2" align="center" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3, fontWeight: 600, fontSize: 18, py: 1.2 }}
              disabled={loading}
              endIcon={loading ? <CircularProgress size={22} color="inherit" /> : null}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default AdminLogin;
