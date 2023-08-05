# mc-autobot
Minecraft Bot using Node.js with `mineflayer` 

# Installation
Get the lastest Node.js and install `git`, you can use `winget` to install or use your favorite linux package manager to install

Cloning this repository and install them inside the folder by using:
```bash
npm install mineflayer mineflayer-pvp mineflayer-pathfinder prismarine-viewer
```
You can run the `main.js` if you want to use them as an non-functional NPC for testing 2 other files, run them by using this command:
```bash
npm run test
```
# Configuration
Configuring code by access to `config.json` files
## View Bot with HTTP
If you want view your bot in http, turning on `useHTTP` to `true`

`useHTTP` - boolean (**false**-true)

`httpPort` - number (1-65575)

## Setting up user
`username` - string (Your username)

`email` - string (Email for `mojang`)

`password` - string (Password for `mojang`)

`auth` - string (microsoft-mojang-**offline**)

## Connecting to the Server
`serverHost` - strings (IP Server)

`port` - number (1-65575)
