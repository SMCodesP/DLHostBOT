const Discord = require('discord.js');
const checkUserHasPermission = require('../utils/checkUserHasPermission');
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
        const tickets = await TicketsController.index();
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
        const request = await TicketsController.store({
          body: {
            msg,
            date: {
              year: date.getFullYear(),
              month: date.getMonth() + 1,
              day: date.getDate(),
            },
          },
        });

        if (request.error) return msg.reply(request.result);
        msg.reply(request.result);
        return true;
      },
      deletar: async (bot, msg, args, prefix) => {
        if (args[1]) {
          if (!checkUserHasPermission('MANAGE_MESSAGES', msg.member))
            return msg.reply(
              `Você não tem permissão para excluir tickets de outros usuários.`
            );
          const user =
            msg.mentions.members.first() || msg.guild.members.get(args[1]);

          try {
            await TicketsController.delete({
              body: {
                user_id: user.user.id,
                bot,
              },
            });
            return true;
          } catch (err) {
            return false;
          }
        }
        const ticket = await Tickets.findOne({ user_id: msg.author.id });
        if (!ticket)
          return msg.reply(
            `Você não tem um ticket registrado em nosso sistema de \`${prefix}ticket criar\`.`
          );
        const canal = bot.channels.get(ticket.channel_id);
        try {
          await Tickets.findOneAndDelete({ user_id: msg.author.id });
          await canal.delete().catch(() => {});
          msg.reply(
            `Você deletou seu ticket caso queira criar outro digite \`${prefix}ticket criar\`.`
          );

          return true;
        } catch (err) {
          msg.reply(
            'Houve um erro na requisição de delete de um ticket, tente novamente mais tarde.'
          );
          return false;
        }
        // bot.channels.get('697601749040758834').delete().catch(O_o=>{});
      },
    };
  }
}

module.exports = new Ticket();
