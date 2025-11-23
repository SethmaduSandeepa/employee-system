import React, { useState } from 'react';
import EmployeeForm from './EmployeeForm';
import EmployeeList from './EmployeeList';
import { Typography, Button, Box } from '@mui/material';

function App() {
  const [showList, setShowList] = useState(false);
  const handleSuccess = () => setShowList(true);
  return (
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
      {/* Button absolutely positioned in top right */}
      {!showList && (
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<span role="img" aria-label="list" style={{ fontSize: 22 }}>📋</span>}
          sx={{
            position: 'fixed',
            top: 32,
            right: 32,
            borderRadius: 3,
            px: 3,
            py: 1.5,
            fontWeight: 700,
            fontSize: 20,
            letterSpacing: 1,
            boxShadow: '0 4px 16px #1565c0',
            background: 'linear-gradient(90deg, #1565c0 60%, #42a5f5 100%)',
            color: '#fff',
            border: '2px solid #fff',
            textShadow: '1px 1px 6px #1976d2',
            mb: 2,
            zIndex: 9999,
            transition: 'all 0.2s',
            maxWidth: 'calc(100vw - 64px)',
            overflow: 'visible',
            '&:hover': {
              background: 'linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)',
              color: '#fff',
              boxShadow: '0 6px 24px #1565c0',
              border: '2px solid #42a5f5',
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
  );
}

export default App;
