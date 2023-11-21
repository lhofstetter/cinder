import express from "express";
import { db } from "../db/index.js";
import { likes, listings } from "../db/schema.js";
import { auth } from "../lucia.js";
import { validateListingId } from "../utils/listingValidation.js";
import { and, eq } from "drizzle-orm";
export const matchHandler = express.Router();
matchHandler.post("/like/:listing_id", validateListingId, async (req, res) => {
    try {
        let { listing_id: listing_id_string } = req.params;
        const listing_id = parseInt(listing_id_string);
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
        }
        else {
            return res.status(401).json("No session cookie found. Please sign in");
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An unexpected error occurred", error: String(error) });
    }
});
matchHandler.post("/dislike/:listing_id", validateListingId, async (req, res) => {
    try {
        let { listing_id: listing_id_string } = req.params;
        const listing_id = parseInt(listing_id_string);
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
        }
        else {
            return res.status(401).json("No session cookie found. Please sign in");
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An unexpected error occurred", error: String(error) });
    }
});
async function getMatches(account_id, owner_id) {
    return await db
        .select({ listing_id: likes.listing_id })
        .from(likes)
        .where(and(eq(likes.like, true), and(eq(likes.account_id, owner_id), eq(likes.listing_owner_id, account_id))));
}
