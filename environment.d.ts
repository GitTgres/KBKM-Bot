declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DISCORD_BOT_TOKEN: string;
            GUILD_ID: string;
            environment: "dev" | "prod" | "debug";
        }
    }
}

export {};