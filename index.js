const {
  Client,
  GatewayIntentBits,
  Collection,
  PermissionsBitField
} = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});
const fs = require('fs');

const mongoose = require('mongoose');
const ch = require("./other/checker")

const end = require('./other/end')

const cf = require('./other/config')


//guild config moved in ""./other/config.js" there you can set


if (!cf.config.guild_x || !cf.config.role_x || !cf.config.staff_x  || !cf.config.slotrule) {
  
  console.log('you need to setup config file first')

  console.log(`./other/config.js Here You go for setup`)
  return


}







client.commands = new Collection();
client.aliases = new Collection()
mongoose.set("strictQuery", false);
mongoose.connect("Mongo Url").then(console.log(`\x1b[34m%s\x1b[0m`,'Connected to Mongodb.')).catch((e)=> {
  console.log(e)
  process.exit()

}).then(()=> {
  console.log('Connected To Mongo')
});



const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

let date = new Date()


for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  console.log(`\x1b[36m%s\x1b[0m`,`[${date.toLocaleString()}] ${command.name}`)



  client.commands.set(command.name, command);
}


client.on("ready", async () => {





  console.log(`\x1b[31m%s\x1b[0m`,`${client.user.username} Is Ready`)
})





client.on("messageCreate", async message => {
  ch(message)

  if (!message.content.startsWith("-") || message.author.bot) return;




  const args = message.content.slice("-".length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();



  const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
  if (!command) return;



  try {
    command.execute(client, message, args);
  } catch (error) {
    console.error(error);
    message.reply('There was an error trying to execute that command!');
  }



})


end(client,cf)


client.login("Your Bot Token")
