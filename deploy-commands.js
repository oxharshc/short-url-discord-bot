require("dotenv").config();

const fs = require("node:fs");
const path = require("node:path");
const { REST, Routes } = require("discord.js");

const requiredEnv = ["DISCORD_TOKEN", "CLIENT_ID", "GUILD_ID"];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`Missing environment variable: ${key}`);
    process.exit(1);
  }
}

const commands = [];
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));

  if ("data" in command && "execute" in command) {
    commands.push(command.data.toJSON());
    console.log(`Loaded command for deploy: ${command.data.name}`);
  } else {
    console.warn(`Skipped invalid command file: ${file}`);
  }
}

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

async function deployCommands() {
  try {
    console.log("Started refreshing application commands.");

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID,
      ),
      {
        body: commands,
      },
    );

    console.log("✅ Successfully deployed application commands.");
  } catch (error) {
    console.error("Deploy error:", error);
    process.exit(1);
  }
}

deployCommands();
