import { Command } from "../../structures/Command";
import { MessageEmbed } from "discord.js";
import puppeteer = require('puppeteer');

export default new Command({
    name: "w2g",
    description: "Antwortet mit einem Watch2Gether Link",
    run: async ({ interaction }) => {

        const start = Date.now();

        const playlistTitle = interaction.options.getString('playlist');
        console.log(`Playlist Titel: ${playlistTitle}`);

        try 
        {
        const browser = await puppeteer.launch({"headless": true, args: ['--disable-dev-shm-usage', '--no-sandbox', '--disable-gpu']});
        //const browser = await puppeteer.launch({"headless": false, executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe', args: ['--disable-dev-shm-usage', '--no-sandbox', '--disable-gpu']});
        
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

        

        await browser.close();    
        } 
        catch (error) 
        {
            console.error(error);
        }

        const totalTime = Date.now() - start;
        console.log('Link ausgeliefert in: ', totalTime);

        //create new message with the w2g link
        const msgEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setTimestamp()
        .setTitle('Hier ein neuer Watch2Gether Link')
        .setURL(`${link}`)
        .setDescription(`${link}`)
        .setThumbnail('https://media1.tenor.com/images/d5a2e3786faa13b1fdb8b27c28d496ee/tenor.gif?itemid=14327746')
        //.setThumbnail('https://www.omega-level.net/wp-content/uploads/2015/02/gasp.gif')
        .addField(`Der Link wurde ausgeliefert in: `, `${totalTime}ms`)

        interaction.followUp({embeds: [msgEmbed]});


    }
});