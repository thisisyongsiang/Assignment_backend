import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import * as shop from './shop.js';

let app=express();
app.use(cors());
app.use(bodyParser.json());
app.use(shop.router);
app.listen(4200);

console.log("listening on port 4200");