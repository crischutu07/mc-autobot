const mineflayer = require('mineflayer');
const readline = require('readline');
var rejoin = false // doesn't work
function redLog(args){
  console.log('\x1b[31m' + args)
}
function yellowLog(args){
  console.log('\x1b[33m' + args)
}
function greenLog(args){
  console.log('\x1b[32m' + args)
}
function resetLog(){
  console.log('\x1b\[0m')
}
const mineflayerViewer = require('prismarine-viewer').mineflayer
const { botUsername, auth, portHost, serverHost, useHTTP, firstPerson, httpPort } = require("./config.json");
var newbotUsername = botUsername
const bot_options = {
  username: newbotUsername,
  host: serverHost,
  port: portHost,
  auth: auth
}
var botuser = newbotUsername; // fix cant define username
const bot = mineflayer.createBot(bot_options)
console.log(`Prepare joining as ${newbotUsername}`);
bot.on('login', () => {
  console.log("Eliabished to the server");
  if (useHTTP = true){
  mineflayerViewer(bot, { port: httpPort, firstPerson: firstPerson })
  }
})
bot.on('spawn', () => {
  const botInfomation = bot.players[botuser].entity
  rejoin = false;
  console.debug("I am now spawned at: " + botInfomation.position)
  bot.chat(`event: spawn | user: ${botuser}`)  
})
bot.on('chat', (username, message) => {
  console.log(`[${username}] ${message}`)
  if (message == `${botuser} quit`){
    bot.quit();
    console.warn(`'${username}' Told bot quit the game...`)
  }
  /*if (message == `${botuser} rejoin`){
    bot.quit()
    rejoin = true;
  }*/
});

bot.on('playerJoined', (player) => {
  greenLog(player.username + " Joined the game")
  resetLog()
  console.log(`${player.username}'s Ping: ${player.ping}ms`)
  return;
})
bot.on('playerLeft', (entity) => {
  redLog(entity.username + " Left the server")
  resetLog()
  return;
})
bot.on('error', (err) => {
  console.error(err)
  console.log("Exiting process with exit code 1")
  process.exit(1)
})
bot.on('death', () => {
  console.warn("You died")
})
bot.on('kicked', (reason) => {
  console.error(reason)
  console.log("Exiting process with exit code 1")
  process.exit(1)
})
bot.on('end', (reason) => {
  console.warn(reason)
/*  if (rejoin == true){ problem with `quit` after doing `rejoin`
    console.log("Rejoining the server...")
    mineflayer.createBot(bot_options)
    console.log("Sucessfully Restarted " + botuser)
  } else {
    console.log("Exiting process with exit code 0")
    process.exit(0)
  } */
  console.log("Exiting process with exit code 0")
  process.exit(0)
})
