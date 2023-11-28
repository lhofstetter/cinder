import { and, eq, inArray } from "drizzle-orm";
import express from "express";

import { db } from "../db/index.ts";
import { likes, listings } from "../db/schema.ts";
import { auth } from "../lucia.ts";
import { getAccountInfo } from "../utils/getAccountInfo.ts";
import { getListingData } from "../utils/getListing.ts";
import { validateListingId } from "../utils/listingValidation.ts";
import { match } from "assert";

export const matchHandler = express.Router();
matchHandler.get("/", async (req, res) => {
  try {
    const authRequest = auth.handleRequest(req, res);
    const session = await authRequest.validate(); // or `authRequest.validateBearerToken()`
    if (!session) {
      return res.sendStatus(401);
    }

    const your_user_id: string = session.user.userId;

    // Get the ids for the accounts who have liked one of the requester's
    // listings
    const usersWhoLikedYourListings: string[] = (
      await db
        .selectDistinct({ account_id: likes.account_id })
        .from(likes)
        .where(and(eq(likes.listing_owner_id, your_user_id), eq(likes.like, true)))
    ).map((entry) => entry.account_id);

    if (usersWhoLikedYourListings.length === 0) {
      return res.json({ message: "You have no matches" });
    }

    // Entries of likes table where the requester liked a listing owned by
    // someone who has liked one of their listings
    const yourMatchEntries = await db
      .select()
      .from(likes)
      .where(
        and(
          eq(likes.account_id, your_user_id),
          and(eq(likes.like, true), inArray(likes.listing_owner_id, usersWhoLikedYourListings)),
        ),
      );

    if (yourMatchEntries.length === 0) {
      return res.json({ message: "You have no matches" });
    }

    // Entries of likes table where a user who owns a listing you lave liked,
    // liked one of your listings
    const theirMatchEntries = await db
      .select()
      .from(likes)
      .where(
        and(
          and(eq(likes.like, true), inArray(likes.account_id, usersWhoLikedYourListings)),
          eq(likes.listing_owner_id, your_user_id),
        ),
      );

    if (theirMatchEntries.length === 0) {
      return res.json({ message: "You have no matches" });
    }

    const matchInfo = {};

    for (const entry of yourMatchEntries) {
      if (matchInfo[entry.listing_owner_id] === undefined) {
        matchInfo[entry.listing_owner_id] = { listings_you_have_liked: [] };
      }
      matchInfo[entry.listing_owner_id]["listings_you_have_liked"].push(entry.listing_id);
    }

    for (const account_id of Object.keys(matchInfo)) {
      const listings_they_have_liked = theirMatchEntries
        .filter((like) => like.account_id === account_id)
        .map((like) => like.listing_id);
      matchInfo[account_id]["listings_they_have_liked"] = listings_they_have_liked;
    }

    for (const account_id of Object.keys(matchInfo)) {
      const listings_you_have_liked = [];
      for (const listing_id of matchInfo[account_id].listings_you_have_liked) {
        listings_you_have_liked.push(await getListingData(listing_id));
      }
      matchInfo[account_id].listings_you_have_liked = listings_you_have_liked;

      const listings_they_have_liked = [];
      for (const listing_id of matchInfo[account_id].listings_they_have_liked) {
        listings_they_have_liked.push(await getListingData(listing_id));
      }
      matchInfo[account_id].listings_they_have_liked = listings_they_have_liked;

      matchInfo[account_id].their_account_info = await getAccountInfo(account_id);
    }

    return res.json(matchInfo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: String(error) });
  }
});

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

async function getMatches(account_id: string, owner_id: string) {
  return await db
    .select({ listing_id: likes.listing_id })
    .from(likes)
    .where(and(eq(likes.like, true), and(eq(likes.account_id, owner_id), eq(likes.listing_owner_id, account_id))));
}
