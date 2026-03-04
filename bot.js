const { Client, GatewayIntentBits } = require('discord.js');
const https = require('https');

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;
const GAS_URL = process.env.GAS_URL;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

client.once('ready', () => {
  console.log('天堂M Bot 已啟動！監聽中...');
});

client.on('messageCreate', async (message) => {
  if (message.channelId !== CHANNEL_ID) return;
  if (!message.webhookId && !message.author.username.includes('Captain')) return;

  const text = message.content;
  if (!text) return;

  console.log('收到訊息：' + text.substring(0, 50));

  const payload = JSON.stringify({ text: text, timestamp: new Date().toISOString() });

  const url = new URL(GAS_URL);
  const options = {
    hostname: url.hostname,
    path: url.pathname + url.search,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  const req = https.request(options, (res) => {
    console.log('GAS 回應：' + res.statusCode);
  });

  req.on('error', (e) => {
    console.error('發送 GAS 錯誤：' + e.message);
  });

  req.write(payload);
  req.end();
});

client.login(DISCORD_BOT_TOKEN);
