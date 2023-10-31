import axios from "axios";
import { listings, Listing, images, Image } from "./db/schema";
import { db } from "./db";
import express, { Request, Response } from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
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
        <label>
            Descrption
            <input type="text" name="description" />
        </label>
        <label>
            Price
            <input type="number" name="price" />
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
  res.send(listingsFromDb);
});

app.post("/echoimage", async (req: Request, res: Response) => {
  res.send(req.files);
});

type Category = "top" | "bottom" | "accessory" | "shoes";
interface ListingFormData {
  listing_name: string;
  price?: string;
  description: string;
  category: Category;
}

/**
 * Creates a listing for an item of clothing to be published on cinder
 *
 * @route POST /listing
 * @param {file: Binary, listing_name: string, price?: number, description: string, category: Category} reqBody
 * @returns {JSON} - status 200 or 500 with JSON containing either {"message"": "OK"} or an error
 */
app.post("/listing", async (req: Request, res: Response) => {
  // Extract the images from the request
  try {
    const imageUrlPromises = [];
    for (const file of req.files?.file as { data: Buffer; name: string }[]) {
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

    for (const url of imageUrls) {
      await db.insert(images).values({ listing_id: inserted_id, source: url });
    }

    return res.status(200).json({ message: "OK" });
  } catch (error) {
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
