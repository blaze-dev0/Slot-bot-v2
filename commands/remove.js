const slot = require("../database/slot")
const {
  PermissionsBitField,
  EmbedBuilder
} = require("discord.js")
const config = require("../other/config");
module.exports = {
  name: "remove",
  decription: "remove user from the channel|| use when you want to revoke slot",
  aliases: ["revoke"],
  async execute(client, message, args) {
    try {



      const ia = new EmbedBuilder()
        .addFields({
          name: `__invalid argument provided__`,
          value: `use correct argument example:\nuse correct argument example: -remove 63728193719929(channelid)`
        })
        .setThumbnail(`${message.guild.iconURL() || "https://cdn.discordapp.com/avatars/59434350/5713257311f4bcf376aa13ea1cf76c.png?size=4096"}`)
        .setColor(`Red`)

      if (!args.length) {
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
          const perm = new EmbedBuilder()
          .addFields({name:"__Missing Permission__",value: "You need staff role to use this"})
          .setThumbnail(`${message.guild.iconURL() || "https://cdn.discordapp.com/avatars/59434350/5713257311f4bcf376aa13ea1cf76c.png?size=4096"}`)
          .setColor(`Red`)

          await message.channel.send({embeds: [perm]})
  
          return
        }

      if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) {

        return await message.channel.send("unable to remove user missing permisssion")
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
        overwrite.allow.has(PermissionsBitField.Flags.SendMessages)
      );

      

      if (!perms) {
        return await message.channel.send("user have already removed")
      }

      channel.permissionOverwrites.set([{
          id: message.guild.id,
          deny: [PermissionsBitField.Flags.SendMessages]
        },
        {
          id: member.id,
          deny: [PermissionsBitField.Flags.SendMessages]
        }
      ])

      let role = await message.guild.roles.fetch(roles);
      if (role) {
        await member.roles.remove(role).catch(x => console.log("unable to remove role missing permission"))

        } else {

          console.log(`role not found id: ${roles}`);
          }



      await message.channel.send("succefully removed user")

      await channel.send("slot has Been Revoked")




    } catch (e) {
      console.log(e)
    }
  }
}
