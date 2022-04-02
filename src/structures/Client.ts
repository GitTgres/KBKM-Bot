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
        this.login(process.env.botToken);
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
                                name: "playlist",
                                description: "Playlist mit welcher gestartet werden soll",
                                required: false,
                                type: Constants.ApplicationCommandOptionTypes.STRING,
                                choices: [
                                    {
                                        name: "mario",
                                        value: "mario"
                                    },
                                    {
                                        name: "spider-man",
                                        value: "spider-man"
                                    },
                                    {
                                        name: "80s",
                                        value: "80s"
                                    },
                                ]
                            },
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
                    //const cmd = await this.guilds.cache.get(guildId)?.commands.fetch()
                    //console.log(cmd)
                    
                    
                    /* this.guilds.cache.get(guildId)?.commands.permissions.add({ command: '956354385192054837', permissions: [
                        {
                            id: '956575646270767164',
                            type: 'ROLE',
                            permission: true
                        }
                    ]});
                    this.guilds.cache.get(guildId)?.commands.permissions.add({ command: '956354385192054837', permissions: [
                        {
                            id: '386465125801918465',
                            type: 'USER',
                            permission: true
                        }
                    ]}); */
                    break;
                case "ping":
                    this.guilds.cache.get(guildId)?.commands.create(
                        {
                        name: command.name,
                        description: command.description
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
                                                value: "fsn1"
                                            },
                                            {
                                                name: "VPN",
                                                value: "nbg1"
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
                guildId: process.env.guildId
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