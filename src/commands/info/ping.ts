import { Command } from "../../structures/Command";

export default new Command({
    name: "ping",
    description: "Antwortet mit pong",
    run: async ({ interaction }) => {
        interaction.followUp("pong");
        global.botAvailable = true;
    }
});