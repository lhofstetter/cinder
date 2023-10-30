import { listings, Listing } from "./db/schema";
import { db } from "./db";
import express, { Request, Response } from "express";
import cors from "cors";
import fileUpload from "express-fileupload";

const app = express();

app.use(cors(), fileUpload());

app.get("/recommended", async (req: Request, res: Response) => {
  const listingsFromDb = await db.select().from(listings);
  res.send(listingsFromDb);
});

app.post("/echoimage", async (req: Request, res: Response) => {
  res.send(req.files);
});

app.listen(3000, () => console.log("Server started on port 3000"));
