const { Client, Message, MessageEmbed } = require("discord.js");

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

        const exampleEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Hier ein neuer Watch2Gether Link')
        .setURL('https://discord.js.org/')
        //.setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
        //.setDescription('Some description here')
        .setThumbnail('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP._gelCIt-j64pWPX1sJ7r-AHaHa%26pid%3DApi&f=1')
        //.addFields(
        //    { name: 'Regular field title', value: 'Some value here' },
        //    { name: '\u200B', value: '\u200B' },
        //    { name: 'Inline field title', value: 'Some value here', inline: true },
        //    { name: 'Inline field title', value: 'Some value here', inline: true },
        //)
        .addField('Inline field title', 'Some value here', true)
        //.setImage('https://i.imgur.com/AfFp7pu.png')
        //.setTimestamp()
        //.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
        message.reply({ embeds: [exampleEmbed]});
        //message.reply({
        //    content: `Der Bot Ping liegt bei \`${Date.now() - message.createdTimestamp}ms\`\nDer API Ping liegt bei \`${bot.ws.ping}ms\``
        //})
    }
}