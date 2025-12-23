const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Simple admin login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  // Validate input
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password required' });
  }
  
  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'admin';
  
  if (username === adminUser && password === adminPass) {
    return res.json({ success: true });
  } else {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

module.exports = router;
