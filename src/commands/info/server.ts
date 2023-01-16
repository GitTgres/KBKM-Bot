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
                    //const serverInfo = (await exec(`/home/tobi/go/bin/hcloud server list -o columns=name,status,location -o noheader`)).stdout.split("\n");
                    const res = spawn('ansible-playbook', ['get_server_info.yml'], {cwd: '/root/hetzner_server_management/get_server_info'})

                    res.on("close", code => {

                        var simpleBarrier = require('simple-barrier'),
                            fs = require('fs');

                        const msgEmbed = new MessageEmbed()
                        .setTitle('Server Informationen');

                        var barrier = simpleBarrier();

                        fs.readFile('/root/vpn_server_info_log.txt', barrier.waitOn());
                        fs.readFile('/root/minecraft_server_info_log.txt', barrier.waitOn());


                        barrier.endWith(function( results ){
                            let absent_counter = 0;
                            for (let i = 0; i < 2; i++) {
                                const server = results[i];
                                let filteredInfos = server.toString().trim().split(";");
                                console.log(filteredInfos);

                                if (filteredInfos.at(0) === '')
                                {
                                    absent_counter++;
                                    return;
                                }

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
                                else if (standort.includes('hil'))
                                {
                                    standort = '🇺🇸 Hillsboro'
                                }

                                msgEmbed.addFields([
                                    {
                                        name: "Serveradresse",
                                        value: `${filteredInfos.at(0)}.duckdns.org:${filteredInfos.at(3)}`,
                                        inline: true
                                    },
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
                                ]);
                            }

                            //When all servers are not running -> show embed with different color and thumbnail
                            if (absent_counter == 2)
                            {
                                msgEmbed
                                .setColor('#0xff0000')
                                .setDescription("Kein Server ist online.")
                                .setThumbnail('https://c.tenor.com/Qq-mR0Livi0AAAAC/angry-stadium-man-stadium.gif');

                                interaction.followUp({embeds: [msgEmbed]});
                            }
                            else
                            {
                                msgEmbed
                                .setColor('#0x62ff00');

                                interaction.followUp({embeds: [msgEmbed]});
                            }
                        });
                    });
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

                //create new server
                const res = spawn('ansible-playbook', ['create_server.yml', '-e', `type=${serverType}`, '-e', `location=${serverLocation}`], {cwd: '/root/hetzner_server_management/create_server'})
                
                console.log("Starte ansible playbook.");
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
                        const child = spawn('qrencode', ['-t', 'png', '-r', 'wg.conf', '-o', 'wg.png'], {cwd: '/root/wireguard'});
                        child.on("close", code => {
                            const attachment = new MessageAttachment("/root/wireguard/wg.png");
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
                                else if (standort.includes('hil'))
                                {
                                    standort = '🇺🇸 Hillsboro'
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
                            
                            interaction.followUp({embeds: [msgEmbed], files: [attachment, "/root/wireguard/wg.conf"]});
                        })
                    })   
                }
                else if (serverType === 'minecraft')
                {
                    res.on("close", code => {
                        console.log(`Minecraft server fertig. Erreichbar unter: ${process.env.duckdns_domain_minecraft}.duckdns.org:25565`);
                        interaction.followUp(`Minecraft server erstellt. Erreichbar unter: ${process.env.duckdns_domain_minecraft}.duckdns.org:25565`);
                    })
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
