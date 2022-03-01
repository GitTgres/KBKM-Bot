const { Client, Message, MessageEmbed } = require("discord.js");

const puppeteer = require('puppeteer');

var progressBar = ['|😁', '😃', '🤨', '😠', '😡'];

var counter = 0;

//Für die Performance gut
const sleep = (delay) => new Promise ((resolve) => setTimeout(resolve, delay));

async function printEmoji(msg, lastElement)
{
    if (lastElement)
    {
        await msg.edit(`${msg.content}` + `${progressBar[counter]}|`);   
    }
    else
    {
        await msg.edit(`${msg.content}` + `${progressBar[counter]}`);   
    }
    if (counter == progressBar.length - 1) return;
    counter++;
    
}

async function getW2GLink()
{
 
    const start = Date.now();

    try 
    {
        const browser = await puppeteer.launch({"headless": true, args: ['--disable-dev-shm-usage', '--no-sandbox', '--disable-gpu']});
        
        const page = await browser.newPage();

        await page.goto("https://w2g.tv/?lang=de");
        //await page.goto("https://google.de");

        await page.waitForSelector('#qc-cmp2-ui > div.qc-cmp2-footer.qc-cmp2-footer-overlay.qc-cmp2-footer-scrolled > div > button.css-k8o10q');

        await page.click('#qc-cmp2-ui > div.qc-cmp2-footer.qc-cmp2-footer-overlay.qc-cmp2-footer-scrolled > div > button.css-k8o10q');
        
        await page.click('#create_room_button');
    
        await page.waitForSelector('#intro-modal > div.content > div', {visible: true, hidden: false});
        
        await page.click('#intro-modal > div.content > div');
        //await page.click('testsdfag');

        await page.waitForFunction("document.querySelector('#w2g-top-inviteurl > input[type=text]').value != ''");

        var link = await page.$eval('#w2g-top-inviteurl > input[type=text]', (el) => el.value);
        console.log(`Der Link ist: ${link}`);

        await browser.close();

    } catch (error) 
    {
        console.error(error);
        return new Promise((_resolve, reject)=> 
        {
            reject("Bei der Abholung des Links ist etwas schiefgelaufen");
        });
    }

    const totalTime = Date.now() - start;
    console.log('Die Zeit zum Link holen beträgt: ', totalTime);

    linkAbgeholt = true;

    return new Promise((resolve)=> 
    {
        resolve(link);
    });
}

module.exports = {
    name: 'w2g',
    description: 'Erstellt einen neuen W2G Link',
    aliases: [],

    /**
     * 
     * @param {Client} bot 
     * @param {Message} message 
     * @param {String[]} parts 
     * @param {String} prefix 
     */

    async execute(bot, message, parts, prefix) {

        const start = Date.now();

        var msg = await message.reply({content: `${progressBar[counter]}`});

        counter++;

        //print Progress Bar
        const interval = setInterval(async () => {
            await printEmoji(msg, false);
        }, 1000);
    
        getW2GLink()
        .then(async (link) => {
            clearInterval(interval);
            counter = 0;
            
            //delete Progress Bar
            await msg.delete();

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
            .addField(`Der Link wurde ausgeliefert in: `, `${totalTime}ms`, true)
            await message.reply({embeds: [msgEmbed]});

        })
        .catch(async (error) => {
            clearInterval(interval);
    
            await printEmoji(msg, true);
            await msg.edit('Bei der Abholung des Links ist etwas schiefgelaufen ☹️');
    
            console.log(error);
    
            counter = 0;
    
            await sleep(10000);
    
            msg.delete();
        });

    }
}
