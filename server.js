import './db.js'
import express from "express";
import cookieParser from "cookie-parser";

import router from "./router.js";
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use("/", router);


app.listen(3000, () => {
    console.log("server started");
});