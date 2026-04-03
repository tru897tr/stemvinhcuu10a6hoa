// src/middleware/tracker.js
// Captures visitor info on every non-static request

const UAParser = require('ua-parser-js');
const { v4: uuidv4 } = require('uuid');
const { addVisitor } = require('../utils/store');
const { sendVisitorWebhook } = require('../utils/discord');

// Skip static assets & API internal calls
const SKIP_PREFIXES = ['/public/', '/favicon', '/robots.txt', '/health'];

function getClientIP(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.socket?.remoteAddress || req.ip || '0.0.0.0';
}

function tracker(req, res, next) {
  // Skip static files
  if (SKIP_PREFIXES.some(p => req.path.startsWith(p))) return next();

  const ua = new UAParser(req.headers['user-agent'] || '');
  const ip = getClientIP(req);

  // Session ID via cookie (lightweight, no session library)
  let sessionId = req.cookies?.sid;
  if (!sessionId) {
    sessionId = uuidv4();
    res.cookie('sid', sessionId, {
      maxAge: 30 * 60 * 1000, // 30 min
      httpOnly: true,
      sameSite: 'lax',
    });
  }

  const visitor = {
    id: uuidv4(),
    sessionId,
    ip,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method,
    browser: `${ua.getBrowser().name || 'Unknown'} ${ua.getBrowser().version || ''}`.trim(),
    os: `${ua.getOS().name || 'Unknown'} ${ua.getOS().version || ''}`.trim(),
    device: ua.getDevice().type || 'desktop',
    deviceModel: ua.getDevice().model || '',
    referer: req.headers['referer'] || req.headers['referrer'] || '',
    language: req.headers['accept-language']?.split(',')[0] || 'Unknown',
    country: req.headers['cf-ipcountry'] || req.headers['x-country-code'] || 'Unknown',
    countryCode: req.headers['cf-ipcountry'] || 'XX',
    city: req.headers['cf-ipcity'] || 'Unknown',
    userAgent: req.headers['user-agent'] || '',
  };

  addVisitor(visitor);

  // Fire-and-forget webhook
  sendVisitorWebhook(visitor);

  next();
}

module.exports = tracker;
