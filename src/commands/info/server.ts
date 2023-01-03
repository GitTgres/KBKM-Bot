import { Command } from "../../structures/Command";
import child from "child_process";
import { MessageAttachment, MessageEmbed } from "discord.js";
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
                                value: `kbkm-${filteredInfos.at(0)}.duckdns.org`,
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

                    //When all servers are running -> show embed with different color and thumbnail
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
                const serverType = interaction.options.getString('typ');
                const serverLocation = interaction.options.getString('standort');
                let status;
                //const status = (await exec(`/home/tobi/go/bin/hcloud server describe -o format={{.Status}} ${serverType}`)).stdout.replace('\n','');
                try 
                {
                    let status = await exec(`/home/tobi/go/bin/hcloud server describe -o format={{.Status}} ${serverType}`);  
                    status = status; 
                } catch (error) {
                    console.error(error);
                    status = error;
                }
                if (status != null && status.stderr.includes("server not found")) 
                {

                    console.log("Server konnte nicht gefunden werden!!!!!!!!!");
                    //create new server
                    const res = spawn('ansible-playbook', ['create_server.yml', '-e', `type=${serverType}`, '-e', `location=${serverLocation}`], {cwd: '/home/tobi/Watch2GetherBot/hetzner_server_management/create_server'})
                    
                    res.stdout.pipe(process.stdout)
                    //logging in discord
                    /*
                    let log = "";
                    res.stdout.on('data', (data: string) => {
                        if ((log + data).length > 1900) {
                            log = "";
                            log = log + data
                        }else{
                            log = log + data
                        }
                        interaction.editReply(`\`\`\`${log}\`\`\``);
                    });*/
                    if (serverType === 'vpn') 
                    {
                        res.on("close", code => {
                            const child = spawn('qrencode', ['-t', 'png', '-r', 'wg.conf', '-o', 'wg.png'], {cwd: '/home/tobi/Desktop/wireguard'});
                            child.on("close", code => {
                                const attachment = new MessageAttachment("/home/tobi/Desktop/wireguard/wg.png")
                                const msgEmbed = new MessageEmbed()
                                    .setTitle('QR-Code für Wireguard App')
                                    .setColor('#0x62ff00')
                                    .setImage("attachment://wg.png");

                                    let standort = serverLocation;
                                
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
                                        name: "Status",
                                        value: "running",
                                        inline: true
                                    },
                                    {
                                        name: "Standort",
                                        value: `${standort}`,
                                        inline: true
                                    },
                                ])
                                
                                interaction.followUp({embeds: [msgEmbed], files: [attachment, "/home/tobi/Desktop/wireguard/wg.conf"]});
                            })
                        })   
                    }
                }
                else
                {
                    console.log('Der Server läuft schon ♾️')
                    //interaction.followUp('Der Server läuft schon ♾️');
                    if (serverType === 'vpn') 
                    {

                        const attachment = new MessageAttachment("/home/tobi/Desktop/wireguard/wg.png")
                        const msgEmbed = new MessageEmbed()
                            .setTitle('QR-Code für Wireguard App')
                            .setColor('#0x62ff00')
                            .setFooter({
                                text: "Ein VPN Server existiert bereits.\nDie Erstellung eines weiteren VPN Servers ist nicht zulässig."
                            })
                            
                            .setImage("attachment://wg.png");


                        const serverInfo = (await exec(`/home/tobi/go/bin/hcloud server list -o columns=name,status,location -o noheader`)).stdout.split("\n");
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


                        interaction.followUp({embeds: [msgEmbed], files: [attachment, "/home/tobi/Desktop/wireguard/wg.conf"]});   
                    }
                }
                        //res.stderr.on('data', (data) => {
                        //    console.log(chalk.red(`child stderr:\n${data}`));
                        //});
                break;
            default:
                break;
        }
        global.botAvailable = true;
    }
});
