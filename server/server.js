// server.js
import express from "express";
import cors from "cors";
import yahooFinance from "yahoo-finance2";
import apiRoutes from "./routes/api.js";
const app = express();
const PORT = 5000;

app.use(cors()); // Allow all origins
app.use(express.json());

// Example endpoint: Get stock price
app.use("/api", apiRoutes);


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
