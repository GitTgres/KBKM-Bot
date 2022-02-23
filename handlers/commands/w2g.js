const { Client, Message, MessageEmbed } = require("discord.js");

const puppeteer = require('puppeteer');

var linkAbgeholt = false;

//Für die Performance gut
const sleep = (delay) => new Promise ((resolve) => setTimeout(resolve, delay));

async function printProgressBar(msg) 
{
    var currentTime1 = new Date().getTime();

    while (currentTime1 + 10000 >= new Date().getTime()) 
    {
        if (linkAbgeholt) 
        {
            return new Promise((resolve, reject)=> 
            {
                resolve(msg);
            });
        }

        //await msg.edit(`${msg.content}` + '🤝');
        await msg.edit({embeds: [createEmbedMsg("", true, msg.embeds.at(0))]});
        await sleep(1000);
    }

    await msg.edit('Bei der Abholung des Links ist etwas schiefgelaufen ☹');

    await sleep(10000);

    msg.delete();
}

async function clickXpath(page, xpath)
{
    await page.waitForXPath(xpath);
    const elements = await page.$x(xpath);
    await elements[0].click();
}

async function getW2GLink()
{
 
    const start = Date.now();

    try 
    {
        //let driver = await new Builder().forBrowser("chrome").setChromeOptions(new Options().addArguments("--disable-dev-shm-usage").addArguments("--no-sandbox").addArguments("--headless").addArguments("--disable-gpu")).build();
        const browser = await puppeteer.launch({"headless": false, slowMo: 100, args: ['--disable-dev-shm-usage', '--no-sandbox', '--disable-gpu']});
        
        const page = await browser.newPage();

        await page.goto("https://w2g.tv/?lang=de");

        await clickXpath(page, '//*[@id="qc-cmp2-ui"]/div[2]/div/button[2]');

        await clickXpath(page, '//*[@id="create_room_button"]');
        //await clickXpath(page, '//*[@id="create_rsdfsdoom_button"]');

        await clickXpath(page, '//*[@id="intro-modal"]/div[2]/div');

        //click somewhere on the page to disable the modal
        //await page.mouse.click(400, 300)

        //await page.waitForXPath('//*[@id="w2g-top-inviteurl"]/input');
            
        await page.waitForSelector('#w2g-top-inviteurl > input[type=text]');

        await clickXpath(page, )

        var link = await page.$eval('#w2g-top-inviteurl > input[type=text]', (input) => input.value)
        //let test = await page.$eval("#w2g-top-dfgdfginviteurl > input[type=text]", (el) => el.getAttribute("data-w2g")[0]);
        //var link = "https://lul.de"
        console.log(`Der Link ist: ${link} Lalalala`);

        //await browser.close();

        //await driver.get("https://w2g.tv/?lang=de");
        //await driver.get("https://google.com");

        //await sleep(500);

        //await driver.findElement(By.xpath("//*[@id='qc-cmp2-ui']/div[2]/div/button[2]")).click();

        //await driver.findElement(By.id("create_room_button")).click();

        //await driver.findElement(By.className("ui fluid green cancel button")).click()

        //await sleep(500);

        //var link = await driver.findElement(By.xpath("//*[@id='w2g-top-inviteurl']/input")).getAttribute("value");

        //console.log(`Der Link ist: ${link}`);

        //await driver.quit();

    } catch (error) 
    {
        console.error(error);
        return new Promise((resolve, reject)=> 
        {
            reject("Bei der Abholung des Links ist etwas schiefgelaufen");
        });
    }

    const totalTime = Date.now() - start;
    console.log('Die Zeit zum Link holen beträgt: ', totalTime);

    linkAbgeholt = true;

    return new Promise((resolve, reject)=> 
    {
        resolve(link);
    });
}

function createEmbedMsg(link, progressBarOn, progressBar) 
{
    if (progressBarOn) 
    {
        //progressBar.fields.at(0).value += `🤝` ;
        //progressBar.setTitle(`${progressBar.title}` + '🤝');
        progressBar.setDescription(`${progressBar.description}` + '🤝');
        return progressBar;
    }
    const msgEmbed = new MessageEmbed()
    .setColor('#0099ff')
    .setTimestamp()
    .setTitle('Hier ein neuer Watch2Gether Link')
    .setURL(`${link}`)
    .setDescription(`${link}`)
    .setThumbnail('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP._gelCIt-j64pWPX1sJ7r-AHaHa%26pid%3DApi&f=1')
    //.addField(`${link}`, `Toller Link 😏`, true)
    return msgEmbed;
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

        //var msg = await message.reply({content: `🤝`});

        const msgEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setDescription('🤝')
        .setTitle('Hole einen neuen Watch2Gether Link')
        //.addField(`Test`, `Toller Link 😏`, true)
        
        var msg = await message.reply({embeds: [msgEmbed]});

        const start = Date.now();
        Promise.all([printProgressBar(msg), getW2GLink()])
        .then((res) => {
            //res[0].edit(`${res[1]}`);
            res[0].edit({embeds: [createEmbedMsg(res[1], false)]});
            //res[0].edit({content: `${res[1]}`});
            const totalTime = Date.now() - start;
            console.log('Link ausgeliefert in ', totalTime);
        }).catch((error) => {
            console.error(error);
        });

    }
}
