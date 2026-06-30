const { SlashCommandBuilder } = require("discord.js");
const { nanoid } = require("nanoid");
const Url = require("../models/url.js");

function getBaseUrl() {
  return process.env.BASE_URL.replace(/\/$/, "");
}

async function generateUniqueShortId() {
  for (let i = 0; i < 5; i++) {
    const shortId = nanoid(7);
    const existing = await Url.findOne({ shortId });

    if (!existing) {
      return shortId;
    }
  }

  throw new Error("Failed to generate unique short ID.");
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shorten")
    .setDescription("Shorten a long URL.")
    .addStringOption((option) =>
      option
        .setName("url")
        .setDescription("The URL you want to shorten")
        .setRequired(true),
    ),

  async execute(interaction) {
    const originalUrl = interaction.options.getString("url").trim();

    let parsedUrl;

    try {
      parsedUrl = new URL(originalUrl);
    } catch {
      return interaction.reply({
        content: "❌ Invalid URL. Please include `http://` or `https://`.",
        ephemeral: true,
      });
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return interaction.reply({
        content: "❌ Only `http://` and `https://` URLs are allowed.",
        ephemeral: true,
      });
    }

    await interaction.deferReply();

    const existing = await Url.findOne({
      originalUrl,
      createdBy: interaction.user.id,
    });

    if (existing) {
      return interaction.editReply(
        `🔗 You already shortened this URL:\n${getBaseUrl()}/${existing.shortId}`,
      );
    }

    const shortId = await generateUniqueShortId();

    const newUrl = await Url.create({
      shortId,
      originalUrl,
      createdBy: interaction.user.id,
    });

    return interaction.editReply(
      `✅ **Shortened!**\n` +
        `🔗 ${getBaseUrl()}/${newUrl.shortId}\n` +
        `📎 Original: <${originalUrl}>`,
    );
  },
};
