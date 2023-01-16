import { Command } from "../../structures/Command";
import child from "child_process";
import { MessageAttachment, MessageEmbed } from "discord.js";
import util from 'util';
const exec = util.promisify(child.exec);
import { spawn } from 'child_process';
import chalk from "chalk";

export default new Command({
    name: "server",
    description: "Makes it possible to control a server on hetzner.cloud",
    run: async ({ interaction }) => {
        switch (interaction.options.getSubcommand())
        {
            case "info":
                try
                {
                    //const serverType = interaction.options.getString('typ');
                    const serverInfo = (await exec(`/root/go/bin/hcloud server list -o columns=name,status,location -o noheader`)).stdout.split("\n");

                    const msgEmbed = new MessageEmbed()
                    .setTitle('Server information');

                    serverInfo.forEach((server) => {
                        if (server === '') return;
                        const info = server.split("   ");
                        const filteredInfos = info.filter(function (el) {
                            return el != '';
                        });

                        let domain = filteredInfos.at(0);
                        let port = filteredInfos.at(0);
                        if (port === "vpn") {
                            port = "51820";
                            domain = process.env.DUCKDNS_DOMAIN_VPN
                        }
                        else if (port === "minecraft")
                        {
                            port = "25565";
                            domain = process.env.DUCKDNS_DOMAIN_MINECRAFT
                        }

                        let location = filteredInfos.at(2);
                        if (location.includes('nbg'))
                        {
                            location = '🇩🇪 Nürnberg'
                        }
                        else if (location.includes('fsn'))
                        {
                            location = '🇩🇪 Falkenstein'
                        }
                        else if (location.includes('hel'))
                        {
                            location = '🇫🇮 Helsinki'
                        }
                        else if (location.includes('ash'))
                        {
                            location = '🇺🇸 Ashburn'
                        }
                        else if (location.includes('hil'))
                        {
                            location = '🇺🇸 Hillsboro'
                        }

                        msgEmbed.addFields([
                            {
                                name: "server address",
                                value: `${domain}.duckdns.org:${port}`,
                                inline: true
                            },
                            {
                                name: "status",
                                value: filteredInfos.at(1),
                                inline: true
                            },
                            {
                                name: "location",
                                value: `${location}`,
                                inline: true
                            },
                        ])

                    });

                    //When all servers are running -> show embed with different color and thumbnail
                    if (serverInfo[0] == "")
                    {
                        msgEmbed
                        .setColor('#0xff0000')
                        .setDescription("No server is online.")
                        .setThumbnail('https://c.tenor.com/Qq-mR0Livi0AAAAC/angry-stadium-man-stadium.gif');

                        interaction.followUp({embeds: [msgEmbed]});
                    }
                    else
                    {
                        msgEmbed
                        .setColor('#0x62ff00');

                        interaction.followUp({embeds: [msgEmbed]});
                    }

                }
                catch (error)
                {
                    console.error(error);
                    interaction.followUp(`${error.message} ❌`);
                }
                break;
            case "start":
                const serverType = interaction.options.getString('type');
                const serverLocation = interaction.options.getString('location');

                //create new server
                const res = spawn('ansible-playbook', ['create_server.yml', '-e', `type=${serverType}`, '-e', `location=${serverLocation}`], {cwd: '/root/hetzner_server_management/create_server'})

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
                                .setTitle('QR code for WireGuard App')
                                .setColor('#0x62ff00')
                                .setImage("attachment://wg.png");

                                let location = serverLocation;

                                if (location.includes('nbg'))
                                {
                                    location = '🇩🇪 Nürnberg'
                                }
                                else if (location.includes('fsn'))
                                {
                                    location = '🇩🇪 Falkenstein'
                                }
                                else if (location.includes('hel'))
                                {
                                    location = '🇫🇮 Helsinki'
                                }
                                else if (location.includes('ash'))
                                {
                                    location = '🇺🇸 Ashburn'
                                }
                                else if (location.includes('hil'))
                                {
                                    location = '🇺🇸 Hillsboro'
                                }

                            msgEmbed.addFields([
                                {
                                    name: "status",
                                    value: "running",
                                    inline: true
                                },
                                {
                                    name: "location",
                                    value: `${location}`,
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
                        console.log(`Minecraft server created. Available at: ${process.env.DUCKDNS_DOMAIN_MINECRAFT}.duckdns.org:25565`);
                        interaction.followUp(`Minecraft server erstellt. Available at: ${process.env.DUCKDNS_DOMAIN_MINECRAFT}.duckdns.org:25565`);
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
