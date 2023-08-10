const mineflayer = require('mineflayer')
const pathfinder = require('mineflayer-pathfinder').pathfinder
const Movements = require('mineflayer-pathfinder').Movements
const { GoalBlock, GoalNear } = require('mineflayer-pathfinder').goals
const pvp = require('mineflayer-pvp').plugin
const armorManager = require("mineflayer-armor-manager")
// const mineflayerViewer = require('prismarine-viewer').mineflayer
const { botUsername, serverHost, portHost, auth } = require("./config.json");
const botuser = botUsername;
//function joinServer(){
  const bot = mineflayer.createBot({ 
    username: botUsername,
    host: serverHost,
    port: portHost,
    auth: auth
  })
//}
//joinServer()
bot.loadPlugin(pathfinder)
bot.loadPlugin(pvp)
bot.loadPlugin(armorManager);

let guardPos = null;
let movingToGuardPos = null;
var playerList = [];

function playerCheck(string){
  if (!string){
    return "Can't find any players or empty variables:"
  } else if (playerList.lastIndexOf(string) == botUsername){
    return false;
  } else if (playerList.lastIndexOf(string) !== -1){
    return playerList[playerList.lastIndexOf(string)];
  } else {
    return false;
  }
}
async function moveToGuardPos () {
  if (movingToGuardPos) return
  // console.info('Moving to guard pos')
  const mcData = require('minecraft-data')(bot.version)
  bot.pathfinder.setMovements(new Movements(bot, mcData))
  try {
    movingToGuardPos = true;
    await bot.pathfinder.goto(new GoalNear(guardPos.x, guardPos.y, guardPos.z, 2))
    movingToGuardPos = false
  } catch (err) {
    // Catch errors when pathfinder is interrupted by the pvp plugin or if pathfinder cannot find a path
    movingToGuardPos = false
    // console.warn(err)
    // console.warn('Mineflayer-pvp encountered a pathfinder error')
  }
}


function guardArea (pos) {
  guardPos = pos

  if (!bot.pvp.target) {
    moveToGuardPos()
  }
}

async function stopGuarding () {
  movingToGuardPos = false
  guardPos = null
  await bot.pvp.stop()
}
bot.on('join', () => {
  console.log("Eliabished the server, preparing to join...")
})

bot.on('spawn', () => {
//  mineflayerViewer(bot, { port: 3000, firstPerson: true, viewDistance: 1 })
  const botcoord = bot.player.entity;
  const num = bot.health
  bot.armorManager.equipAll()
  console.log(`Bot health: ${num}`)
  console.log("Spawned in the server.")
  console.log(`Coordinate: ${botcoord.position}`)
})
bot.on('physicTick', async () => {
  if (!guardPos) return // Do nothing if bot is not guarding anything

  let entity = null
  if (bot.entity.position.distanceTo(guardPos) < 16) {
   const filter = e => (e.type === 'hostile' || e.type === 'mob') && e.position.distanceTo(bot.entity.position) < 10 && e.mobType !== 'Armor Stand'

    entity = bot.nearestEntity(filter)
  }
  if (entity != null && !movingToGuardPos) {
    bot.pvp.attack(entity)
  } else {
    // If we do not have an enemy or if we are moving back to the guarding position do this:
    // If we are close enough to the guarding position do nothing
    if (bot.entity.position.distanceTo(guardPos) < 2) return
    await bot.pvp.stop()
    moveToGuardPos()
  }
})
bot.on('chat', function(username, message) { // chat event
  console.log(`[${username}] ${message}`)
  const cmd = message.split(/\s+/g)[0];
  if (username === bot.username) return;
  var cmdList = ['come','guard','playerCheck','attack', 'debug']
  if (cmd === 'come') {
    const defaultMove = new Movements(bot);
    const player = message.split(/\s+/g)[1];
    if (!player){
        console.warn(`Get into ${username} without using 'player' arguments.`)    
        const nonTarget = bot.players[username].entity
        const nonTargetpos = nonTarget.position
        defaultMove.canOpenDoors = true;
        defaultMove.allow1by1towers = true;
        defaultMove.canOpenDoors = true;
        defaultMove.canDig = true;
        defaultMove.placeCost = 0;
        defaultMove.digCost = 0;
        defaultMove.canOpenDoors = true;
        defaultMove.scafoldingBlocks.push(bot.registry.itemsByName['dirt'])
        bot.pathfinder.setMovements(defaultMove)
        bot.pathfinder.setGoal(new GoalNear(nonTargetpos.x, nonTargetpos.y, nonTargetpos.z, 1))
        return;
    }/*else if (username == "Server"){
      bot.chat("Console can't interact user idiot.")
      return;
  }*/
  const target = bot.players[player].entity;
    if (!target) {
      bot.chat('I don\'t see you!')
      console.log("Fail to come to target ", target)
      return;
  }

  const p = target.position;
  defaultMove.canOpenDoors = true;
  defaultMove.allow1by1towers = true;
  defaultMove.canOpenDoors = true;
  defaultMove.canDig = true;
  defaultMove.placeCost = 0;
  defaultMove.digCost = 0;
  defaultMove.canOpenDoors = true;
  defaultMove.scafoldingBlocks.push(bot.registry.itemsByName['dirt'])
  bot.pathfinder.setMovements(defaultMove)
  bot.pathfinder.setGoal(new GoalBlock(p.x, p.y, p.z)) // seems better
  } // cmd come <user>
  if (cmd === 'guard') {
    const stop = message.split(' ')[1];
    const player = bot.players[username];
    if (!player) {
      bot.chat("I can't see you.")
      return
    }
    if (stop == "stop"){
      stopGuarding()
    }

    bot.chat('I will guard that location.')
    // Copy the players Vec3 position and guard it
    guardArea(player.entity.position.clone())
  }
  if (cmd == "playerCheck"){
    const targetPlayers = message.split(/\s+/g)[1];
    const results = playerCheck(targetPlayers);
    if (results == false){
      bot.chat("Player does not exist or empty arguments.")
      return;
    }
    bot.chat(results)
    return;
  }
  if (cmd == "goto"){
    const posx = message.split(/\s+/g)[1];
    const posy = message.split(/\s+/g)[2];
    const posz = message.split(/\s+/g)[3];
    if (!isNaN(posx) || !isNaN(posy) || !isNaN(posz) ){
      bot.chat("not a number or empty")
      console.log("Invaild or not a integer (number)"); return;
    }
    const defaultMove = new Movements(bot);
    bot.pathfinder.setMovements(defaultMove);
    bot.pathfinder.setGoal(new GoalBlock(posx, posy, posz))
  }
  if (cmd == "attack"){
  const defaultMove = new Movements(bot);
  const attackTarget = message.split(/\s+/g)[1];
    console.log(`${username} Triggering 'attack' function`)
      if (attackTarget == ''){
        bot.chat(`@${username}` + " attack <attackTarget/stop>")
        console.warn("cmd=attack Requires 1 more argument")
        return;
      }
      if (attackTarget == "stop"){
        bot.pvp.stop()
        return;
      }
      defaultMove.canOpenDoors = true;
      defaultMove.allow1by1towers = true;
      defaultMove.canOpenDoors = true;
      defaultMove.canDig = true;
      defaultMove.placeCost = 0;
      defaultMove.digCost = 0;
      defaultMove.canOpenDoors = true;
      defaultMove.allowFreeMotion = false;
      const player = bot.players[attackTarget];
      bot.pvp.attack(player.entity)
      bot.on("stoppedAttacking", () => {
        if (guardPos) {
          moveToGuardPos()
        }
        return;
    })
  }
})
bot.on('respawn', () => {
  console.log(`I Respawned at ${bot.players[botUsername].entity.position}`)
})
bot.on('path_update', () => {
  console.log(`Update current coordinate: ${bot.players[botUsername].entity.position}`)
  return;
})
bot.on('path_reset', (reason) => {
  console.log("path_reset: ", reason)
})
bot.on('goal_reached', () => {
  console.debug("Reached Movements goal.")
})
bot.on('playerJoined', (player) => {
  playerList.push(player.username)
});
bot.on('playerLeft', (entity) => {
  playerList.splice(playerList.lastIndexOf(entity.username), 1)
})
bot.on('error', (err) => {
  console.error(`Error: ${err}`)
  process.exit(1)
})
bot.on('kicked', (reason) => {
  console.warn(`Kicked: ${reason.text}`)
  process.exit(1)
})
bot.on('end', (reason => {
  console.warn(reason)
  process.exit(0)
}))
//bot.on('end', () => joinServer())
// 225 lines
