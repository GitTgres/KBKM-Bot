# KBKM Bot 
Discord bot, which uses ansible to create a Minecraft server or a VPN server on https://www.hetzner.com/cloud. It can also generate a link for Watch2Gether by using the node library puppeteer.

Based on the two parameters location and type, the bot creates for example your VPN server in Ashburn 🇺🇸 :

https://user-images.githubusercontent.com/39748835/211038307-16def645-26ae-4c3a-bb48-1a74d7eff3bf.mp4


The Watch2Gether link generator comes in handy if you are in a discord voice channel with your friends and you want to get a new W2G link quickly:

https://user-images.githubusercontent.com/39748835/211038844-be6491f8-4ea9-425c-a6ee-7615261126bc.mp4



## Start bot

You can start your container with the following command: (Fill in your credential at the respective "<>" position) 

```
docker run --name kbkm-bot -e DISCORD_BOT_TOKEN=<> -e GUILD_ID=<> -e HCLOUD_TOKEN=<> -e DUCKDNS_TOKEN=<> -e DUCKDNS_DOMAIN_VPN=<> -e DUCKDNS_DOMAIN_MINECRAFT=<> -d ghcr.io/gittgres/kbkm-bot:latest
```
Information for credentials:
- DISCORD_BOT_TOKEN -> Go to [Discord Developer Portal](https://discord.com/developers/applications) and create a new application. In the setting 'Bot' you can find your Bot token
- GUILD_ID -> Right-click on the server, where the bot should run and than click on 'copy id'
- HCLOUD_TOKEN -> Go to [Hetzner Cloud Console](https://console.hetzner.cloud/projects) and create a new project. In the setting 'security' create a new api-token
- DUCKDNS_TOKEN -> Go to [Duck DNS](https://www.duckdns.org/) and copy the 'token' from the dashboard
- DUCKDNS_DOMAIN_VPN -> Create a subdomain for your vpn server and copy it (Only copy the subdomain!!!)
- DUCKDNS_DOMAIN_MINECRAFT -> Create a subdomain for your minecraft server and copy it (Only copy the subdomain!!!)
