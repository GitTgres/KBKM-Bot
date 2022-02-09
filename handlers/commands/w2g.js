const { Client, Message } = require("discord.js");

const {By,Key,Builder} = require("selenium-webdriver");
const { Options } = require('selenium-webdriver/chrome');
require("chromedriver");

async function someLongFunc (msg) 
{
    var content = msg.content;
    return new Promise((resolve, reject)=> {
        var interval = setInterval(async function() { 
        console.log("Funktion 1");
        await msg.edit(`${content}` + '#');
        content += '#';
        }, 1000);
        setTimeout(function() { 
        clearInterval(interval); 
        resolve();
        }, 5000);
    })
}

async function getW2GLink()
{
 
    let driver = await new Builder().forBrowser("chrome").setChromeOptions(new Options().addArguments("--disable-dev-shm-usage").addArguments("--no-sandbox").addArguments("--headless").addArguments("--disable-gpu")).build();

    await driver.get("https://w2g.tv/?lang=de");

    var currentTime1 = new Date().getTime();

    while (currentTime1 + 500 >= new Date().getTime()) {}

    await driver.findElement(By.xpath("//*[@id='qc-cmp2-ui']/div[2]/div/button[2]")).click();

    await driver.findElement(By.id("create_room_button")).click();

    await driver.findElement(By.className("ui fluid green cancel button")).click()

    var currentTime = new Date().getTime();

    while (currentTime + 500 >= new Date().getTime()) {}

    var link = await driver.findElement(By.xpath("//*[@id='w2g-top-inviteurl']/input")).getAttribute("value");
    
    //var link = await driver.getTitle();

    console.log(`Der Link ist: ${link}`);

    await driver.quit();

    return new Promise((resolve, reject)=> {
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
        //var link = await getW2GLink();

        var msg = await message.reply({content: `#`});

        let someLongFuncPromise, anotherLongFuncPromise
        const start = Date.now()
        try 
        {
            someLongFuncPromise = someLongFunc(msg)
        }
        catch (ex) 
        {
            console.error('something went wrong during func 1')
        }
        try 
        {
            anotherLongFuncPromise = getW2GLink()
        }
        catch (ex) 
        {
            console.error('something went wrong during func 2')
        }

        await someLongFuncPromise
        var res = await anotherLongFuncPromise
        message.reply({content: `${res}`});
        const totalTime = Date.now() - start
        console.log('Execution completed in ', totalTime)
    }
}
