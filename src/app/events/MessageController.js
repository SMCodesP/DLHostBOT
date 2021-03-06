const checkUserHasPermission = require('../utils/checkUserHasPermission');

class Message {
  constructor() {
    this.message = async (msg, bot) => {
      const prefix = process.env.PREFIX;
      if (!msg.content.startsWith(prefix)) return;
      const args = msg.content.slice(prefix.length).trim().split(' ');
      const cmd = args.shift().toLowerCase();
      const commandFile =
        bot.commands.get(cmd) || bot.commands.get(bot.aliases.get(cmd));
      let state = true;
      if (commandFile) {
        if (commandFile.config.requiredPermissions) {
          commandFile.config.requiredPermissions.forEach((perm) => {
            if (!checkUserHasPermission(perm, msg.member)) state = false;
          });
        }
        msg.delete().catch(() => {});
        if (!state && msg.member.id !== process.env.OWNER) {
          msg.reply('Você não tem permissão para executar esse comando.');
        } else {
          commandFile.run(bot, msg, args, prefix);
        }
      }
    };
  }
}

module.exports = new Message().message;
