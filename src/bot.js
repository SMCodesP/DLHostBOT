const Discord = require('discord.js');
const path = require('path');
const mongoose = require('mongoose');
const { registerCmds } = require('register-cmd-discord');
const MessageController = require('./app/events/MessageController');
require('dotenv').config();

class Bot {
  constructor() {
    this.bot = new Discord.Client();
    const pathCommands = path.resolve(__dirname, 'app', 'commands');
    this.bot.commands = new Discord.Collection();
    this.bot.aliases = new Discord.Collection();
    const { cmds, als } = registerCmds(
      pathCommands,
      this.bot.commands,
      this.bot.aliases
    );

    this.bot.commands = cmds;
    this.bot.aliases = als;

    this.settings();
    this.event();
    this.login();
  }

  settings() {
    mongoose.connect(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  login() {
    this.bot.login(process.env.TOKEN);
  }

  event() {
    this.bot.on('message', (msg) => {
      MessageController(msg, this.bot);
    });
  }
}

module.exports = new Bot();
