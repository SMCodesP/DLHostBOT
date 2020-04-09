const Discord = require('discord.js');

class Ajuda {
  constructor() {
    this.config = {
      name: 'ajuda',
      aliases: ['help'],
      help:
        'Com esse comando você pode requisitar a lista de comandos que eu possuo.',
    };

    this.run = (bot, msg, args, prefix) => {
      const embed = new Discord.RichEmbed()
        .setTitle(`Comandos do bot ${bot.user.username}`)
        .setColor('#222222')
        .setThumbnail(bot.user.avatarURL)
        .addBlankField()
        .setTimestamp()
        .setFooter('DLHostBr - Copyright ©', bot.user.avatarURL);
      let commands = 0;
      bot.commands.forEach((cmd) => {
        const { name, help } = cmd.config;
        embed
          .addField(`**${prefix}${name} » **`, `**${help}**`)
          .addBlankField();
        commands += 1;
      });

      msg.channel.send('Carregando...').then((message) => {
        setTimeout(() => {
          message.edit(
            embed.setDescription(
              `**- Versão atual do bot » ${process.env.VERSION}\n- Name do bot » ${bot.user.username}\n- ID do bot » ${bot.user.id}\n- Quantidade de comandos » ${commands}**`
            )
          );
        }, commands * 75);
      });
    };
  }
}

module.exports = new Ajuda();
