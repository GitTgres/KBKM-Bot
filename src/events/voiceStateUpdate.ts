import { MessageEmbed, TextChannel } from "discord.js";
import { client } from "..";
import { Event } from "../structures/Event";

export default new Event("voiceStateUpdate", (_oldState, newState) => {
    
    //newState.id is the id of the member who joins a channel
    if (newState.id === "386465125801918465" && newState.channelId != null) 
    {   
        console.log("Samuel ist da"); 
        const channel = client.channels.cache.get("941026117001834496") as TextChannel; //this id is the id of the text channel where the file should be send in
        channel.send({files: ["https://c.tenor.com/5nugwNS3ZFQAAAAC/samuel-sam.gif"]});
    }

    global.botAvailable = true;
});