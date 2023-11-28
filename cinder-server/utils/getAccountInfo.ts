import { db } from "../db/index.ts";
import { listings, user } from "../db/schema.ts";
import { eq } from "drizzle-orm";
import { getListingData } from "./getListing.ts";

export async function getAccountInfo(account_id: string) {
  const [accountInfo] = await db.select().from(user).where(eq(user.id, account_id));
  if (accountInfo === undefined) {
    throw new Error(`No users with the user id ${account_id} exists`);
  }

  const owned_listings_ids = (
    await db.select({ listing_id: listings.id }).from(listings).where(eq(listings.owner_id, account_id))
  ).map((entry) => entry.listing_id);

  const owned_listing_info_promises = [];
  for (const listing_id of owned_listings_ids) {
    owned_listing_info_promises.push(getListingData(listing_id));
  }

  const owned_listings: ListingData[] = await Promise.all(owned_listing_info_promises);

  return { ...accountInfo, owned_listings };
}
