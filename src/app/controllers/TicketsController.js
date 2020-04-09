const Tickets = require('../models/Tickets');

class TicketController {
  index(req) {
    return new Promise((res, rej) => {
      const { user_id } = req.body;

      const ticket = Tickets.findOne({ user_id }, (err, result) => {
        if (err)
          return rej(
            new Error(
              'Houve um erro em nosso sistema,tente novamente mais tarde.'
            )
          );
        if (!ticket) return rej(new Error('Ticket não encontrado.'));
        return res(result);
      });
    });
  }

  // store(req) {
  //   return new Promise(async (res, rej) => {
  //     const { msg, date } = req.body;
  //     try {
  //       const ticket = await msg.guild.createChannel(
  //         `ticket-${msg.author.id}`,
  //         'text',
  //         [
  //           ...positions,
  //           {
  //             id: msg.author.id,
  //             allow: ['READ_MESSAGES'],
  //           },
  //           {
  //             id: msg.guild.id,
  //             deny: ['READ_MESSAGES'],
  //           },
  //         ]
  //       );
  //       await Tickets.create({
  //         user_id: msg.author.id,
  //         name_channel: `ticket-${msg.author.id}`,
  //         channel_id: ticket.id,
  //         date,
  //       });
  //       return res(
  //         `Você criou um ticket,para acessa-lo clique aqui: ${ticket}`
  //       );
  //     } catch (err) {
  //       return rej(`Houve um erro na requisição de criação de um ticket,
  //         tente novamente mais tarde.`);
  //     }
  //   });
  // }

  // delete(req) {
  //   return new Promise(async (res, rej) => {
  //     const { user_id, bot } = req.body;
  //     try {
  //       let ticket = await Tickets.findOne({ user_id });
  //       try {
  //         await Tickets.findOneAndDelete({ user_id });

  //         try {
  //           const canal = bot.channels.fetch(ticket.channel_id);
  //           ticket = await Tickets.findOneAndDelete({ user_id: user.user.id });
  //           try {
  //             await canal.delete();
  //             msg.reply(`Você deletou o ticket de <@${user.user.id}>.`);

  //             return res('Ticket excluído com sucesso!');
  //           } catch (err) {
  //             console.log(err);
  //             return rej(`Houve um erro em nosso sistema,
  //               tente novamente mais tarde.`);
  //           }
  //         } catch (err) {
  //           console.log(err);
  //           return rej(`Houve um erro em nosso sistema,
  //             tente novamente mais tarde.`);
  //         }
  //       } catch (err) {
  //         console.log(err);
  //         return rej(`Houve um erro em nosso sistema,
  //           tente novamente mais tarde.`);
  //       }
  //     } catch (err) {
  //       console.log(err);
  //       return rej(`Houve um erro em nosso sistema,
  //         tente novamente mais tarde.`);
  //     }
  //   });
  // }
}

module.exports = new TicketController();
