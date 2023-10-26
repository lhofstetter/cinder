import { listings, Listing } from "./db/schema";
import { db } from "./db";
import express, { Request, Response } from "express";

const app = express();

app.get("/recomended", async (req: Request, res: Response) => {
  const listingsFromDb = await db.select().from(listings);
  res.send(listingsFromDb);
});

app.listen(3000, () => console.log("Server started on port 3000"));
