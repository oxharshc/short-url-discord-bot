const express = require("express");
const Url = require("./models/url.js");

function startServer() {
  const app = express();

  app.get("/", (req, res) => {
    res.send("URL Shortener Bot is running.");
  });

  app.get("/:shortId", async (req, res) => {
    try {
      const { shortId } = req.params;

      const url = await Url.findOneAndUpdate(
        { shortId },
        { $inc: { clicks: 1 } },
        { new: true },
      );

      if (!url) {
        return res.status(404).send("Short link not found.");
      }

      return res.redirect(url.originalUrl);
    } catch (error) {
      console.error("Redirect error:", error);
      return res.status(500).send("Server error.");
    }
  });

  const PORT = process.env.PORT || 3001;

  app.listen(PORT, () => {
    console.log(`🌐 Redirect server running on port ${PORT}`);
  });
}

module.exports = startServer;
