import { Command } from "../../structures/Command";
import { MessageEmbed } from "discord.js";
import puppeteer = require('puppeteer');

export default new Command({
    name: "w2g",
    description: "Responds with a Watch2Gether link",
    run: async ({ interaction }) => {

        const start = Date.now();

        try
        {
        //const browser = await puppeteer.launch({"headless": true, args: ['--disable-dev-shm-usage', '--no-sandbox', '--disable-gpu']});
        //const browser = await puppeteer.launch({"headless": false, executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe', args: ['--disable-dev-shm-usage', '--no-sandbox', '--disable-gpu']});
        const browser = await puppeteer.launch({"headless": true, executablePath: '/usr/bin/google-chrome', args: ['--disable-dev-shm-usage', '--no-sandbox', '--disable-gpu']});

        const page = await browser.newPage();

        page.goto("https://w2g.tv/en/");

        await page.waitForSelector('#qc-cmp2-ui > div.qc-cmp2-footer.qc-cmp2-footer-overlay.qc-cmp2-footer-scrolled > div > button:nth-child(2)');

        await page.click('#qc-cmp2-ui > div.qc-cmp2-footer.qc-cmp2-footer-overlay.qc-cmp2-footer-scrolled > div > button:nth-child(2)');

        await page.waitForSelector('.bg-w2g-yellow');

        await page.click('.bg-w2g-yellow');

        await page.waitForSelector('#intro-modal', {visible: true, hidden: false});

        await page.click('.positive');

        await page.waitForFunction("document.querySelector('#w2g-top-inviteurl > input[type=text]').value != ''");

        var link: string = await page.$eval<string>('#w2g-top-inviteurl > input[type=text]', (el: HTMLInputElement) => el.value);
        console.log(`The link is: ${link}`);

        const totalTime = Date.now() - start;
        console.log('Link generated in: ', totalTime);

        //create new message with the w2g link
        const msgEmbed = new MessageEmbed()
        .setColor('#0099ff')
        //.setTimestamp()
        .setTitle('Here a new Watch2Gether link')
        .setURL(`${link}`)
        .setDescription(`${link}\nThe link was generated in: ${totalTime}ms`)
        .setThumbnail('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.discordapp.net%2Favatars%2F745313401739149364%2Fc9558a888a4a293312bd979fce360425.png%3Fsize%3D512&f=1&nofb=1')
        //.setThumbnail('https://media1.tenor.com/images/d5a2e3786faa13b1fdb8b27c28d496ee/tenor.gif?itemid=14327746')
        //.setThumbnail('https://www.omega-level.net/wp-content/uploads/2015/02/gasp.gif')
        //.setThumbnail('https://c.tenor.com/arkHcMTi6rgAAAAC/the-office-interested.gif')
        //.addField(`Der Link wurde ausgeliefert in: `, `${totalTime}ms`)

        interaction.followUp({embeds: [msgEmbed]});

        await browser.close();

        }
        catch (error)
        {
            console.error(error);

            //Error message
            const msgEmbed = new MessageEmbed()
            .setColor('#0xff0000')
            //.setTimestamp()
            .setTitle("Couldn't generate a Watch2Gether link")
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