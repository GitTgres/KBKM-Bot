import { client } from "..";
import { Event } from "../structures/Event";

export default new Event("ready", () => {
    console.log(`Der Bot ist nun eingeloggt! Name: ${client.user.tag}`);
    global.botAvailable = true;
});