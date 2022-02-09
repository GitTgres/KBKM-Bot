const { Client, Intents, Collection } = require('discord.js');

const bot = new Client({
    restTimeOffset: 0,
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_PRESENCES
    ]
})

const { readdirSync } = require('fs');
const config = require('./config.json');

bot.commands = new Collection();
const dir = readdirSync('./handlers/commands').filter(file => file.endsWith('.js'));

for(const file of dir) {
    const command = require(`./handlers/commands/${file}`);

    bot.commands.set(command.name, command);
}

bot.on('ready', async message =>{
    console.log(`Der Bot ist nun eingeloggt! Name: ${bot.user.tag}`);

    bot.user.setPresence({
        activities: [{
            name: 'W2G',
            type: 'WATCHING'
        }],
        status: 'online'
    })
})

bot.on('messageCreate', async message => {
    let parts = message.content.split(/ +/);
    if(message.channel.type == 'DM') return;
    //if (message.author.bot) return;

    let cmd = message.content.slice(config.prefix.length).trim().split(/ +/).shift().toLowerCase();
    let comm = bot.commands.get(cmd) || bot.commands.find(a => a.aliases && a.aliases.includes(cmd));

    if (comm) 
    {
        if (!message.content.startsWith(config.prefix)) return;  
        comm.execute(bot, message, parts, config.prefix);

    }
    else 
    {
        if (message.content.startsWith(config.prefix)) 
        {
            message.reply({ content: `Dieser Befehl existiert nicht!`});   
        }
    }
});

bot.login(config.token);