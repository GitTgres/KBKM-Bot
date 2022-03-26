import { Command } from "../../structures/Command";
import child from "child_process";
import { MessageEmbed } from "discord.js";
import util from 'util';
const exec = util.promisify(child.exec);

export default new Command({
    name: "mc-server",
    description: "Ermöglicht die Kontrolle über einen Minecraft Server",
    run: async ({ interaction }) => {
    
        switch (interaction.options.getSubcommand()) 
        {
            case "info":
                try 
                {
                    const serverInfo = (await exec(`hcloud server list MinecraftServer -o columns=ipv4,status,location -o noheader`)).stdout.split("   ");
                    console.log(serverInfo);

                    let standort = serverInfo.at(2).replace('\n','');
                    if (standort.includes('nbg')) 
                    {
                        standort = 'Nürnberg'
                    }

                    
                    const msgEmbed = new MessageEmbed()
                    .setTitle('Hier die Infos über den Minecraft Server')
                    .addFields([
                        {
                            name: "Serveradresse",
                            value: `${serverInfo.at(0)}:25565`,
                            inline: true
                        },
                        {
                            name: "Status",
                            value: serverInfo.at(1),
                            inline: true
                        },
                        {
                            name: "Standort",
                            value: `🇩🇪 ${standort}`,
                            inline: true
                        },
                    ])

                    //When server is running show embed with different color and thumbnail
                    if (serverInfo.at(1) === "running") 
                    {
                        msgEmbed
                        .setColor('#0x62ff00')
                        .setThumbnail('https://media1.tenor.com/images/d5a2e3786faa13b1fdb8b27c28d496ee/tenor.gif?itemid=14327746')
                    }
                    else
                    {
                        msgEmbed
                        .setColor('#0xff0000')
                        .setThumbnail('https://c.tenor.com/Qq-mR0Livi0AAAAC/angry-stadium-man-stadium.gif')
                    }

                    interaction.followUp({embeds: [msgEmbed]});
                } 
                catch (error) 
                {
                    console.error(error);
                    interaction.followUp(`${error.message}`);
                }
                break;
            case "start":
                try 
                {
                    const status = (await exec(`hcloud server list MinecraftServer -o columns=status -o noheader`)).stdout.replace('\n','');
                    if (status === 'running') {
                        interaction.followUp('Der Server läuft schon ♾️');
                    }
                    else
                    {
                        const powerStatus = await exec(`hcloud server poweron MinecraftServer`);
                        console.log(powerStatus.stdout); 
                        if (powerStatus.stdout.includes('started')) 
                        {
                            interaction.followUp(`Server wurde gestartet ✅`); 
                        }    
                    } 
                }    
                catch (error) 
                {
                    console.error(error);
                    interaction.followUp(`${error.message}`);
                } 
                break;
            default:
                break;
        }
    }
});