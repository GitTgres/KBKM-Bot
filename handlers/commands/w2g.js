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

async function getW2GLink(startPlaylist)
{
 
    const start = Date.now();

    try 
    {
        //const browser = await puppeteer.launch({"headless": false, args: ['--disable-dev-shm-usage', '--no-sandbox', '--disable-gpu']});
        const browser = await puppeteer.launch({"headless": false, executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe', args: ['--disable-dev-shm-usage', '--no-sandbox', '--disable-gpu']});
        
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

        //if the user wants to have a playlist at startup
        if (startPlaylist) 
        {
            await page.setViewport({
                width: 1920,
                height: 1080,
                deviceScaleFactor: 1,
              });

            await page.waitForSelector('#search-bar-input');

            await page.type('#search-bar-input','https://www.youtube.com/watch?v=LMuFA_XBtWk&list=PLTY-fHX-ZIGwdsXnDUPhGYLkhvH9TmtXD&index=3&ab_channel=DavidBosch');

            await page.waitForSelector('#search-bar-form > div > button');

            await page.click('#search-bar-form > div > button');

            //await page.waitForSelector('#w2g-search-results > div.w2g-pl-import-button > div');
            await sleep(2000);

            await page.click('#w2g-search-results > div.w2g-pl-import-button > div');

            await page.waitForSelector('#w2g-search-results > div.w2g-items-grid.w2g-top-results > div:nth-child(1) > div.w2g-item-image.mod-player');

            await page.click('#w2g-search-results > div.w2g-items-grid.w2g-top-results > div:nth-child(1) > div.w2g-item-image.mod-player');

            await page.waitForFunction("document.querySelector('#userbar > div:nth-child(3) > div').children.length > 1")

            await browser.close();
        }

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

        if (parts[1] != undefined) 
        {
            console.log(parts[1]); 
            if (parts[1] === 'lul') 
            {
                const start = Date.now();

                var msg = await message.reply({content: `${progressBar[counter]}`});

                counter++;

                //print Progress Bar
                const interval = setInterval(async () => {
                    await printEmoji(msg, false);
                }, 1000);
            
                getW2GLink(true)
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
                    //.setThumbnail('https://media1.tenor.com/images/d5a2e3786faa13b1fdb8b27c28d496ee/tenor.gif?itemid=14327746')
                    //.setThumbnail('https://www.omega-level.net/wp-content/uploads/2015/02/gasp.gif')
                    .addField(`Der Link wurde ausgeliefert in: `, `${totalTime}ms`)
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
        else
        {
            const start = Date.now();

            var msg = await message.reply({content: `${progressBar[counter]}`});
    
            counter++;
    
            //print Progress Bar
            const interval = setInterval(async () => {
                await printEmoji(msg, false);
            }, 1000);
        
            getW2GLink(false)
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
                //.setThumbnail('https://media1.tenor.com/images/d5a2e3786faa13b1fdb8b27c28d496ee/tenor.gif?itemid=14327746')
                //.setThumbnail('https://www.omega-level.net/wp-content/uploads/2015/02/gasp.gif')
                .addField(`Der Link wurde ausgeliefert in: `, `${totalTime}ms`)
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
}
