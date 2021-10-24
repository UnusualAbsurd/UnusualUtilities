const Discord = require('discord.js')
const discordTranscripts = require('discord-html-transcripts');
const parent = {
    close: '901327618874429480'
}


const close_button = new Discord.MessageButton()
    .setLabel('Close Ticket')
    .setEmoji('🚫')
    .setStyle('DANGER')
    .setCustomId('close')

const claim = new Discord.MessageButton()
    .setLabel('Claim Ticket')
    .setEmoji("🔒")
    .setStyle("PRIMARY")
    .setCustomId('claim')


/**
* @param {Discord.Client} client
* @param {Discord} discord
*/
module.exports = async (client, discord) => {

    client.on('interactionCreate', async interaction => {
        if (interaction.isButton()) {
            if (interaction.message.author.id !== client.user.id) return;
            else {

                const log = interaction.guild.channels.cache.get('901325394500780042')

                if (interaction.customId === 'ticket') {

                    const filter = await interaction.guild.channels.cache.find(r => r.topic === `${interaction.user.id}`);
                    if (filter) return interaction.reply({ ephemeral: true, content: `It looks like you already have a ticket! Please visit: <#${filter.id}> . If its an invalid channel, please contact the support team.` })
                    if (!filter) {
                        interaction.deferUpdate()
                        const ch = await interaction.guild.channels.create(`ticket-${Math.floor(1000 + Math.random() * 9000)}`, {
                            reason: 'Creating Ticket Channel',
                            type: "GUILD_TEXT",
                            topic: interaction.user.id,
                            permissionOverwrites: [
                                {
                                    id: interaction.guild.id,
                                    deny: ['VIEW_CHANNEL']
                                },
                                {
                                    id: interaction.user.id,
                                    allow: [
                                        "VIEW_CHANNEL",
                                        "SEND_MESSAGES",
                                        "READ_MESSAGE_HISTORY"
                                    ]
                                },
                                {
                                    id: '901004742304616478',
                                    allow: [
                                        "VIEW_CHANNEL",
                                        "ATTACH_FILES",
                                        "ADD_REACTIONS",
                                        "MANAGE_MESSAGES",
                                        "EMBED_LINKS",
                                        "SEND_MESSAGES",
                                        "READ_MESSAGE_HISTORY"
                                    ]
                                },
                                {
                                    id: '901005029316640811',
                                    allow: [
                                        "VIEW_CHANNEL",
                                        "ATTACH_FILES",
                                        "ADD_REACTIONS",
                                        "MANAGE_MESSAGES",
                                        "EMBED_LINKS",
                                        "SEND_MESSAGES",
                                        "READ_MESSAGE_HISTORY"
                                    ]

                                }
                            ]
                        })

                        const user = await client.users.fetch(`${ch.topic}`)

                        const create_embed = new Discord.MessageEmbed()
                            .setColor("GREEN")
                            .setDescription(`**You have successfully created a ticket!**\nPlease wait for the <@&901004742304616478> members to view this channel and help you in what you need!`)
                            .setTimestamp()
                            .setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ dynamic: true }))
                            .setFooter(interaction.user.id)

                        ch.send(`<@!${interaction.user.id}> | <@&901004742304616478>`).then(m => setTimeout(() => m.delete().catch(() => { }), 200))
                        ch.send({ embeds: [create_embed], components: [new discord.MessageActionRow().addComponents([claim, close_button, new discord.MessageButton().setLabel('Save Transcript').setStyle("SECONDARY").setCustomId('save').setEmoji('📑')])] })

                        log.send({
                            embeds: [new discord.MessageEmbed().setColor("GREEN").setTimestamp()
                                .setTitle('Ticket Created')
                                .setAuthor(`${user.tag}`, `${user.displayAvatarURL({ dynamic: true })}`)
                                .addField('Ticket Creator', `<@!${user.id}>`, true)
                                .addField(`Ticket Creator ID`, `\`${user.id}\``, true)
                                .addField('Ticket Creation', `<t:${Math.floor(interaction.channel.createdTimestamp / 1000)}:D>`, true)
                                .setFooter(`Ticket ID: ${ch.name.split("-")[1]}`)
                            ]
                        })
                    }
                } // Ticket Button
                if (interaction.customId === 'save') {
                    
                    if (!interaction.member.roles.cache.has('901004742304616478')) {
                        interaction.reply({ ephemeral: true, content: `Only the <@&901004742304616478> can save transcripts.` })
                    } else {

                        const channel = interaction.channel; // or however you get your TextChannel

                        if (channel.topic == 'Closed-Ticket') return interaction.reply({
                            ephemeral: true,
                            content: "This is a closed ticket. Can't save ticket!"
                        })

                        // Must be awaited
                        const attachment = await discordTranscripts.createTranscript(channel, {
                            returnBuffer: false,
                            fileName: `${interaction.channel.name}-transcript.html`
                        });




                        const user = await client.users.fetch(`${interaction.channel.topic}`)
                        const mod = await client.users.fetch(`${interaction.user.id}`)


                        log.send({
                            embeds: [new discord.MessageEmbed().setColor("ORANGE")
                                .setTitle('Ticket Transcript Saved')
                                .setAuthor(`${user.tag}`, `${user.displayAvatarURL({ dynamic: true })}`)
                                .addField('Ticket Creator', `<@!${user.id}>`, true)
                                .addField(`Ticket Creator ID`, `\`${user.id}\``, true)
                                .addField('Ticket Creation', `<t:${Math.floor(interaction.channel.createdTimestamp / 1000)}:D>`, true)
                                .addField('Closed by', `<@!${mod.id}> (\`${mod.id}\`)`)
                                .setFooter(`Ticket ID: ${interaction.channel.name.split("-")[1]}`)
                                .setTimestamp()
                            ], files: [attachment]
                        })
                        interaction.reply({ content: "Successfully saved the transcript.", ephemeral: true })
                    }

                }

            }
        }
        else return;
    })

    client.on('interactionCreate', async interaction => {
        if (interaction.isButton()) {
            if (interaction.message.author.id !== client.user.id) return;
            else {
                const log = interaction.guild.channels.cache.get('901325394500780042')

                if (interaction.customId == 'close') {

                    if (!interaction.member.roles.cache.has('901004742304616478')) {
                        interaction.reply({ ephemeral: true, content: `Only the <@&901004742304616478> can close tickets.` })



                    } else {
                        if (interaction.channel.parentId === parent.close) return interaction.reply({ ephemeral: true, content: `Ticket <#${interaction.channel.name}> is already closed.` })


                        else {
                            interaction.reply({ ephemeral: true, content: 'Closing ticket in 5 seconds.' })

                            const user = await client.users.fetch(`${interaction.channel.topic}`);

                            setTimeout(function () {
                                interaction.channel.setTopic('Closed-Ticket', 'closing ticket')
                                interaction.channel.setParent(parent.close)
                            }, 5 * 1000)
                            log.send({
                                embeds: [new discord.MessageEmbed().setColor("RED").setTimestamp()
                                    .setTitle('Ticket Closed')
                                    .setAuthor(`${user.tag}`, `${user.displayAvatarURL({ dynamic: true })}`)
                                    .addField('Ticket Creator', `<@!${user.id}>`, true)
                                    .addField(`Ticket Creator ID`, `\`${user.id}\``, true)
                                    .addField('Ticket Creation', `<t:${Math.floor(interaction.channel.createdTimestamp / 1000)}:D>`, true)
                                    .addField(`Closed by`, `<@!${interaction.user.id}> (\`${interaction.user.id}\`)`)
                                    .setFooter(`Ticket ID: ${interaction.channel.name.split("-")[1]}`)

                                ]
                            })
                        }
                    }


                }

                if(interaction.customId == 'claim') {
                    
                    if (!interaction.member.roles.cache.has('901004742304616478')) {
                        interaction.reply({ ephemeral: true, content: `Only the <@&901004742304616478> can claim tickets.` })



                    } else {

                        interaction.channel.permissionOverwrites.set([
                            {
                                id: interaction.guild.id,
                                deny: ['VIEW_CHANNEL']
                            },
                            {
                                id: interaction.channel.topic,
                                allow: [
                                    "VIEW_CHANNEL",
                                    "SEND_MESSAGES",
                                    "READ_MESSAGE_HISTORY"
                                ]
                            },
                            {
                                id: '901004742304616478',
                                deny: [
                                  "VIEW_CHANNEL"
                                ]
                            },
                            {
                                id: '901005029316640811',
                                allow: [
                                    "VIEW_CHANNEL",
                                    "ATTACH_FILES",
                                    "ADD_REACTIONS",
                                    "MANAGE_MESSAGES",
                                    "EMBED_LINKS",
                                    "SEND_MESSAGES",
                                    "READ_MESSAGE_HISTORY"
                                ]

                            },
                            {
                                id: interaction.user.id,
                                allow: [
                                    "VIEW_CHANNEL",
                                    "ATTACH_FILES",
                                    "ADD_REACTIONS",
                                    "MANAGE_MESSAGES",
                                    "EMBED_LINKS",
                                    "SEND_MESSAGES",
                                    "READ_MESSAGE_HISTORY"
                                ]
                            }

                        ])

                        interaction.reply({ ephemeral: true
                        , content: "Successfully claim the ticket!" })

                        const user = await client.users.fetch(`${interaction.channel.topic}`)

                        log.send({
                            embeds: [
                                new discord.MessageEmbed()
                                .setColor("NAVY")
                                .setTitle('Ticket Claimed')
                                .setAuthor(`${user.tag}`, user.displayAvatarURL({dynamic: true}))
                                .addField('Ticket Creator', `<@!${user.id}>`, true)
                                .addField(`Ticket Creator ID`, `\`${user.id}\``, true)
                                .addField('Ticket Creation', `<t:${Math.floor(interaction.channel.createdTimestamp / 1000)}:D>`, true)
                                .addField(`Claimed by`, `<@!${interaction.user.id}> (\`${interaction.user.id}\`)`)
                                .setFooter(`Ticket ID: ${interaction.channel.name.split("-")[1]}`)
                            ]
                        })
                    }
                }
               
            
            }
        }
    })

    
}
