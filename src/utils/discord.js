// src/utils/discord.js
// Sends a rich Discord embed when a visitor accesses the site

const axios = require('axios');

const FLAG_MAP = {
  VN: '🇻🇳', US: '🇺🇸', JP: '🇯🇵', KR: '🇰🇷', CN: '🇨🇳',
  GB: '🇬🇧', DE: '🇩🇪', FR: '🇫🇷', SG: '🇸🇬', TH: '🇹🇭',
  AU: '🇦🇺', CA: '🇨🇦', IN: '🇮🇳', BR: '🇧🇷', RU: '🇷🇺',
};

function flag(code) {
  return FLAG_MAP[code] || '🌐';
}

function deviceIcon(type) {
  if (!type || type === 'desktop') return '🖥️';
  if (type === 'mobile') return '📱';
  if (type === 'tablet') return '📟';
  return '💻';
}

async function sendVisitorWebhook(visitor) {
  const url = process.env.DISCORD_WEBHOOK_URL;
  if (!url || !url.startsWith('https://discord.com/api/webhooks/')) return;

  const countryFlag = flag(visitor.countryCode);
  const dIcon = deviceIcon(visitor.device?.toLowerCase());
  const ts = `<t:${Math.floor(new Date(visitor.timestamp).getTime() / 1000)}:F>`;

  const embed = {
    title: '🔬 Lượt truy cập mới — Crystal Guide',
    color: 0x1a9fff,
    thumbnail: { url: 'https://i.imgur.com/0BF8lXF.png' },
    fields: [
      {
        name: '🌐 Địa chỉ IP',
        value: `\`${visitor.ip}\``,
        inline: true,
      },
      {
        name: `${countryFlag} Quốc gia`,
        value: visitor.country || 'Unknown',
        inline: true,
      },
      {
        name: '🏙️ Thành phố',
        value: visitor.city || 'Unknown',
        inline: true,
      },
      {
        name: `${dIcon} Thiết bị`,
        value: visitor.device || 'Desktop',
        inline: true,
      },
      {
        name: '🌍 Trình duyệt',
        value: visitor.browser || 'Unknown',
        inline: true,
      },
      {
        name: '💻 Hệ điều hành',
        value: visitor.os || 'Unknown',
        inline: true,
      },
      {
        name: '📄 Trang truy cập',
        value: `\`${visitor.path}\``,
        inline: true,
      },
      {
        name: '🔗 Referer',
        value: visitor.referer ? `\`${visitor.referer.substring(0, 60)}\`` : 'Direct',
        inline: true,
      },
      {
        name: '🌐 Ngôn ngữ',
        value: visitor.language || 'Unknown',
        inline: true,
      },
      {
        name: '🕐 Thời gian',
        value: ts,
        inline: false,
      },
      {
        name: '🆔 Session ID',
        value: `\`${visitor.sessionId}\``,
        inline: false,
      },
    ],
    footer: {
      text: `Crystal Guide • Nuôi Tinh Thể CuSO₄`,
      icon_url: 'https://i.imgur.com/0BF8lXF.png',
    },
    timestamp: visitor.timestamp,
  };

  try {
    await axios.post(url, {
      username: '🔬 Crystal Guide Monitor',
      avatar_url: 'https://i.imgur.com/0BF8lXF.png',
      embeds: [embed],
    }, { timeout: 5000 });
  } catch (err) {
    console.error('[Discord Webhook] Failed:', err.message);
  }
}

module.exports = { sendVisitorWebhook };
