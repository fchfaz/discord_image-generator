const { Client, IntentsBitField } = require('discord.js');
const { CommandHandler } = require('djs-commander');
const { BOT_TOKEN } = require('../config.json');
const path = require('path');

const client = new Client({
  intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers],
});

new CommandHandler({
  client,
  commandsPath: path.join(__dirname, 'commands'),
});

client.login(BOT_TOKEN);

client.on('ready', () => {
  console.log(`${client.user.tag} telah online`);
});
