const { Client, GatewayIntentBits } = require('discord.js');
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

  fetch(GAS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
    redirect: 'follow'
  })
  .then(res => console.log('GAS 回應：' + res.status))
  .catch(e => console.error('發送 GAS 錯誤：' + e.message));
});

client.login(DISCORD_BOT_TOKEN);
