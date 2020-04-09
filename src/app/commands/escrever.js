class Say {
  constructor() {
    this.config = {
      name: 'escrever',
      aliases: ['say'],
      help: 'Esse comando re-envia uma mensagem em meu nome.',
      requiredPermissions: ['ADMINISTRATOR'],
    };

    this.run = (_, msg, args) => {
      const sayMsg = args.join(' ');
      msg.channel.send(sayMsg);
    };
  }
}

module.exports = new Say();
