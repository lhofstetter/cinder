import axios from "axios";
import { listings, images, tags } from "./db/schema";
import { db } from "./db";
import express, { Request, Response } from "express";
import cors from "cors";
import fileUpload, { UploadedFile } from "express-fileupload";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";
import * as path from "path";

const envFilePath = path.resolve(__dirname, "../.env");
dotenv.config({ path: envFilePath });

const CLIENT_ID = process.env.CLIENT_ID;
if (CLIENT_ID === undefined) {
  console.log("[ERROR]: Please include CLIENT_ID in the .env");
  process.exit(1);
}

const app = express();

app.use(cors(), fileUpload());

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
        <label> Descrption
            <input type="text" name="description" />
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
 * Deletes a specified listing from the database
 *
 * @param {number} listing_id - The id of the listing you want to delete
 * @returns {JSON} - 200 { "message": "OK" } or 500 { "error": "some error" }
 */
app.delete("/listing/:listing_id", validateListingId, async (req: Request, res: Response) => {
  let { listing_id: listing_id_string } = req.params;
  const listing_id = parseInt(listing_id_string);
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
  const listing_id = parseInt(listing_id_string);
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
 * @param {Buffer|Buffer[]} reqBody.file - The binary of the image(s) of the listing
 * @param {string} reqBody.listing_name - The name of the listing
 * @param {string} reqBody.description - The description for the listing
 * @param {undefined|number} reqBody.price - The price for the listing (optional)
 * @param {Category} reqBody.category - The category of the listing (top, bottom, shoes, or accessory)
 * @param {undefined|string|string[]} reqBody.tags - The user provided tag(s) corresponding to the listing (optional)
 * @returns {JSON} - status 200, 400, 500 with JSON containing either {"message"": "OK"} or an error
 */
app.post("/listing", async (req: Request, res: Response) => {
  // Extract the images from the request
  try {
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

    // Update DB
    const [{ inserted_id }] = await db
      .insert(listings)
      .values({
        listing_name: listingFormData.listing_name,
        category: listingFormData.category,
        price: Number(listingFormData.price),
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
  } catch (error) {
    console.log(error);
    return res.status((error as any)?.status ?? 500).json({ error });
  }
});

app.listen(3000, () => console.log("Server started on port 3000"));

/**
 * Gets the url for the provided image after it has been uploaded
 *
 * @param {string} name - The name of the image
 * @param {Buffer} image - The binary of the image data
 * @returns {string} - The url of the image
 */
async function getUrlForImage(image: Buffer, name: string) {
  const apiRes = await uploadImage(image, name);
  return apiRes.data?.data?.link as string;
}

/**
 * Uploads an image to imgur
 *
 * @param {string} name - The name of the image
 * @param {Buffer} image - The binary of the image data
 * @returns {AxiosResponse | AxiosError}
 */
async function uploadImage(image: Buffer, name: string) {
  return await axios.post(
    "https://api.imgur.com/3/image",
    { image: image.toString("base64"), name },
    { headers: { Authorization: `Client-ID ${CLIENT_ID}` } },
  );
}

function validateListingId(req: Request, res: Response, next: () => void) {
  const { listing_id: unsafe_listing_id } = req.params;

  if (!unsafe_listing_id) {
    return res.status(400).json({ error: "Please provide a listing_id" });
  }

  const listing_id = parseInt(unsafe_listing_id);

  if (isNaN(listing_id)) {
    return res.status(400).json({ error: "Please provide a valid numeric listing_id" });
  }

  // Store the validated listing_id in the request object for later use
  req.params.listing_id = String(listing_id);
  next();
}
