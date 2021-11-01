const discord = require('discord.js');
require('dotenv').config();
const env = process.env

const color = '#2F3136';

function checkForOwner(message) {
  if(message.author.id !== '746721583804055634') return false;
  else return true;
}

const client = new discord.Client({
    intents: [
        "GUILD_MEMBERS",
        "GUILD_MESSAGES",
        "DIRECT_MESSAGES",
        "DIRECT_MESSAGE_TYPING",
        "GUILDS",
        "GUILD_MEMBERS",
    ],
    partials: ["GUILD_MEMBER", "MESSAGE", "CHANNEL", "USER"]
})

const prefix = '$'

client.on('ready', () => {

    console.log(`Logged in as ${client.user.tag}`)

    const guild = client.guilds.cache.get('869207783025836083').memberCount

    setInterval(function() {
        client.user.setActivity(`over ${guild} members.`,{ type: "WATCHING" })

    }, 10 * 1000)

})



/**
 * Verification Checker
 */

client.on('guildMemberAdd', async member => {
    member.roles.add('901007075272982528').catch(() => { })

    const reason = 'Kicked | Failing Verification "limited time reason"'

    setTimeout(async function () {
        if (!member.roles.cache.has('901004970671870012')) {

            (await member.user.createDM()).send({
                embeds: [new discord.MessageEmbed().setColor("RED")
                    .setDescription(`<:RedTick:899904214740922378> You have been kicked from *${member.guild.name}* because you took too long to verify.`)
                    .setTimestamp()
                    .setAuthor(member.user.tag, member.user.displayAvatarURL({ dynamic: true }))]
            }).catch(() => {})

    

            member.kick(reason);

        }
        else return;
    }, 90000)
})

/**
 * Commands
 */

client.on('messageCreate', async message => {
    if (
        message.author.bot ||
        !message.content?.toLowerCase().startsWith('$')
    ) return;

    const [cmd, ...args] = message.content
        .slice(prefix.length)
        .trim()
        .split(/ +/g);

    const command = cmd.toLowerCase();

    
        /**
         * Verification Setup Command
         */

        if (command === 'setup') {

            const row = new discord.MessageActionRow().addComponents([new discord.MessageButton()
                .setCustomId('verify-unusualden')
                .setLabel('Verify')
                .setStyle("SUCCESS")
            ])

            message.channel.send({
                embeds: [
                    new discord.MessageEmbed().setColor(color)
                        .setThumbnail(message.guild.iconURL({ dynamic: true }))
                        .setAuthor(`${message.guild.name} Verification`)
                        .setDescription('Please click the **Verify** button to be verified.')
                        .setFooter('If you took longer than **1m 30s** , you will be kicked', message.guild.iconURL({dynamic: true}))
                ],
                components: [row]
            })

        }

        /**
         * Auto Role Setup Command
         */

        if(command === 'role') {

            let aping = {
                label: 'Announcement Ping',
                description: "Get pinged when there is an announcement",
                value: 'aping',
                emoji: '🔔'
            }

            let sping = {
                label: 'Server Update Ping',
                description: "Get pinged when there is a server update!",
                value: 'sping',
                emoji: '🌱'
            }


            const row = new discord.MessageActionRow()
            .addComponents([
                new discord.MessageSelectMenu()
                .setPlaceholder("Pick the roles!")
                .setCustomId('selection')
                .setMaxValues(1)
                .setOptions([
                   aping, sping
                ])
            ])

            message.channel.send({ embeds: [new discord.MessageEmbed().setTimestamp().setTitle('Please select the role that you want to pick! ').setColor(color).setAuthor(message.guild.name + " Reaction Roles", message.guild.iconURL({dynamic: true}))], components: [row]})


        }


        /**
         * TIcket Clear Commadn
         */

        if(command === 'tclear') {
           if(!checkForOwner(message)) return;
           if(checkForOwner(message)) {
               message.guild.channels.cache.filter(ch => ch.isText() && ch.parentId === '901327618874429480' && ch.topic == 'Closed-Ticket').forEach(channel => {
                   channel.delete().catch(() => {})
               })
           }
        }

        /**
         * Info
         */
        if(command === 'info') {
            message.channel.send({
                embeds: [
                    new discord.MessageEmbed()
                    .setColor(color)
                    .setAuthor(`${client.user.username}`, client.user.displayAvatarURL())
                    .addField('Users', `${client.users.cache.size || 0} `)
                ],
                components: [new discord.MessageActionRow().addComponents(new discord.MessageButton().setLabel("Source Code").setStyle("LINK").setURL('https://github.com/UnusualAbsurd/UnusualUtilities').setEmoji("<:github:901714580026298408>"))]
            })
        }

        /**
         * Clear Command
         */

        if(command === 'clear') {

            if(!checkForOwner(message)) return message.channel.send("Owner Only Command.");
            if(checkForOwner(message)) {
                
                message.channel.bulkDelete(Math.floor(args[0])).catch((e) => message.channel.send(`\`\`\`${e.message}\`\`\``))
            }
         
        }
        
        /**
         * Ticket Command
         */
        if(command === 'ticket') {
            if(!checkForOwner(message)) return;
            if(checkForOwner(message)) {
                
                const row = new discord.MessageActionRow().addComponents([
                    new discord.MessageButton()
                    .setLabel('Create Ticket')
                    .setStyle("SUCCESS")
                    .setEmoji('🎫')
                    .setCustomId('ticket')
                ])

                message.channel.send({
                    embeds: [new discord.MessageEmbed()
                    .setColor(color)
                    .setTimestamp()
                    .setAuthor(`${message.guild.name} Ticket`, message.guild.iconURL({dynamic: true}))
                    .setDescription('Click **Create Ticket** button to create a ticket for comissions.\n\nIf you have any problems , just DM the staff don\'t create tickets for staff support.')
                    ], components: [row]
                })

            }
        }

       

    

    
})


/**
 * Suggestion
 */

client.on('messageCreate', async message => {
    if(message.author.bot || !message.guild) return;

    if(message.channel.id === '901039960340197407') {
      message.delete().catch(() => {});

      message.channel.send({
          embeds: [
              new discord.MessageEmbed()
              .setColor(color)
              .setTimestamp()
              .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({dynamic: true}), message.author.displayAvatarURL({dynamic: true}))
              .setDescription(`${message.content}`)
              .setFooter(`${message.author.id}`)
          ]
      }).then(msg => {
          msg.react('<:GreenTick:899904309293109268>').catch(() => {})
          msg.react("<:RedTick:899904214740922378>").catch(() => {})
      })
    }
    else return
})

/**
 * Verification
 */

client.on('interactionCreate', async interaction => {
    if (interaction.isButton()) {

        if (interaction.message.author.id !== client.user.id) return;

        if (interaction.customId === 'verify-unusualden') {

            if (interaction.member.roles.cache.has("901004970671870012")) {
                interaction.reply({ content: 'You have been verified already. Contact the support team for help.', ephemeral: true })
            }
            else {
                interaction.deferUpdate();
                interaction.member.roles.remove('901007075272982528').catch(() => { });
                interaction.member.roles.add('901004970671870012').catch(() => { })
            }


        }

    }
})

require('./modules/roles')(client, discord)
require('./modules/ticket')(client, discord)

process.on('unhandledRejection', function(error) {
   console.error(error.message)
   console.error(error.stack)
})

client.on('error', error => {
    console.log(error.stack)
})

module.exports = {
    name: 'helol',
}


client.login(`${env.TOKEN}`)
