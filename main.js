const mineflayer = require('mineflayer');
const readline = require('readline');
try { require('node-canvas-webgl') } catch (e) { throw Error('node-canvas-webgl is not installed, you can install it with `npm install PrismarineJS/node-canvas-webgl`') }

var rejoin = false
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
const mineflayerViewer = require('prismarine-viewer').headless
var port = 80;
const { auth, portHost, serverHost, botUsername } = require("./config.json");
//const newbotUsername = `${botUsername}` + Math.floor(Math.random() * 1000)
var botUsername = "SussyBaka421"
//var botUsername = ""
const bot_options = {
  username: botUsername,
  host: serverHost,
  port: portHost,
  auth: auth,
  verison: '1.19.1'
}
function playerCheck(string) {
  if (!string) return false;
  if (Object.keys(bot.players).includes(string)) return true
  else return false
}
var botuser = botUsername; // fix cant define username
const bot = mineflayer.createBot(bot_options)
console.log(`Prepare joining as ${botUsername}`);
bot.on('login', () => {
  console.log("Eliabished to the server");
//  mineflayerViewer(bot, { port: port, firstPerson: true }) // ????
})
var playerList = []

bot.on('spawn', () => {
  const botInfomation = bot.player.entity
  const idk = bot.player.username
  console.log(idk)
//  bot.chat("/login botbot002&")
//  rejoin = false;
  console.debug("I am now spawned at: " + botInfomation.position)
  console.debug("Rounded Coordinates:", Math.round(botInfomation.position.x, 3), Math.round(botInfomation.position.y, 3), Math.round(botInfomation.position.z, 3))
//  mineflayerViewer(bot, { output: 'output.mp4', frames: 200, width: 1920, height: 1080, '1.19.1' })
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
  
  playerList.push(player.username)
  greenLog(`[${playerList.length}] ` + player.username + " Joined the game")
  resetLog()
  console.log(`${player.username}'s Ping: ${player.ping}ms`)
//  console.log(playerList[playerList.indexOf("SussyBaka420")])
  return;
})
bot.on('playerLeft', (entity) => {
  if (playerList.indexOf(entity.username) !== -1) playerList.splice(playerList.indexOf(entity.username))
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
//  bot.chat("/home c")
})
bot.on('kicked', (reason) => {
  console.error(`Kicked: ${reason}`)
  playerList = [];
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
  playerList = [];
  console.log("Exiting process with exit code 0")
  process.exit(0)
})
