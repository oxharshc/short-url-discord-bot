const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const Url = require("../models/url.js");

function extractShortId(input) {
  const value = input.trim();

  try {
    const url = new URL(value);
    const parts = url.pathname.split("/").filter(Boolean);
    return parts[parts.length - 1];
  } catch {
    return value.replace(/^\/+/, "");
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Get click stats for a short link.")
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("Short ID or full short URL")
        .setRequired(true),
    ),

  async execute(interaction) {
    const input = interaction.options.getString("id");
    const shortId = extractShortId(input);

    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    const url = await Url.findOne({ shortId });

    if (!url) {
      return interaction.editReply("No short link found with that ID.");
    }

    return interaction.editReply(
      `Stats for \`${shortId}\`\n` +
        `Original: <${url.originalUrl}>\n` +
        `Clicks: **${url.clicks}**\n` +
        `Created By: <@${url.createdBy}>\n` +
        `Created: <t:${Math.floor(url.createdAt.getTime() / 1000)}:F>`,
    );
  },
};
