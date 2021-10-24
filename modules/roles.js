const Discord = require('discord.js');

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord} discord 
 */
module.exports = (client, discord) => {

    client.on('interactionCreate', async interaction => {
        if(interaction.isButton()) {
            if(interaction.message.author.id !== client.user.id) return;


            if(interaction.customId == 'server-ping') {

                if(interaction.member.roles.cache.has('901111456530042930')) {
                  interaction.member.roles.remove('901111456530042930').catch(() => {});
                  interaction.reply({ ephemeral: true, content: 'Successfully removed your <@&901111456530042930> role!' })
                }
                else {
                    interaction.member.roles.add('901111456530042930').catch(() => {});
                    interaction.reply({ ephemeral: true, content: 'Successfully added  <@&901111456530042930> to your role!' })
                }

            } else if(interaction.customId == 'announcement-ping') {
                if(interaction.member.roles.cache.has('901043203027906560')) {
                    interaction.member.roles.remove('901043203027906560').catch(() => {});
                    interaction.reply({ ephemeral: true, content: 'Successfully removed your <@&901043203027906560> role!' })
                  }
                  else {
                      interaction.member.roles.add('901043203027906560').catch(() => {});
                      interaction.reply({ ephemeral: true, content: 'Successfully added  <@&901043203027906560> to your role!' })
                  }
            }
        }
    })

}