const { Client, Message } = require("discord.js");

//const {By,Key,Builder} = require("selenium-webdriver");
const {By,Key,Builder} = require("/usr/local/node_modules/selenium-webdriver");
require("chromedriver");

async function getW2GLink(){
 
    var searchString = "Automation testing with Selenium and JavaScript";

    //To wait for browser to build and launch properly
    let driver = await new Builder().forBrowser("chrome").build();

    //To fetch http://google.com from the browser with our code.
    await driver.get("https://w2g.tv/?lang=de");
         
    //To send a search query by passing the value in searchString.
    //await driver.findElement(By.name("q")).sendKeys(searchString,Key.RETURN);

    //Verify the page title and print it
    var title = await driver.getTitle();

    //await driver.manage().deleteAllCookies();

    await driver.manage().window().maximize();

    await driver.findElement(By.xpath("//*[@id='qc-cmp2-ui']/div[2]/div/button[2]")).click();

    await driver.findElement(By.id("create_room_button")).click();

    await driver.findElement(By.className("ui fluid green cancel button")).click()

    var currentTime = new Date().getTime();

    while (currentTime + 2000 >= new Date().getTime()) {}

    var link = await driver.findElement(By.xpath("//*[@id='w2g-top-inviteurl']/input")).getAttribute("value");
    
    console.log(`Der Link ist: ${link}`);

    //It is always a safe practice to quit the browser after execution
    await driver.quit();

    return link;
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

        var link = await getW2GLink();

        message.reply({
            content: `${link}`
        })
    }
}