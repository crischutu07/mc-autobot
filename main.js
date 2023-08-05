const mineflayer = require('mineflayer');
const readline = require('readline');
const mineflayerViewer = require('prismarine-viewer').mineflayer
var port = 80;
const { botUsername, auth, portHost, serverHost } = require("./config.json");
const newbotUsername = botUsername + Math.floor(Math.random() * 1000)
const bot_options = {
  username: newbotUsername,
  host: serverHost,
  port: portHost,
  auth: auth
}
var botuser = newbotUsername; // fix cant define username
const bot = mineflayer.createBot(bot_options)
console.log(`Prepare joining as ${botUsername}`);
bot.once('login', () => {
  console.log("Eliabished to the server");
  mineflayerViewer(bot, { port: port, firstPerson: true }) // ????
})
bot.once('spawn', (username) => {
  console.log("I am now spawned")
  bot.chat(`event: spawn | user: ${username}`)
  bot.on('chat', (username, message) => {
    console.log(`[${username}] ${message}`)
/*    moveCursor(process.stdout, 0, -1);
    clearScreenDown(process.stdout);
    rl.question('Enter your response: ', (response) => {
    bot.chat(response); */
    if (message == `${botuser} quit`){
      bot.quit();
      console.warn(`'${username}' Told bot quit the game...`)
    }
  });
  
})
bot.on('error', console.error)
bot.on('death', console.warn)
bot.on('kicked', console.warn)
bot.on('end', console.log)
