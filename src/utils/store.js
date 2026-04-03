// src/utils/store.js
// In-memory storage (no database required)
// Stores up to MAX_LOGS visitor entries, oldest removed when full

const MAX_LOGS = 999999;

const visitors = [];

function addVisitor(data) {
  visitors.unshift(data); // newest first
  if (visitors.length > MAX_LOGS) visitors.pop();
}

function getVisitors({ page = 1, limit = 20 } = {}) {
  const total = visitors.length;
  const start = (page - 1) * limit;
  const items = visitors.slice(start, start + limit);
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    items,
  };
}

function getStats() {
  const total = visitors.length;
  if (total === 0) return { total: 0, uniqueIPs: 0, browsers: {}, oses: {}, devices: {} };

  const ipSet = new Set();
  const browsers = {};
  const oses = {};
  const devices = {};

  for (const v of visitors) {
    ipSet.add(v.ip);
    browsers[v.browser] = (browsers[v.browser] || 0) + 1;
    oses[v.os] = (oses[v.os] || 0) + 1;
    devices[v.device] = (devices[v.device] || 0) + 1;
  }

  return { total, uniqueIPs: ipSet.size, browsers, oses, devices };
}

module.exports = { addVisitor, getVisitors, getStats };
