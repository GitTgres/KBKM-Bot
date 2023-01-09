FROM node:slim AS app

# We don't need the standalone Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Install Google Chrome Stable and fonts
# Note: this installs the necessary libs to make the browser work with Puppeteer.
RUN apt-get update && apt-get install gnupg wget -y && \
  wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
  sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
  apt-get update && \
  apt-get install google-chrome-stable -y --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*

# Install required dependencies for the bot
RUN apt update; \ 
    apt install -y python3-pip; \
    pip3 install --upgrade pip; \
    pip3 install ansible==7.1.0; \
    pip3 install hcloud==1.18.2; \
    apt-get install qrencode -y; \
    apt-get install openssh-server -y; \
    apt-get install curl -y; \
    apt install -y wireguard

WORKDIR /usr/src/KBKM-Bot

RUN mkdir -p /usr/src/KBKM-Bot/wireguard
RUN mkdir -p /usr/src/.ssh

COPY package*.json ./
COPY kbkm-vpn /root/.ssh/
COPY kbkm-minecraft /root/.ssh/
COPY kbkm-vpn.pub /root/.ssh/
COPY kbkm-minecraft.pub /root/.ssh/
COPY ssh_config /etc/ssh/

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "run", "start:prod"]