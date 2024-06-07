const slot = require("../database/slot")
const {
  PermissionsBitField,EmbedBuilder
} = require("discord.js")
const config = require("../other/config");
module.exports = {
  name: "add",
  decription: "add user from the channel || use this to remove revoke",
  aliases: ["continue"],
  async execute(client, message, args) {

    try {

        const ia = new EmbedBuilder()
        .addFields({name: `__invalid argument provided__`,value: `use correct argument example: -add 0389192837189(channelid)`})
        .setThumbnail(`${message.guild.iconURL() || "https://cdn.discordapp.com/avatars/59434350/5713257311f4bcf376aa13ea1cf76c.png?size=4096"}`)
        .setColor(`Red`)
      if (!args.length) {
        return await message.channel.send({embeds: [ia]})
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



      if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) {

        return await message.channel.send("unable to add user missing permisssion")
      }

      
      let channel = await message.mentions.channels.first() ||  await message.guild.channels.fetch(args[0])

      if (!channel) {
        return await message.channel.send("no channel found")
      }




      let data = await slot.findOne({
        channel: channel.id
      })
      if (!data) {
        return await message.channel.send("no data found")
      }


      let member = await message.guild.members.fetch(data.userid)

      if (!member) {
        return await message.channel.send("member not found")
      }

      const permissions = channel.permissionsFor(member);
      let s = permissions.has(PermissionsBitField.Flags.SendMessages, false)
      const perms = channel.permissionOverwrites.cache.some(
        overwrite =>
        overwrite.id === member.id &&
        overwrite.deny.has(PermissionsBitField.Flags.SendMessages)
      );

 

      if (!perms) {
        return await message.channel.send("user  already added")
      }


      channel.permissionOverwrites.set([{
          id: message.guild.id,
          deny: [PermissionsBitField.Flags.SendMessages]
        },
        {
          id: member.id,
          allow: [PermissionsBitField.Flags.SendMessages]
        }
      ])

      let role = await message.guild.roles.fetch(roles);
      if (role) {
        await member.roles.add(role).catch(x => console.log("unable to add role missing permission"))

        } else {

          console.log(`role not found id: ${roles}`);
          }

    
      await channel.messages.fetch().then((x) => {

       
        for (const [ll, l] of x) {
          if (l.author.id == client.user.id) {

    
            if (l.content == "slot has Been Revoked") {
              l.delete()
            }
          }
        }
      })


      await message.channel.send("succesfully added user")





    } catch (e) {
      console.log(e)

    }
  }
}