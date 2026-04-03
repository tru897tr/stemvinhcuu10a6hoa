// src/routes/pages.js
// Serves HTML pages

const express = require('express');
const path = require('path');
const router = express.Router();

const VIEWS = path.join(__dirname, '../../views');

router.get('/', (req, res) => {
  res.sendFile(path.join(VIEWS, 'index.html'));
});

router.get('/history', (req, res) => {
  res.sendFile(path.join(VIEWS, 'history.html'));
});

module.exports = router;
