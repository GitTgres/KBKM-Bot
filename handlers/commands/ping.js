const { Client, Message } = require("discord.js");

module.exports = {
    name: 'ping',
    description: 'Zeigt den Ping des Bots und der API an.',
    aliases: [],

    /**
     * 
     * @param {Client} bot 
     * @param {Message} message 
     * @param {String[]} parts 
     * @param {String} prefix 
     */
    async execute(bot, message, parts, prefix) {
        message.reply({
            content: `Der Bot Ping liegt bei \`${Date.now() - message.createdTimestamp}ms\`\nDer API Ping liegt bei \`${bot.ws.ping}ms\``
        })
    }
}