import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from './src/routes/user.routes.js'; // Ensure this path is correct
const app = express();


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use((req, res, next) => {
    console.log("Incoming request:");
    console.log("Method:", req.method);
    console.log("URL:", req.url);
    console.log("Headers:", req.headers);
    console.log("Body:", req.body); // This should show the parsed JSON
    next();
});

// Routes
app.use('/', router);

export default app;