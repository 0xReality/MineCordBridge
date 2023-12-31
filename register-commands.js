const { REST, Routes } = require('discord.js');

const commands = [
  {
    name: 'hey',
    description: 'Replies with hey!',
  },
  {
    name: 'ping',
    description: 'Pong!',
  },
];

const rest = new REST({ version: '10' }).setToken(' replace with token');

(async () => {
  try {
    console.log('Registering slash commands...');

    await rest.put(
      Routes.applicationGuildCommands(
        'replace with bot id',
        'replace with guild id'
      ),
      { body: commands }
    );

    console.log('Slash commands were registered successfully!');
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
})();
