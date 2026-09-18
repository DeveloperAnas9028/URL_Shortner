import express from "express";
import urlRoutes from "../routes/url.routes.js";
import urlModel from "../model/url.model.js";
import cors from "cors";

const app = express();

// 1. CORS middleware ko hamesha sabse upar rakho
app.use(cors({
  origin: "https://url-shortner-omega-three-42.vercel.app", // Exact vercel domain
  methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
  credentials: true
}));

app.use(express.json());

app.use("/api/url", urlRoutes);

app.get("/:code", async function (req, res) {
  try {
    const { code } = req.params;

    // Clicks badhao aur document le aao ek hi query me
    const url = await urlModel.findOneAndUpdate(
      { shortCode: code },
      { $inc: { clicks: 1 } },
      { new: true }
    );

    if (!url) {
      return res.status(404).json({
        message: "URL not found"
      });
    }

    return res.redirect(302, url.originalUrl);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

export default app;