
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import { connectToDatabase } from "./db.js";
import userRouter from "./routes/user.route.js";
import projectRouter from "./routes/project.route.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const corsOptions = {

  
  origin: ["http://127.0.0.1:5501", "http://localhost:5501","http://127.0.0.1:5501/_service-worker.js"], 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, 
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions)); 


app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public"));

app.use("/user", userRouter);
app.use("/project", projectRouter);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = 5000;
connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(
      "Failed to connect to the database. Server not started.",
      err
    );
  });
