
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { nanoid } from "nanoid";
import Link from "./models/Link.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const BACKEND_URL = (
  process.env.BACKEND_URL || `http://localhost:${PORT}`
).replace(/\/+$/, "");

app.use(cors());
app.use(express.json());

// Check backend and database status
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "LinkVault backend is running!",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
  });
});

// Create a short link
app.post("/api/links", async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl || typeof originalUrl !== "string") {
      return res.status(400).json({
        success: false,
        message: "Please provide a URL.",
      });
    }

    let parsedUrl;

    try {
      parsedUrl = new URL(originalUrl.trim());
    } catch {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid URL.",
      });
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return res.status(400).json({
        success: false,
        message: "Only HTTP and HTTPS URLs are allowed.",
      });
    }

    const shortCode = nanoid(7);

    const link = await Link.create({
      originalUrl: parsedUrl.href,
      shortCode,
    });

    res.status(201).json({
      success: true,
      message: "Short link created successfully!",
      link: {
        originalUrl: link.originalUrl,
        shortCode: link.shortCode,
        shortUrl: `${BACKEND_URL}/${link.shortCode}`,
        clicks: link.clicks,
        createdAt: link.createdAt,
      },
    });
  } catch (error) {
    console.error("Create link error:", error.message);

    res.status(500).json({
      success: false,
      message: "Could not create the short link.",
    });
  }
});

// List all saved links
app.get("/api/links", async (req, res) => {
  try {
    const links = await Link.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: links.length,
      links: links.map((link) => ({
        originalUrl: link.originalUrl,
        shortCode: link.shortCode,
        shortUrl: `${BACKEND_URL}/${link.shortCode}`,
        clicks: link.clicks,
        createdAt: link.createdAt,
      })),
    });
  } catch (error) {
    console.error("Fetch links error:", error.message);

    res.status(500).json({
      success: false,
      message: "Could not fetch links.",
    });
  }
});

 // Delete a saved short link
app.delete("/api/links/:shortCode", async (req, res) => {
  try {
    const deletedLink = await Link.findOneAndDelete({
      shortCode: req.params.shortCode,
    });

    if (!deletedLink) {
      return res.status(404).json({
        success: false,
        message: "Link not found.",
      });
    }

    res.json({
      success: true,
      message: "Link deleted successfully.",
    });
  } catch (error) {
    console.error("Delete link error:", error.message);

    res.status(500).json({
      success: false,
      message: "Could not delete the link.",
    });
  }
});

// Redirect visitors and increment the click counter
app.get("/:shortCode", async (req, res, next) => {
  // Leave API endpoints to their own handlers
  if (req.params.shortCode === "api") {
    return next();
  }

  try {
    const link = await Link.findOneAndUpdate(
      { shortCode: req.params.shortCode },
      { $inc: { clicks: 1 } },
      { new: true }
    );

    if (!link) {
      return res.status(404).send("LinkVault: short link not found.");
    }

    return res.redirect(302, link.originalUrl);
  } catch (error) {
    console.error("Redirect error:", error.message);
    return res.status(500).send("Unable to redirect right now.");
  }
});

// Start only after MongoDB connects
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected to MongoDB!");

    app.listen(PORT, () => {
      console.log(`LinkVault server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
}

startServer();
