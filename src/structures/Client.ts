import {
    ApplicationCommandDataResolvable,
    Client,
    ClientEvents,
    Collection,
    Constants
} from "discord.js";
import { CommandType } from "../typings/Command";
import glob from "glob";
import { promisify } from "util";
import { RegisterCommandsOptions } from "../typings/client";
import { Event } from "./Event";

const globPromise = promisify(glob);

export class ExtendedClient extends Client {
    commands: Collection<string, CommandType> = new Collection();

    constructor() {
        super({ intents: 32767 });
    }

    start() {
        this.registerModules();
        this.login(process.env.DISCORD_BOT_TOKEN);
    }
    async importFile(filePath: string) {
        return (await import(filePath))?.default;
    }

    async registerCommands({ commands, guildId }: RegisterCommandsOptions) {
        
        //if you want that your bot uses the slash commands in a global scope, you have to replace 
        //this.guilds.cache.get(guildId)? with this.application?

        commands.forEach(async (command: CommandType) =>{
            switch (command.name) 
            {
                case "w2g":
                    this.guilds.cache.get(guildId)?.commands.create(
                        {
                        name: command.name,
                        description: command.description,
                        default_permission: false,
                        options: [
                            {
                                name: 'hidden',
                                description: 'Der Watch2Gether Link wird nur dir angezeigt',
                                required: false,
                                type: Constants.ApplicationCommandOptionTypes.STRING,
                                choices: [
                                    {
                                        name: "true",
                                        value: "true"
                                    },
                                ]
                            }
                        ]
                    })
                    break;
                case "server":
                    this.guilds.cache.get(guildId)?.commands.create({
                        name: command.name,
                        description: command.description,
                        options: [
                            {
                                name: 'info',
                                description: 'Gibt Infos über den Server aus',
                                type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
                                options: [
                                    {
                                        name: 'hidden',
                                        description: 'Die Infos über den Server werden nur dir angezeigt',
                                        required: false,
                                        type: Constants.ApplicationCommandOptionTypes.STRING,
                                        choices: [
                                            {
                                                name: "true",
                                                value: "true"
                                            },
                                        ]
                                    }
                                ]
                            },
                            {
                                name: 'start',
                                description: 'Startet den Server',
                                type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
                                options: [
                                    {
                                        name: "standort",
                                        description: "Standort des Servers",
                                        required: true,
                                        type: Constants.ApplicationCommandOptionTypes.STRING,
                                        choices: [
                                            {
                                                name: `🇩🇪 Falkenstein`,
                                                value: "fsn1"
                                            },
                                            {
                                                name: "🇩🇪 Nürnberg",
                                                value: "nbg1"
                                            },
                                            {
                                                name: "🇫🇮 Helsinki",
                                                value: "helsinki1"
                                            },
                                            {
                                                name: "🇺🇸 Ashburn",
                                                value: "ash"
                                            },
                                            {
                                                name: "🇺🇸 Hillsboro",
                                                value: "hil"
                                            }
                                        ]
                                    },
                                    {
                                        name: "typ",
                                        description: "Typ des Servers",
                                        required: true,
                                        type: Constants.ApplicationCommandOptionTypes.STRING,
                                        choices: [
                                            {
                                                name: `Minecraft Server`,
                                                value: "minecraft"
                                            },
                                            {
                                                name: "VPN",
                                                value: "vpn"
                                            }
                                        ]
                                    },
                                    {
                                        name: 'hidden',
                                        description: 'Nur dir wird angezeigt, dass der Server gestartet wird',
                                        required: false,
                                        type: Constants.ApplicationCommandOptionTypes.STRING,
                                        choices: [
                                            {
                                                name: "true",
                                                value: "true"
                                            },
                                        ]
                                    }
                                ]
                            }
                        ]
                    });
            }
        });
        console.log(`Registering commands to ${guildId}`);
        
    }

    async registerModules() {
        // Commands
        const slashCommands: ApplicationCommandDataResolvable[] = [];
        const commandFiles = await globPromise(
            `${__dirname}/../commands/*/*{.ts,.js}`
        );
        commandFiles.forEach(async (filePath) => {
            const command: CommandType = await this.importFile(filePath);
            if (!command.name) return;
            console.log(command);

            this.commands.set(command.name, command);
            slashCommands.push(command);
        });

        this.on("ready", () => {
            this.registerCommands({
                commands: slashCommands,
                guildId: process.env.GUILD_ID
            });
        });

        // Event
        const eventFiles = await globPromise(
            `${__dirname}/../events/*{.ts,.js}`
        );
        eventFiles.forEach(async (filePath) => {
            const event: Event<keyof ClientEvents> = await this.importFile(
                filePath
            );
            this.on(event.event, event.run);
        });
    }
}