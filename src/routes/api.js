// src/routes/api.js
// REST API endpoints

const express = require('express');
const router = express.Router();
const { getVisitors, getStats } = require('../utils/store');

/**
 * GET /api/v1/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    version: '1.0.0',
  });
});

/**
 * GET /api/v1/visitors
 * Paginated visitor log
 * Query: ?page=1&limit=20
 */
router.get('/visitors', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
  const data = getVisitors({ page, limit });
  res.json({ success: true, data });
});

/**
 * GET /api/v1/stats
 * Aggregate visitor statistics
 */
router.get('/stats', (req, res) => {
  const stats = getStats();
  res.json({ success: true, data: stats });
});

/**
 * GET /api/v1/guide
 * Returns the guide content as JSON
 */
router.get('/guide', (req, res) => {
  res.json({
    success: true,
    data: {
      title: 'Hướng Dẫn Chi Tiết Cách Nuôi Tinh Thể Đồng(II) Sunfat (CuSO₄)',
      chemical: 'CuSO₄',
      difficulty: 'Trung bình',
      duration: '5–14 ngày',
      sections: [
        {
          id: 1,
          title: 'I. Chuẩn bị dụng cụ và hóa chất',
          items: [
            { label: 'Hóa chất', detail: '100g muối CuSO₄, 200ml nước cất hoặc nước tinh khiết' },
            { label: 'Dụng cụ', detail: 'Cân điện tử, cốc thủy tinh, đĩa petri, phễu lọc, giấy lọc, đũa khuấy, nhíp, que gỗ, dây cước mảnh' },
          ],
        },
        {
          id: 2,
          title: 'II. Các bước tiến hành',
          steps: [
            { step: 1, title: 'Chuẩn bị dung môi', desc: 'Đun nóng 200ml nước đến 70–80°C, đổ vào cốc thủy tinh.' },
            { step: 2, title: 'Pha dung dịch bão hòa', desc: 'Cho từ từ 100g CuSO₄ vào, khuấy đều đến khi bão hòa.' },
            { step: 3, title: 'Lọc dung dịch', desc: 'Lọc qua giấy lọc khi còn ấm, để nguội về nhiệt độ phòng.' },
            { step: 4, title: 'Nuôi mầm tinh thể', desc: 'Rót lớp mỏng vào đĩa petri, chờ 1–2 ngày, chọn mầm đẹp.' },
            { step: 5, title: 'Treo mầm tinh thể', desc: 'Buộc dây cước vào mầm, treo trong cốc dung dịch bão hòa.' },
            { step: 6, title: 'Chờ đợi và quan sát', desc: 'Đặt nơi khô mát, tránh rung lắc, đậy thoáng để hơi nước bay ra.' },
          ],
        },
      ],
    },
  });
});

module.exports = router;
