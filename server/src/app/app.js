import express from "express";
import urlRoutes from "../routes/url.routes.js";
import urlModel from "../model/url.model.js";
import cors from "cors";

const app = express();

app.use(cors({
    origin: (origin, callback) => {
        // Bina origin wali requests (jaise Postman/direct browser) allow karo
        if (!origin) return callback(null, true);

        // Agar localhost ho ya vercel ka koi bhi URL ho toh allow karo
        if (origin.includes("localhost") || origin.endsWith(".vercel.app")) {
            return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"]
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