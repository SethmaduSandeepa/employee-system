const express = require('express');
const router = express.Router();

// Simple admin login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'tasma@8953789') {
    return res.json({ success: true });
  } else {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

module.exports = router;
