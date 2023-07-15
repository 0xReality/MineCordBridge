const express = require('express');
const app = express();
const { Client, IntentsBitField, EmbedBuilder, ApplicationCommandOptionType, ButtonBuilder, ActionRowBuilder, Embed } = require('discord.js');
const bodyParser = require('body-parser');
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.MessageContent,
  ],
});

app.use(bodyParser.json());


client.on('ready', () => {
  console.log(`✅ ${client.user.tag} is online.`);
});

client.on('interactionCreate', (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'hey') {
    return interaction.reply('hey!');
  }

  if (interaction.commandName === 'ping') {
    return interaction.reply('Pong!');
  }
});

client.login("");

// API endpoint to execute command and check user tag
const guildId = ''; // Replace with your desired guild ID
const channelId = '';

app.post('/execute-command', async (req, res) => {
  const userId = req.body.command;
  console.log('Received command:', userId);

  const guild = client.guilds.cache.get(guildId);
  if (!guild) {
    console.error('Guild not found.');
    return res.json({ foundUser: 2 }); //TODO edit every error code depending of php switch case
  }

  try {
    const member = await guild.members.fetch(userId);
    if (!member) {
      return res.json({ foundUser: 2 }); // User not in the guild
    }

    const channel = client.channels.cache.get(channelId);
    if (!channel) {
      console.error('Channel not found or not a text channel.');
      return res.json({ foundUser: 2 }); // Channel doesn't exist or not a text channel 
    }

    const user = client.users.resolve(userId);
    if (!user) {
      console.error('User not found.');
      return res.json({ foundUser: 2 });
    }

    const invitation = new EmbedBuilder()
        .setTitle('Account Linking')
        .setDescription(`Hello ${client.users.resolve(userId)}, are you trying to link your Discord account with your Minecraft account?`)
        .setColor('#00FF00')
      
        const buttonAccept = new ButtonBuilder()
        .setStyle('Success')
        .setLabel('Accept')
        .setCustomId('acceptButton');
      
        const buttonDecline = new ButtonBuilder()
        .setStyle('Danger')
        .setLabel('Decline')
        .setCustomId('declineButton');
      
        const actionRow = new ActionRowBuilder()
        .addComponents(buttonAccept, buttonDecline);
        
        const message = await client.users.send(userId, { embeds: [invitation], components: [actionRow] });

    const filter = (i) => i.user.id === userId && ['acceptButton', 'declineButton'].includes(i.customId);
    const collector = message.createMessageComponentCollector({ filter, time: 10000 });

    collector.on('collect', async (interaction) => {
      const { customId } = interaction;

      if (customId === 'acceptButton') {
        const invitationAccepted = new EmbedBuilder()
          .setTitle('Account Linking Successful')
          .setDescription('Congratulations! Your Discord account has been successfully linked to your Minecraft account.')
          .setColor('#00FF00');
        await interaction.reply({ embeds: [invitationAccepted] });
        channel.send(`${user} has linked their account`);
        collector.stop();
        res.json({ foundUser: 1 });
      } else if (customId === 'declineButton') {
        const invitationDeclined = new EmbedBuilder()
          .setTitle('Invitation Declined')
          .setDescription('We\'re sorry to hear that you declined the account linking invitation.')
          .setColor('#FF0000');
        await interaction.reply({ embeds: [invitationDeclined] });
        collector.stop();
        res.json({ foundUser: 2 });
      }
    });

    collector.on('end', (collected, reason) => {
      if (reason === 'time') {
        const invitationExpired = new EmbedBuilder()
          .setTitle('Invitation Has Expired')
          .setDescription(`The Invitation sent from ${client.users.resolve(userId)} has expired!`)
          .setColor('#FF0000');
          client.users.send(userId, { embeds: [invitationExpired] });
          res.json({ foundUser: 2 });
      }
    });

  } catch (error) {
    console.error('Error fetching member:', error);
    res.json({ foundUser: 2 }); // API error
  }
});




app.listen(4010, () => {
  console.log('Server listening on port 4000');
});



