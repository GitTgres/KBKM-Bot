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
                    //const serverType = interaction.options.getString('typ');
                    const serverInfo = (await exec(`/home/tobi/go/bin/hcloud server list -o columns=name,status,location -o noheader`)).stdout.split("\n");

                    const msgEmbed = new MessageEmbed()
                    .setTitle('Server Informationen');

                    serverInfo.forEach((server) => {
                        if (server === '') return;
                        const info = server.split("   ");
                        const filteredInfos = info.filter(function (el) {
                            return el != '';
                        });

                        let standort = filteredInfos.at(2);
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

                        msgEmbed.addFields([
                            {
                                name: "Serveradresse",
                                value: `kbkm-${filteredInfos.at(0)}\@duckdns.org`,
                                inline: true
                            },
                            {
                                name: "Status",
                                value: filteredInfos.at(1),
                                inline: true
                            },
                            {
                                name: "Standort",
                                value: `${standort}`,
                                inline: true
                            },
                        ])

                    });

                    //When all servers arerunning show embed with different color and thumbnail
                    if (serverInfo.join("").includes("off")) 
                    {
                        msgEmbed
                        .setColor('#0xff0000')
                        .setThumbnail('https://c.tenor.com/Qq-mR0Livi0AAAAC/angry-stadium-man-stadium.gif');
                    }
                    else
                    {
                        msgEmbed
                        .setColor('#0x62ff00')
                        .setThumbnail('https://media1.tenor.com/images/d5a2e3786faa13b1fdb8b27c28d496ee/tenor.gif?itemid=14327746');
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
                    const serverType = interaction.options.getString('typ');
                    //Hier noch dran arbeiten
                    const status = (await exec(`/home/tobi/go/bin/hcloud server list ${serverType} -o columns=status -o noheader`)).stdout.replace('\n','');
                    console.log(status);
                    
                    if (status === '') {
                        console.log('Der Server läuft schon ♾️')
                        interaction.followUp('Der Server läuft schon ♾️');
                    }
                    else
                    {
                        const res = spawn('ansible-playbook', ['create_server.yml', '-e', 'type=minecraft', '-e', 'location=fsn1'], {cwd: '/home/tobi/Watch2GetherBot/hetzner_server_management/create_server'})
                    
                        res.stdout.pipe(process.stdout)
                        /* let log = "";
                        res.stdout.on('data', (data: string) => {
                            log = log + data
                            interaction.editReply(`\`\`\`${log}\`\`\``);
                        }); */

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