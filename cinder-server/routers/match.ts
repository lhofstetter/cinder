import express from "express";
import { db } from "../db/index.js";
import { likes, listings, tags } from "../db/schema.js";
import { auth } from "../lucia.js";
import { validateListingId } from "../utils/listingValidation.js";
import { and, eq, inArray } from "drizzle-orm";

export const matchHandler = express.Router();
export const recHandler = express.Router();

matchHandler.post("/like/:listing_id", validateListingId, async (req, res) => {
  try {
    let { listing_id: listing_id_string } = req.params;
    const listing_id = parseInt(listing_id_string as string);
    const authRequest = auth.handleRequest(req, res);
    const session = await authRequest.validate();
    if (session) {
      const account_id = session.user.userId;
      const [{ listing_owner_id }] = await db
        .select({ listing_owner_id: listings.owner_id })
        .from(listings)
        .where(eq(listings.id, listing_id));
      await db.insert(likes).values({ account_id, listing_id, listing_owner_id, like: true });
      const matches = await getMatches(account_id, listing_owner_id);
      if (matches.length > 0) {
        const listings_matched = matches.map((entry) => entry.listing_id);
        res.json({ matches: listings_matched });
      }
      return res.json({ message: "Like logged successfully" });
    } else {
      return res.status(401).json("No session cookie found. Please sign in");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An unexpected error occurred", error: String(error) });
  }
});

matchHandler.post("/dislike/:listing_id", validateListingId, async (req, res) => {
  try {
    let { listing_id: listing_id_string } = req.params;
    const listing_id = parseInt(listing_id_string as string);
    const authRequest = auth.handleRequest(req, res);
    const session = await authRequest.validate();
    if (session) {
      const account_id = session.user.userId;
      const [{ listing_owner_id }] = await db
        .select({ listing_owner_id: listings.owner_id })
        .from(listings)
        .where(eq(listings.id, listing_id));
      await db.insert(likes).values({ account_id, listing_id, listing_owner_id, like: false });
      return res.json({ message: "Dislike logged successfully" });
    } else {
      return res.status(401).json("No session cookie found. Please sign in");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An unexpected error occurred", error: String(error) });
  }
});

recHandler.get("/recomend/:listing_id", validateListingId, async (req, res) => {
    try {
        let { user_id: user_id_string } = req.params;
        const authRequest = auth.handleRequest(req, res);
        const session = await authRequest.validate();
        if (session) { //Check if session is active
            const tags = await getTags(user_id_string)
            if (tags.length == 0) { //Check if no tags were retrieved
                return res.json({ message: "No tags were retrieved"});
            }
            const [{ recomend }] = await db
                .select({ listing_id: listings.listing_id})
                .from(listings)
                .where(inArray(tags.tag_name, tags),and(not(eq(user_id_string,likes.account_id))));
            return res.status(400).json({ data: recomend});
        }
        else {
            return res.status(401).json({ message: "No session cookie found. Please sign in"});
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An unexpected error occurred", error: String(error) });
    }
});

async function getMatches(account_id: string, owner_id: string) {
  return await db
    .select({ listing_id: likes.listing_id })
    .from(likes)
    .where(and(eq(likes.like, true), and(eq(likes.account_id, owner_id), eq(likes.listing_owner_id, account_id))));
}

//Retrieves the tags for the posts the user has liked
async function getTags(account_id){
    return await db
        .select({ tags_name: tags.tag_name})
        .from(tags)
        .where(eq(account_id, likes.account_id),and(eq(likes.like, true)),and(eq(listing.id, tags.listing_id)));
}
