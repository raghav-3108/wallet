
import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";
import transactionRoutes from "./routes/transactionRoutes.js"

const app = express();
dotenv.config();

app.use(express.json());

const port = process.env.PORT || 5001;

async function initDB() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS transactions(
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        category VARCHAR(255) NOT NULL,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE
      )
    `;
    console.log("Database initialization successful");
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
}


app.use("/api/transactions",transactionRoutes)


initDB().then(() => {
  app.listen(port, () => {
    console.log("App is running on port", port);
  });
});
