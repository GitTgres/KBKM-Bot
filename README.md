# KBKM Bot 
Discord bot, which uses ansible to create a Minecraft server or a VPN server on https://www.hetzner.com/cloud. It can also generate a link for Watch2Gether by using the node library puppeteer.

Based on the two parameters location and type, the bot creates for example your VPN server in Hillsboro 🇺🇸 :

https://user-images.githubusercontent.com/39748835/212809081-ddd29d85-9676-4057-8b2e-389dd5594b86.MP4

Or a minecraft server in Nürnberg 🇩🇪 :

https://user-images.githubusercontent.com/39748835/212809298-f1da0f91-7614-4a7f-afda-9d2028826938.mp4

If you want to get information about the servers, which currently run, you can type in the info command:

https://user-images.githubusercontent.com/39748835/212809680-1dc8e61d-6340-405b-bd53-306d10a5f7bc.mp4

The Watch2Gether link generator comes in handy if you are in a discord voice channel and you want to get a new W2G link quickly:

https://user-images.githubusercontent.com/39748835/212809730-4fca4ae8-069f-400f-9cbb-c222a4342278.mp4

## Start bot

You can start your container with the following command: (Fill in your credential at the respective "<>" position) 

```
docker run --name kbkm-bot -e DISCORD_BOT_TOKEN=<> -e GUILD_ID=<> -e HCLOUD_TOKEN=<> -e DUCKDNS_TOKEN=<> -e DUCKDNS_DOMAIN_VPN=<> -e DUCKDNS_DOMAIN_MINECRAFT=<> -d ghcr.io/gittgres/kbkm-bot:latest
```
How to fill out your credentials:
- DISCORD_BOT_TOKEN -> Go to [Discord Developer Portal](https://discord.com/developers/applications) and create a new application. In the setting ``Bot`` you can find your Bot token
- GUILD_ID -> Right-click on the server, where the bot should run and than click on ``copy id``
- HCLOUD_TOKEN -> Go to [Hetzner Cloud Console](https://console.hetzner.cloud/projects) and create a new project. In the setting ``security`` create a new api-token
- DUCKDNS_TOKEN -> Go to [Duck DNS](https://www.duckdns.org/) and copy the ``token`` from the dashboard
- DUCKDNS_DOMAIN_VPN -> Create a subdomain for your vpn server and copy it (Only copy the subdomain!!!)
- DUCKDNS_DOMAIN_MINECRAFT -> Create a subdomain for your minecraft server and copy it (Only copy the subdomain!!!)

## Available Commands

This bot provides the following commands:

- ``/w2g`` generates a Watch2Gether link
- ``/server info`` gives you the server address, server status and server location
- ``/server start type=<vpn, minecraft> location=<Ashburn 🇺🇸, Hillsboro 🇺🇸, Falkenstein 🇩🇪, Nürnberg 🇩🇪, Helsinki 🇫🇮>`` creates a server in the respective location and configures the server according to the type

Every command has the optional parameter ``hidden=true``. When you specify it, the result of the command is only shown to you.
