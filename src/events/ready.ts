import { client } from "..";
import { Event } from "../structures/Event";

export default new Event("ready", () => {
    console.log(`Bot is logged in! Name: ${client.user.tag}`);
    global.botAvailable = true;
});