import { db } from "../db/index.ts";
import { listings, images, tags } from "../db/schema.ts";
import { eq } from "drizzle-orm";

export async function getListingData(listing_id: number) {
  const listingDataFromDb = await db.select().from(listings).where(eq(listings.id, listing_id));
  const listingFromDb = listingDataFromDb["0"];
  if (listingFromDb === undefined) {
    throw new Error("No listing with that ID exists");
  }
  const listingTagData = await db.select({ tag_name: tags.tag_name }).from(tags).where(eq(tags.listing_id, listing_id));
  const listingTags: string[] = listingTagData.map((tagData) => tagData.tag_name);

  const listingImageData = await db
    .select({ source: images.source })
    .from(images)
    .where(eq(images.listing_id, listing_id));
  const listingImages: string[] = listingImageData.map((imageData) => imageData.source);

  return {
    ...listingFromDb,
    tags: listingTags,
    image_links: listingImages,
  };
}
