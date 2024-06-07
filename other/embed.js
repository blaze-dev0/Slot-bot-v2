const {
  client,
  EmbedBuilder,
  PermissionsBitField
} = require("discord.js");

const eb = (message, config, member, finalt) => {
  let formattedDate = finalt.toLocaleString('en-US', {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).replace(",", "");

  const r = new EmbedBuilder()


    .setAuthor({
      name: `${message.guild.name}`
    })
    .addFields({
      name: "__Slot rules__",
      value: `${config.config.slotrule}`
    })
    .setFooter({
      text: `${formattedDate}`
    })
    .setColor(`#0000FF`)

  const s = new EmbedBuilder()
    .setAuthor({
      name: `${member.user.username}`
    })
    .addFields({
      name: `__Slot__`,
      value: `**Slot Owner** ${member}:\n**Ends:** <t:${Math.floor(finalt.getTime() / 1000)}:R>`
    })
    .setFooter({
      text: `${message.guild.name}`
    })
    .setColor(`#0000FF`)
  return [r, s]
}

module.exports = eb