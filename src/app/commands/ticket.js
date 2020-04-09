const Discord = require('discord.js');
const TicketsController = require('../controllers/TicketsController');
const Tickets = require('../models/Tickets');

class Ticket {
  constructor() {
    this.utils();
    this.config = {
      name: 'ticket',
      aliases: [],
      help: 'Esse comando gerencia o meu sistema de tickets.',
    };

    this.run = (bot, msg, args, prefix) => {
      const func = this.functions[args[0]];
      if (!func)
        return msg.reply(
          `Esse sub-comando não existe utilize: \`${
            prefix + this.config.name
          } lista\``
        );
      func(bot, msg, args, prefix);
      return true;
    };
  }

  utils() {
    this.functions = {
      lista: async (bot, msg, args, prefix) => {
        const embed = new Discord.MessageEmbed()
          .setTitle('**Sub comandos do comando ticket**')
          .setColor('#222222')
          .addField(`**\n**`, `**\n**`)
          .addField(
            `**${prefix}ticket criar**`,
            'Esse sub-comando serve para você abrir um ticket.'
          )
          .addField(
            `**${prefix}ticket deletar**`,
            'Esse sub-comando serve para deletar um ticket que você abriu anteriormente.'
          )
          .addField(
            `**${prefix}ticket lista**`,
            'Esse sub-comando serve para var a lista de sub-comandos.'
          )
          .addField(`**\n**`, `**\n**`)
          .setTimestamp()
          .setFooter(msg.author.tag, bot.user.avatarURL);
        msg.channel.send(embed);
      },
      criar: async (bot, msg, args, prefix) => {
        if (await Tickets.findOne({ user_id: msg.author.id }))
          return msg.reply(
            `Você já tem um ticket solicitado espere até um staffer fechar ou feche você mesmo usando \`${
              prefix + this.config.name
            } deletar\`.`
          );

        const date = new Date();
        TicketsController.store({
          body: {
            msg,
            date: {
              year: date.getFullYear(),
              month: date.getMonth() + 1,
              day: date.getDate(),
            },
          },
        })
          .then((result) => {
            msg.reply(result);
          })
          .catch((err) => {
            msg.reply(err);
          });
        return true;
      },
      deletar: async (bot, msg, args) => {
        let deleted = msg.member;
        if (args[1]) {
          if (!msg.member.hasPermission('MANAGE_MESSAGES'))
            return msg.reply(
              `Você não tem permissão para excluir tickets de outros usuários.`
            );
          deleted =
            msg.mentions.members.first() || msg.guild.members.get(args[1]);
        }
        try {
          const ticket = await TicketsController.delete({
            body: {
              user_id: deleted.user.id,
              bot,
              user: deleted,
            },
          });
          msg.reply(ticket);
        } catch (err) {
          msg.reply(err);
        }

        return null;
      },
    };
  }
}

module.exports = new Ticket();
