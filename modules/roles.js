const Discord = require("discord.js");

/**
 *
 * @param {Discord.Client} client
 * @param {Discord} discord
 */
module.exports = (client, discord) => {
  client.on("interactionCreate", async (interaction) => {
    if (interaction.isSelectMenu()) {
  
        if (interaction.message.author.id !== client.user.id) return;

        function select(menu) {
            switch (menu.values[0]) {
              case "sping":
                if (menu.member.roles.cache.has("901111456530042930")) {
                  menu.member.roles.remove("901111456530042930").catch(() => {});
                  menu.reply({
                    ephemeral: true,
                    content:
                      "Successfully removed your <@&901111456530042930> role!",
                  });
                } else {
                  menu.member.roles.add("901111456530042930").catch(() => {});
                  menu.reply({
                    ephemeral: true,
                    content:
                      "Successfully added  <@&901111456530042930> to your role!",
                  });
                }
                break;
              case "aping":
                if (interaction.member.roles.cache.has("901043203027906560")) {
                    menu.member.roles
                    .remove("901043203027906560")
                    .catch(() => {});
                    menu.reply({
                    ephemeral: true,
                    content:
                      "Successfully removed your <@&901043203027906560> role!",
                  });
                } else {
                    menu.member.roles
                    .add("901043203027906560")
                    .catch(() => {});
                    menu.reply({
                    ephemeral: true,
                    content:
                      "Successfully added  <@&901043203027906560> to your role!",
                  });
                }
                break;

            }
        }
        if(interaction.customId === 'selection') {
            select(interaction)
        }
  
    }
  });
};
