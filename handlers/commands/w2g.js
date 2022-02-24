const { Client, Message, MessageEmbed } = require("discord.js");

const puppeteer = require('puppeteer');

var linkAbgeholt = false;

//var progressBar = ['😁', '😃', '🤨', '😠', '😡'];
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

async function printProgressBar(msg) 
{
    var currentTime1 = new Date().getTime();

    while (currentTime1 + 10000 >= new Date().getTime()) 
    {
        if (linkAbgeholt) 
        {
            await printEmoji(msg, true);
            return new Promise((resolve)=> 
            {
                resolve(msg);
            });
        }

        await printEmoji(msg, false);

        await sleep(1000);
    }

    await msg.edit('Bei der Abholung des Links ist etwas schiefgelaufen ☹️');

    await sleep(10000);

    msg.delete();
}

async function getW2GLink()
{
 
    const start = Date.now();

    try 
    {
        const browser = await puppeteer.launch({"headless": true, args: ['--disable-dev-shm-usage', '--no-sandbox', '--disable-gpu']});
        
        const page = await browser.newPage();

        await page.goto("https://w2g.tv/?lang=de");

        await page.click('#qc-cmp2-ui > div.qc-cmp2-footer.qc-cmp2-footer-overlay.qc-cmp2-footer-scrolled > div > button.css-k8o10q');
        
        await page.click('#create_room_button');
    
        await page.waitForSelector('#intro-modal > div.content > div', {visible: true, hidden: false});
        
        await page.click('#intro-modal > div.content > div');
        //await page.click('testsdfag');

        await page.waitForFunction("document.querySelector('#w2g-top-inviteurl > input[type=text]').value != ''");

        //await sleep(500);
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

        linkAbgeholt = false;

        var msg = await message.reply({content: `${progressBar[counter]}`});

        counter++;

        const start = Date.now();
        Promise.all([printProgressBar(msg), getW2GLink()])
        .then((res) => {
            res[0].edit({content: `${res[1]}`});
            counter = 0;
            const totalTime = Date.now() - start;
            console.log('Link ausgeliefert in ', totalTime);
        }).catch((error) => {
            counter = 0;
            console.error(error);
        });

    }
}
