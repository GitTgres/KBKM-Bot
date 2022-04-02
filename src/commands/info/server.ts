import { Command } from "../../structures/Command";
import child from "child_process";
import { MessageEmbed } from "discord.js";
import util from 'util';
const exec = util.promisify(child.exec);
import { spawn } from 'child_process';
import chalk from "chalk";

export default new Command({
    name: "server",
    description: "Ermöglicht die Kontrolle über einen Server",
    run: async ({ interaction }) => {
    
        switch (interaction.options.getSubcommand()) 
        {
            case "info":
                try 
                {
                    const serverInfo = (await exec(`/home/tobi/go/bin/hcloud server list MinecraftServer -o columns=ipv4,status,location -o noheader`)).stdout.split("   ");
                    console.log(serverInfo);

                    let standort = serverInfo.at(2).replace('\n','');
                    if (standort.includes('nbg')) 
                    {
                        standort = '🇩🇪 Nürnberg'
                    }
                    else if (standort.includes('fsn'))
                    {
                        standort = '🇩🇪 Falkenstein'
                    }
                    else if (standort.includes('hel'))
                    {
                        standort = '🇫🇮 Helsinki'
                    }
                    else if (standort.includes('ash'))
                    {
                        standort = '🇺🇸 Ashburn'
                    }

                    
                    const msgEmbed = new MessageEmbed()
                    .setTitle('Hier die Infos über den Server')
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
                            value: `${standort}`,
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
                    interaction.followUp(`${error.message} ❌`);
                }
                break;
            case "start":
                try 
                {
                    const status = (await exec(`/home/tobi/go/bin/hcloud server list MinecraftServer -o columns=status -o noheader`)).stdout.replace('\n','');
                    if (status === 'running') {
                        console.log('Der Server läuft schon ♾️')
                        interaction.followUp('Der Server läuft schon ♾️');
                    }
                    else
                    {
                        const res = spawn('ansible-playbook', ['run.yml'], {cwd: '/home/tobi/Watch2GetherBot/hetzner_server_management'})
                    
                        res.stdout.pipe(process.stdout)
                        let log = "";
                        res.stdout.on('data', (data: string) => {
                            log = log + data
                            interaction.editReply(`\`\`\`${log}\`\`\``);
                        });

                        res.stderr.on('data', (data) => {
                            console.log(chalk.red(`child stderr:\n${data}`));
                        });
                    } 
                }    
                catch (error) 
                {
                    console.error(error);
                    interaction.followUp(`${error.message} ❌`);
                } 
                break;
            default:
                break;
        }
        global.botAvailable = true;
    }
});