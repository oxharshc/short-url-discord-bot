# Discord URL Shortener Bot

A Discord bot that allows users to shorten URLs using slash commands. Shortened links are stored in MongoDB, and an Express server handles redirects and click tracking.

## Features

- `/shorten` command to create short links
- `/stats` command to view click statistics
- MongoDB storage using Mongoose
- Express redirect server
- Click counter for each short link
- Supports local testing and public deployment

## Project Structure

```txt
url-shortener-bot/
├── .env
├── package.json
├── index.js
├── deploy-commands.js
├── server.js
├── models/
│   └── Url.js
└── commands/
    ├── shorten.js
    └── stats.js
```

## Requirements

Before running this project, make sure you have:

- Node.js 18 or newer
- A Discord bot application
- A MongoDB database
- A Discord server where you can test slash commands

## Installation

Clone the repository:

```bash
git clone https://github.com/your-username/url-shortener-bot.git
cd url-shortener-bot
```

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root folder:

```env
DISCORD_TOKEN=your_discord_bot_token
CLIENT_ID=your_discord_application_client_id
GUILD_ID=your_discord_server_id
MONGO_URI=your_mongodb_connection_string
BASE_URL=http://localhost:3000
PORT=3000
```

### Environment Variable Explanation

| Variable        | Description                          |
| --------------- | ------------------------------------ |
| `DISCORD_TOKEN` | Your Discord bot token               |
| `CLIENT_ID`     | Your Discord application client ID   |
| `GUILD_ID`      | Your Discord test server ID          |
| `MONGO_URI`     | MongoDB connection string            |
| `BASE_URL`      | Base URL used for shortened links    |
| `PORT`          | Port for the Express redirect server |

## Discord Bot Setup

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications).
2. Create a new application.
3. Go to the `Bot` tab and create a bot.
4. Copy the bot token and place it in `.env` as `DISCORD_TOKEN`.
5. Go to the `OAuth2` section.
6. Generate an invite link with these scopes:
   - `bot`
   - `applications.commands`
7. Add the bot to your Discord server.

Recommended bot permission:

```txt
Send Messages
Use Slash Commands
```

## MongoDB Setup

You can use MongoDB Atlas for a free cloud database.

1. Create an account at [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a cluster.
3. Create a database user.
4. Allow your IP address in Network Access.
5. Copy your connection string.
6. Add it to `.env` as `MONGO_URI`.

Example:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/urlshortener
```

## Deploy Slash Commands

Before using the bot, register the slash commands:

```bash
npm run deploy
```

or:

```bash
node deploy-commands.js
```

You should see something like:

```txt
Started refreshing application commands.
Successfully deployed application commands.
```

## Start the Bot

Run:

```bash
npm start
```

or:

```bash
node index.js
```

Expected output:

```txt
Loaded command: shorten
Loaded command: stats
Connected to MongoDB
Redirect server running on port 3000
Logged in as YourBot#1234
```

## Usage

### Shorten a URL

In Discord, use:

```txt
/shorten url:https://example.com/some/long/path
```

The bot will reply with a shortened link:

```txt
http://localhost:3000/aB3xYz1
```

### View Link Stats

Use:

```txt
/stats id:aB3xYz1
```

You can also use the full short URL if your command supports it:

```txt
/stats id:http://localhost:3000/aB3xYz1
```

The bot will show:

```txt
Stats for aB3xYz1
Original: https://example.com/some/long/path
Clicks: 4
Created By: @User
Created: date
```

## Local Testing

By default, this project uses:

```env
BASE_URL=http://localhost:3000
```

This means short links only work on your own machine.

If you want other people to access the links while testing locally, you can use a tunneling service like ngrok.

Example:

```bash
ngrok http 3000
```

Then update your `.env`:

```env
BASE_URL=https://your-ngrok-url.ngrok-free.app
```

Restart the bot after changing `.env`.

## Deployment

For public short links, deploy the project to a hosting platform such as:

- Render
- Railway
- Fly.io
- VPS
- Heroku-compatible hosting

After deploying, update:

```env
BASE_URL=https://your-domain.com
```

If you use a custom domain, make sure it points to your deployed Express server.

## Available Commands

| Command    | Description                             |
| ---------- | --------------------------------------- |
| `/shorten` | Shortens a long URL                     |
| `/stats`   | Shows click statistics for a short link |

## Scripts

| Script           | Description                                   |
| ---------------- | --------------------------------------------- |
| `npm start`      | Starts the Discord bot and redirect server    |
| `npm run deploy` | Deploys slash commands to your Discord server |

## Dependencies

This project uses:

- [discord.js](https://discord.js.org/)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [mongoose](https://mongoosejs.com/)
- [express](https://expressjs.com/)
- [nanoid](https://www.npmjs.com/package/nanoid)

Note: This project uses `nanoid@3` because it works with CommonJS `require()`.

## Common Issues

### Slash commands are not showing

Try running:

```bash
npm run deploy
```

Also make sure your `.env` contains the correct:

```env
CLIENT_ID
GUILD_ID
DISCORD_TOKEN
```

### MongoDB connection failed

Check that:

- Your MongoDB URI is correct
- Your database user and password are correct
- Your IP address is allowed in MongoDB Atlas
- Your password does not contain unescaped special characters

### Short links do not work for other people

If your `BASE_URL` is:

```env
BASE_URL=http://localhost:3000
```

only you can open the links locally.

Use a public hosting service or ngrok for testing.

### Error with nanoid

Install version 3:

```bash
npm install nanoid@3
```

Version 4 and newer are ESM-only and may not work with `require()`.

## License

This project is licensed under the MIT License.
