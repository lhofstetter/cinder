import cors from "cors";
import { and, eq } from "drizzle-orm";
import express, { Request, Response } from "express";
import fileUpload, { UploadedFile } from "express-fileupload";

import { db } from "./db/index.js";
import { images, listings, tags } from "./db/schema.js";
import { authHandler } from "./routers/auth.js";
import { matchHandler } from "./routers/match.js";
import { getUrlForImage } from "./utils/imageUpload.js";
import { validateListingId } from "./utils/listingValidation.js";
import { auth } from "./lucia.js";

const app = express();

app.use(cors(), fileUpload());
app.use(express.json());
app.use(express.urlencoded());
app.use("/auth", authHandler);
app.use("/match", matchHandler);

// This route is temporary
// Can be used to test POST /listing
// Will delete once creating a listing is implemented on frontend
app.get("/", (req, res) => {
  res.send(`
    <h2>Create a listing</h2> <form action="/listing" enctype="multipart/form-data" method="post" >
      <div style="display: flex; flex-direction: column;">Select a file: 
        <input type="file" name="file" multiple="multiple" />
        <div>
            <label for="listing_name">Listing Name</label>
            <input type="text" id="listing_name" name="listing_name" />
        </div>
        <label> Descrption <input type="text" name="description" />
        </label>
        <label>
            Price
            <input type="number" name="price" />
        </label>
        <label>
          Enter tags
          <input type="text" name="tags" value="tags1"/> <input type="text" name="tags" value="tags2"/>
          <input type="text" name="tags" value="tags3"/>
          <input type="text" name="tags" value="tags4"/>
        </label>
        <fieldset>
          <legend>Select the category of clothes:</legend>
          <div>
            <input type="radio" id="top" name="category" value="top" />
            <label for="top">Top</label>

            <input type="radio" id="bottom" name="category" value="bottom" />
            <label for="bottom">Bottom</label>

            <input type="radio" id="accessory" name="category" value="accessory" />
            <label for="accessory">Accessory</label>

            <input type="radio" id="shoes" name="category" value="shoes" />
            <label for="shoes">Shoes</label>
          </div>
          <div>
        </fieldset>
      </div>
      <input type="submit" value="Upload" />
    </form>

  `);
});

app.get("/recommended", async (req: Request, res: Response) => {
  const listingsFromDb = await db.select().from(listings);
  res.json(listingsFromDb);
});

/**
 * Updates a listing for an item of clothing to be published on cinder
 *
 * @route PUT /listing/:listing_id
 * @param {Object} reqBody - The body of the request
 * @param {Buffer|Buffer[]} reqBody.file - The binary of the image(s) of the
 *     listing
 * @param {string} reqBody.listing_name - The name of the listing
 * @param {string} reqBody.description - The description for the listing
 * @param {undefined|number} reqBody.price - The price for the listing
 *     (optional)
 * @param {Category} reqBody.category - The category of the listing (top,
 *     bottom, shoes, or accessory)
 * @param {undefined|string|string[]} reqBody.tags - The user provided tag(s)
 *     corresponding to the listing (optional)
 * @param {string[]} reqBody.tags_to_remove - The user provided tag(s)
 *     previously on the listing you are wanting to
 * remove
 * @param {string[]} reqBody.images_to_remove - The image url(s) previously for
 *     the listing you are wanting to remove
 * @returns {JSON} - status 200, 400, 500 with JSON containing
 *     either {"message"": "OK"} or an error
 */
app.put("/listing/:listing_id", validateListingId, async (req: Request, res: Response) => {
  try {
    let { listing_id: listing_id_string } = req.params;
    const listing_id = parseInt(listing_id_string as string);

    const imageUrlPromises = [];
    if (!req.files?.file) {
      return res.status(400).json({ error: "No image provided for listing" });
    }
    if (Array.isArray(req.files?.file)) {
      for (const file of req.files?.file as UploadedFile[]) {
        imageUrlPromises.push(getUrlForImage(file?.data, file?.name));
      }
    } else {
      const file = req.files?.file as UploadedFile;
      imageUrlPromises.push(getUrlForImage(file?.data, file?.name));
    }

    const { images_to_remove }: { images_to_remove: string[] } = req.body;
    const deleteQueue = [];
    for (const image_url of images_to_remove) {
      deleteQueue.push(db.delete(images).where(and(eq(images.source, image_url), eq(images.listing_id, listing_id))));
    }

    const { tags_to_remove }: { tags_to_remove: string[] } = req.body;
    for (const tag of tags_to_remove) {
      deleteQueue.push(db.delete(tags).where(and(eq(tags.tag_name, tag), eq(tags.listing_id, listing_id))));
    }

    const listingFormData: ListingFormData = req.body;

    await db
      .update(listings)
      .set({
        listing_name: listingFormData.listing_name,
        category: listingFormData.category,
        description: listingFormData.description,
      })
      .where(eq(listings.id, listing_id));
    await Promise.all(imageUrlPromises);
    await Promise.all(deleteQueue);
    return res.status(200).json({ message: "OK" });
  } catch (error) {
    console.log(error);
    return res.status((error as any)?.status ?? 500).json({
      error: String(error),
    });
  }
});

/**
 * Deletes a specified listing from the database
 *
 * @param {number} listing_id - The id of the listing you want to delete
 * @returns {JSON} - 200 { "message": "OK" } or 500 { "error": "some error" }
 */
app.delete("/listing/:listing_id", validateListingId, async (req: Request, res: Response) => {
  let { listing_id: listing_id_string } = req.params;
  const listing_id = parseInt(listing_id_string as string);
  try {
    const deleteQueue = [];
    deleteQueue.push(db.delete(images).where(eq(images.listing_id, listing_id)));
    deleteQueue.push(db.delete(tags).where(eq(tags.listing_id, listing_id)));
    await Promise.all(deleteQueue);
    await db.delete(listings).where(eq(listings.id, listing_id));
    return res.status(200).json({ message: "OK" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: String(error) });
  }
});

/**
 * Gets the data for a particular listing id
 *
 * @route GET /listing/:listing_id
 * @param {number} listing_id - The id for the listing you want data for
 * @returns {ListingData}
 */
app.get("/listing/:listing_id", validateListingId, async (req: Request, res: Response) => {
  let { listing_id: listing_id_string } = req.params;
  const listing_id = parseInt(listing_id_string as string);
  try {
    // Get the listing's data from the DB
    const listingDataFromDb = await db.select().from(listings).where(eq(listings.id, listing_id));
    const listingFromDb = listingDataFromDb["0"];
    if (listingFromDb === undefined) {
      return res.status(400).json({ error: "No listing with that id exists" });
    }

    const listingTagData = await db
      .select({ tag_name: tags.tag_name })
      .from(tags)
      .where(eq(tags.listing_id, listing_id));
    const listingTags: string[] = listingTagData.map((tagData) => tagData.tag_name);

    const listingImageData = await db
      .select({ source: images.source })
      .from(images)
      .where(eq(images.listing_id, listing_id));
    const listingImages: string[] = listingImageData.map((imageData) => imageData.source);

    const responseData = {
      ...listingFromDb,
      tags: listingTags,
      image_links: listingImages,
    };
    return res.status(200).json(responseData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: String(error) });
  }
});

/**
 * Creates a listing for an item of clothing to be published on cinder
 *
 * @route POST /listing
 * @param {Object} reqBody - The body of the request
 * @param {Buffer|Buffer[]} reqBody.file - The binary of the image(s) of the
 *     listing
 * @param {string} reqBody.listing_name - The name of the listing
 * @param {string} reqBody.description - The description for the listing
 * @param {undefined|number} reqBody.price - The price for the listing
 *     (optional)
 * @param {Category} reqBody.category - The category of the listing (top,
 *     bottom, shoes, or accessory)
 * @param {undefined|string|string[]} reqBody.tags - The user provided tag(s)
 *     corresponding to the listing (optional)
 * @returns {JSON} - status 200, 400, 500 with JSON containing
 *     either {"message"": "OK"} or an error
 */
app.post("/listing", async (req: Request, res: Response) => {
  // Extract the images from the request
  try {
    const authRequest = auth.handleRequest(req, res);
    const session = await authRequest.validate();
    if (session) {
      const imageUrlPromises = [];
      if (!req.files?.file) {
        return res.status(400).json({ error: "No image provided for listing" });
      }
      if (Array.isArray(req.files?.file)) {
        for (const file of req.files?.file as UploadedFile[]) {
          imageUrlPromises.push(getUrlForImage(file?.data, file?.name));
        }
      } else {
        const file = req.files?.file as UploadedFile;
        imageUrlPromises.push(getUrlForImage(file?.data, file?.name));
      }
      // Await reply with url links to each image
      const imageUrls: string[] = await Promise.all(imageUrlPromises);
      const listingFormData: ListingFormData = req.body;

      const owner_id = session.user.userId;
      // Update DB
      const [{ inserted_id }]: any = await db
        .insert(listings)
        .values({
          listing_name: listingFormData.listing_name,
          owner_id,
          category: listingFormData.category,
          description: listingFormData.description,
        })
        .returning({ inserted_id: listings.id });

      // Add images to images table
      for (const url of imageUrls) {
        await db.insert(images).values({ listing_id: inserted_id, source: url });
      }

      // Add tags to the tags table
      const { tags: userProvidedTags } = listingFormData;
      if (Array.isArray(userProvidedTags)) {
        for (const tag of userProvidedTags) {
          await db.insert(tags).values({ listing_id: inserted_id, tag_name: tag });
        }
      } else if (typeof userProvidedTags === "string") {
        await db.insert(tags).values({
          listing_id: inserted_id,
          tag_name: userProvidedTags,
        });
      }

      return res.status(200).json({ message: "OK" });
    }
    return res.status(401).json("No session cookie found. Please sign in");
  } catch (error) {
    console.log(error);
    return res.status((error as any)?.status ?? 500).json({
      error: String(error),
    });
  }
});

app.listen(3000, () => console.log("Server started on port 3000"));
