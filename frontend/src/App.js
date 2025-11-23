
import React, { useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import EmployeeForm from './EmployeeForm';
import EmployeeList from './EmployeeList';
import AdminLogin from './AdminLogin';
import { Typography, Button, Box } from '@mui/material';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showList, setShowList] = useState(false);
  const handleSuccess = () => setShowList(true);
  const handleLogin = () => setIsLoggedIn(true);

  return (
    <Routes>
      {/* Show AdminLogin at root until logged in */}
      <Route
        path="/"
        element={
          isLoggedIn ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <AdminLogin onLogin={handleLogin} />
          )
        }
      />
      {/* Main app after login */}
      <Route
        path="/dashboard"
        element={
          isLoggedIn ? (
            <Box sx={{
              minHeight: '100vh',
              width: '100vw',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: '#f5f6fa',
              position: 'relative',
              overflowX: 'hidden',
              overflowY: 'auto',
              mt: 12,
            }}>
              {!showList && (
                <Button
                  variant="outlined"
                  color="primary"
                  size="medium"
                  sx={{
                    position: 'fixed',
                    top: 36,
                    right: 36,
                    borderRadius: 2,
                    px: 2,
                    py: 0.8,
                    fontWeight: 500,
                    fontSize: 16,
                    letterSpacing: 0.5,
                    boxShadow: 'none',
                    background: '#fff',
                    color: '#1976d2',
                    border: '1.5px solid #1976d2',
                    textShadow: 'none',
                    mb: 1,
                    zIndex: 9999,
                    transition: 'all 0.2s',
                    maxWidth: 'calc(100vw - 64px)',
                    overflow: 'visible',
                    '&:hover': {
                      background: '#e3f2fd',
                      color: '#1565c0',
                      border: '2px solid #1565c0',
                    }
                  }}
                  onClick={() => setShowList(true)}
                >
                  Show Employee List
                </Button>
              )}
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', py: 0, px: 2, mt: 0 }}>
                <Box sx={{ width: '100%', maxWidth: 1700 }}>
                  <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                      fontWeight: 700,
                      color: '#1976d2',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: 2,
                      wordBreak: 'break-word',
                      maxWidth: '100%',
                      overflowWrap: 'break-word',
                      whiteSpace: 'pre-line',
                      fontSize: { xs: '1.1rem', sm: '1.5rem', md: '1.8rem', lg: '2.1rem' },
                    }}
                  >
                    {/* Title here if needed */}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ width: '100%', flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', mt: 0 }}>
                <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', mt: 0 }}>
                  {!showList ? (
                    <EmployeeForm onSuccess={handleSuccess} />
                  ) : (
                    <EmployeeList onBack={() => setShowList(false)} />
                  )}
                </Box>
              </Box>
            </Box>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      {/* Fallback: redirect all other routes to root */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
