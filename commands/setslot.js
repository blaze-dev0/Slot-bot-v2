const {
    client,
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder
  } = require("discord.js")
  const setslot = require("../database/setslot")
  const config = require("../other/config");
  
  module.exports = {
    name: "setslot",
    description: "kcmskc",
    aliases: "ss",
    async execute(client, message, args) {
      try {
  
        const ia = new EmbedBuilder()
          .addFields({
            name: `__invalid argument provided__`,
            value: `use correct formate example: -setslot 7287328378273(category id) 1/2/3(category num to set) x `
          })
          .setThumbnail(`${message.guild.iconURL() || "https://cdn.discordapp.com/avatars/59434350/5713257311f4bcf376aa13ea1cf76c.png?size=4096"}`)
          .setColor(`Red`)

         
  
        if (args.length < 2) {

          return await message.channel.send({
            embeds: [ia]
          })
        }
  
        let roles = config.config.role_x;
  
   
  
        let gg = await client.guilds.fetch(config.config.guild_x)
  
        if (!gg) {
          return await message.channel.send("guild not found")
        }
  
        let staff = await gg.roles.fetch(config.config.staff_x)
  
        if (!staff) {
  
          return await message.channel.send("staff role not found")
        }
  
  
  
        if (!message.member.roles.cache.has(staff.id)) {
  
          return
        }
  
  
  
  
  
  
  

        let cate = args[1]


  
  
  
  
  
 
        let x= await message.mentions.channels.first() ||  await message.guild.channels.fetch(args[0])

  
  
  
        if (!x) {
          return await message.channel.send("invalid category")
        }
  
        let data = await setslot.findOne({
          guild: message.guild.id
        })
  
  
  
        if (!data) {
  
          new setslot({
            guild: message.guild.id,
            one: "None",
            two: "None",
            three: "None"
          }).save()
        }
  
        switch (cate) {
          case "1":
            console.log("im in")
            await setslot.findOneAndUpdate({
              guild: message.guild.id
            }, {
              one: args[0]
            })
            break;
          case "2":
            await setslot.findOneAndUpdate({
              guild: message.guild.id
            }, {
              two: args[0]
            })
            break;
          case "3":
  
            await setslot.findOneAndUpdate({
              guild: message.guild.id
            }, {
              three: args[0]
            })
            break;
        }
  
  
        await message.channel.send("succefully set")
  
      } catch (e) {
        console.log(e)
      }
    }
  }