import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import stkRoute from "./routes/stk.js";

import callbackRoute from "./routes/callback.js";   // 👈 ADD THIS

dotenv.config();

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

// 👇 PUT IT HERE
app.use("/api", callbackRoute);
app.use("api", stkRoute);
