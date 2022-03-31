import { Command } from "../../structures/Command";
import { MessageEmbed } from "discord.js";
import puppeteer = require('puppeteer');

const sleep = (delay: number) => new Promise ((resolve) => setTimeout(resolve, delay));

async function insertPlaylist(page: puppeteer.Page, playlistLink: string) 
{
    await page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
      });

    await page.waitForSelector('#search-bar-input');

    await page.type('#search-bar-input',`${playlistLink}`);

    await page.waitForSelector('#search-bar-form > div > button');

    await page.click('#search-bar-form > div > button');

    await page.waitForSelector('#w2g-search-results > div.w2g-pl-import-button > div');
    await sleep(2000);

    await page.click('#w2g-search-results > div.w2g-pl-import-button > div');
}

export default new Command({
    name: "w2g",
    description: "Antwortet mit einem Watch2Gether Link",
    run: async ({ interaction }) => {

        const start = Date.now();

        const playlistTitle = interaction.options.getString('playlist');
        console.log(`Playlist Titel: ${playlistTitle}`);

        try 
        {
        //const browser = await puppeteer.launch({"headless": true, args: ['--disable-dev-shm-usage', '--no-sandbox', '--disable-gpu']});
        //const browser = await puppeteer.launch({"headless": false, executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe', args: ['--disable-dev-shm-usage', '--no-sandbox', '--disable-gpu']});
        const browser = await puppeteer.launch({"headless": true, executablePath: '/usr/bin/google-chrome', args: ['--disable-dev-shm-usage', '--no-sandbox', '--disable-gpu']});
        
        const page = await browser.newPage();

        await page.goto("https://w2g.tv/?lang=de");
        //await page.goto("https://google.de");

        await page.waitForSelector('#qc-cmp2-ui > div.qc-cmp2-footer.qc-cmp2-footer-overlay.qc-cmp2-footer-scrolled > div > button.css-k8o10q');

        await page.click('#qc-cmp2-ui > div.qc-cmp2-footer.qc-cmp2-footer-overlay.qc-cmp2-footer-scrolled > div > button.css-k8o10q');
        
        await page.click('#create_room_button');
    
        await page.waitForSelector('#intro-modal', {visible: true, hidden: false});
        
        await page.click('#intro-modal > div.actions > div');

        await page.waitForFunction("document.querySelector('#w2g-top-inviteurl > input[type=text]').value != ''");

        var link: string = await page.$eval<string>('#w2g-top-inviteurl > input[type=text]', (el: HTMLInputElement) => el.value);
        console.log(`Der Link ist: ${link}`);

        const totalTime = Date.now() - start;
        console.log('Link abgeholt in: ', totalTime);

        //create new message with the w2g link
        const msgEmbed = new MessageEmbed()
        .setColor('#0099ff')
        //.setTimestamp()
        .setTitle('Hier ein neuer Watch2Gether Link')
        .setURL(`${link}`)
        .setDescription(`${link}\nDer Link wurde abgeholt in: ${totalTime}ms`)
        .setThumbnail('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.discordapp.net%2Favatars%2F745313401739149364%2Fc9558a888a4a293312bd979fce360425.png%3Fsize%3D512&f=1&nofb=1')
        //.setThumbnail('https://media1.tenor.com/images/d5a2e3786faa13b1fdb8b27c28d496ee/tenor.gif?itemid=14327746')
        //.setThumbnail('https://www.omega-level.net/wp-content/uploads/2015/02/gasp.gif')
        //.setThumbnail('https://c.tenor.com/arkHcMTi6rgAAAAC/the-office-interested.gif')
        //.addField(`Der Link wurde ausgeliefert in: `, `${totalTime}ms`)

        interaction.followUp({embeds: [msgEmbed]});

        if (playlistTitle !== null) 
        {
            switch (playlistTitle) 
            {
                case "mario":
                    await insertPlaylist(page, 'https://www.youtube.com/watch?v=LMuFA_XBtWk&list=PLTY-fHX-ZIGwdsXnDUPhGYLkhvH9TmtXD&index=3&ab_channel=DavidBosch');
                    await browser.close(); 
                    break;
                case "spider-man":
                    await insertPlaylist(page, 'https://www.youtube.com/watch?v=Y88LVU7MAe4&list=PLOWDZJe5wh3j2HkdsxNe7yDeZrow5XRsD');
                    await browser.close();
                    break;
                case "80s":
                    await insertPlaylist(page, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLCD0445C57F2B7F41&ab_channel=RickAstley');
                    await browser.close();
                    break;
            }
        }
        else
        {
            await browser.close(); 
        } 
        
        } 
        catch (error) 
        {
            console.error(error);

            //Error message
            const msgEmbed = new MessageEmbed()
            .setColor('#0xff0000')
            //.setTimestamp()
            .setTitle('Der Watch2Gether Link konnte nicht abgeholt werden')
            .setDescription(error.message)
            //.setThumbnail('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.discordapp.net%2Favatars%2F745313401739149364%2Fc9558a888a4a293312bd979fce360425.png%3Fsize%3D512&f=1&nofb=1')
            .setThumbnail('https://c.tenor.com/Qq-mR0Livi0AAAAC/angry-stadium-man-stadium.gif')
            //.setThumbnail('https://www.omega-level.net/wp-content/uploads/2015/02/gasp.gif')
            //.addField(`Der Link wurde ausgeliefert in: `, `${totalTime}ms`)

            interaction.followUp({embeds: [msgEmbed]});
        }
        global.botAvailable = true;
    }
});