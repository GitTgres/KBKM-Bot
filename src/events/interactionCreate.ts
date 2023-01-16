import { CommandInteractionOptionResolver } from "discord.js";
import { client } from "..";
import { Event } from "../structures/Event";
import { ExtendedInteraction } from "../typings/Command";

export default new Event("interactionCreate", async (interaction) => {
    if (!global.botAvailable) return;
    global.botAvailable = false;
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (command.name === "w2g" || command.name === "server") 
        {
            if (interaction.options.getString('hidden') !== null) 
            {
                await interaction.deferReply({ ephemeral: true });
            }
            else
            {
                await interaction.deferReply();
            }
        }
        else
        {
            await interaction.deferReply();
        }
        if (!command)
            return interaction.followUp("You have used a non existent command");
        command.run({
            args: interaction.options as CommandInteractionOptionResolver,
            client,
            interaction: interaction as ExtendedInteraction
        });
    }
});