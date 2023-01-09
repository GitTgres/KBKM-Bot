# KBKM Bot 
Discord bot, which uses ansible to create a Minecraft server or a VPN server on https://www.hetzner.com/cloud. It can also generate a link for Watch2Gether by using the node library puppeteer.

Based on the two parameters location and type, the bot creates for example your VPN server in Ashburn 🇺🇸 :

https://user-images.githubusercontent.com/39748835/211038307-16def645-26ae-4c3a-bb48-1a74d7eff3bf.mp4


The Watch2Gether link generator comes in handy if you are in a discord voice channel with your friends and you want to get a new W2G link quickly:

https://user-images.githubusercontent.com/39748835/211038844-be6491f8-4ea9-425c-a6ee-7615261126bc.mp4


Useful links:

- https://github.com/hetznercloud/hcloud-python/issues/139
- https://pypi.org/project/hcloud/
- https://www.redhat.com/sysadmin/python-venv-ansible
- https://www.digitalocean.com/community/tutorials/how-to-install-go-on-ubuntu-20-04
- https://github.com/ansible-collections/hetzner.hcloud
- https://www.redhat.com/sysadmin/extra-variables-ansible-playbook
- https://stackoverflow.com/questions/48514072/how-to-automatically-pass-vault-password-when-running-ansible-playbook
- https://www.duckdns.org/install.jsp?tab=linux-cron
- https://www.shellhacks.com/disable-ssh-host-key-checking/
- https://github.com/githubixx/ansible-role-wireguard
- https://github.com/ansible-collections/hetzner.hcloud/issues/94

Quick setup:

- git clone https://github.com/GitTgres/Watch2GetherBot.git
- npm init
- npm install
- create a .env file with botToken, guildId and environment
- create a shell script, which updates the ip address in your duckdns dashboard
- npm run start:dev

## Docker

- docker build -t tobdocker/kbkm-bot:1.0 .
- docker run --name kbkm-bot -e botToken=<> -e guildId=<> -e hetznerToken=<> -d tobdocker/kbkm-bot:1.0
