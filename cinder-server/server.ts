import cors from "cors";
import { and, eq, inArray, not, or } from "drizzle-orm";
import express, { Request, Response } from "express";
import fileUpload, { UploadedFile } from "express-fileupload";

import { db } from "./db/index.ts";
import { images, listings, tags } from "./db/schema.ts";
import { auth } from "./lucia.ts";
import { authHandler } from "./routers/auth.ts";
import { matchHandler } from "./routers/match.ts";
import { getUrlForImage } from "./utils/imageUpload.ts";
import { validateListingId } from "./utils/listingValidation.ts";
import { getListingData } from "./utils/getListing.ts";
import { getAccountInfo } from "./utils/getAccountInfo.ts";

const SIZE_OPTIONS = ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL"];
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
    <h2>Create a listing</h2>
    <form action="/listing" enctype="multipart/form-data" method="post" >
      <div style="display: flex; flex-direction: column;">Select a file: 
        <input type="file" name="file" multiple="multiple" />
        <div>
            <label for="listing_name">Listing Name</label>
            <input type="text" id="listing_name" name="listing_name" />
        </div>
        <label> Descrption <input type="text" name="description" />
        </label>
        <label>
            Waist
            <input type="number" name="waist" />
        </label>
        <label>
            Inseam
            <input type="number" name="inseam" />
        </label>
        <label>
          Enter tags
          <input type="text" name="tags" value="tags1"/> <input type="text" name="tags" value="tags2"/>
          <input type="text" name="tags" value="tags3"/>
          <input type="text" name="tags" value="tags4"/>
        </label>
        <fieldset>
          <legend>Select the size of the piece:</legend>
          <div>
            <input type="radio" id="S" name="size" value="S" />
            <label for="S">S</label>

            <input type="radio" id="M" name="size" value="M" />
            <label for="M">M</label>

            <input type="radio" id="L" name="size" value="L" />
            <label for="L">L</label>
          </div>
          <div>
        </fieldset>
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

  <h2> Sign up </h2>
    <form action="/auth/signup" enctype="multipart/form-data" method="post" >
      <div style="display: flex; flex-direction: column;">Select a profile picture: 
        <input type="file" name="file" />
        username:
        <input type="text" name="username" />
        password:
        <input type="password" name="password" />
        phone number:
        <input type="text" name="phone_number" />
        class year:
        <input type="number" name="class_year" />
        bio:
        <input type="text" name="bio" />
        <input type="submit" value="sign up" />
      </div>
    </form>
  <h2> Login </h2>
    <form action="/auth/login" enctype="multipart/form-data" method="post" >
        username:
        <input type="text" name="username" />
        password:
        <input type="password" name="password" />
        <input type="submit" value="login" />
    </form>
  <h2> Like </h2>
    <form action="/match/like/6" enctype="multipart/form-data" method="post" >
        <input type="submit" value="like listing 6" />
    </form>
    <form action="/match/like/5" enctype="multipart/form-data" method="post" >
        <input type="submit" value="like listing 5" />
    </form>
    <form action="/match/like/7" enctype="multipart/form-data" method="post" >
        <input type="submit" value="like listing 7" />
    </form>

  `);
});

app.get("/recommended", async (req: Request, res: Response) => {
  const listingsFromDb = await db.select().from(listings);
  res.json(listingsFromDb);
});

/**
 * Returns listings matching your specified filters
 *
 * @route POST /filtered-listings
 * @param {ListingsFilterData} req.body
 */
app.post("/filtered-listings", async (req: Request, res: Response) => {
  try {
    const authRequest = auth.handleRequest(req, res);
    const session = await authRequest.validate(); // or `authRequest.validateBearerToken()`
    if (!session) {
      return res.sendStatus(401);
    }

    const user_id: string = session.user.userId;
    const filterData: ListingsFilterData = req.body;
    if (
      !Array.isArray(filterData.tags) ||
      !Array.isArray(filterData.waist_sizes) ||
      !Array.isArray(filterData.inseam_lengths) ||
      !Array.isArray(filterData.sizes) ||
      !Array.isArray(filterData.categories)
    ) {
      return res.status(400).json({
        error:
          "Please provide valid values for all fields: tags, waist_sizes, inseam_lengths, sizes, and categories. " +
          "If you wish to not specify one or more of these fields for your search, just assign an empty array to that" +
          " field's value'",
      });
    }

    // If no filters are selected, retrun all listing data
    if (
      filterData.sizes.length === 0 &&
      filterData.waist_sizes.length === 0 &&
      filterData.inseam_lengths.length === 0 &&
      filterData.categories.length === 0 &&
      filterData.tags.length === 0
    ) {
      const allListingIdsQuery = await db
        .select({ listing_id: listings.id })
        .from(listings)
        .where(not(eq(listings.owner_id, user_id)));
      const allListingIds = allListingIdsQuery.map((entry) => entry.listing_id);
      const listingInfoPromises = [];
      for (const listing_id of allListingIds) {
        listingInfoPromises.push(getListingData(listing_id));
      }
      const allListings: ListingData[] = await Promise.all(listingInfoPromises);
      return res.json(allListings);
    }

    const matchingListingIds = [];

    let listingsTableOrSubQuery: any = db
      .select()
      .from(listings)
      .where(not(eq(listings.owner_id, user_id)));
    let listingsIdsWithTag: number[] = [];
    if (filterData.tags.length > 0) {
      const listingsWithTagQuery = await db
        .selectDistinct({ listing_id: tags.listing_id })
        .from(tags)
        .where(inArray(tags.tag_name, filterData.tags));
      listingsIdsWithTag = listingsWithTagQuery.map((entry) => entry.listing_id);
      if (listingsIdsWithTag.length > 0) {
        listingsTableOrSubQuery = db
          .select()
          .from(listings)
          .where(and(inArray(listings.id, listingsIdsWithTag), not(eq(listings.owner_id, user_id))))
          .as("sq");
      }
    }

    const nonBottomCategories = filterData.categories.filter((category) => category !== "bottom");

    if (filterData.sizes.length > 0) {
      const matchingSizedListings = await db
        .select({ listing_id: listingsTableOrSubQuery.id })
        .from(listingsTableOrSubQuery)
        .where(
          and(
            inArray(listingsTableOrSubQuery.size, filterData.sizes),
            inArray(listingsTableOrSubQuery.category, nonBottomCategories),
          ),
        );
      matchingListingIds.push(...matchingSizedListings.map((entry) => entry.listing_id));
    } else if (nonBottomCategories.length > 0) {
      const matchingNonSizeSpecificListings = await db
        .select({ listing_id: listingsTableOrSubQuery.id })
        .from(listingsTableOrSubQuery)
        .where(inArray(listingsTableOrSubQuery.category, nonBottomCategories));
      matchingListingIds.push(...matchingNonSizeSpecificListings.map((entry) => entry.listing_id));
    }
    if (filterData.categories.includes("bottom")) {
      const matchingBottoms = await queryBottoms(filterData, listingsIdsWithTag, user_id);
      matchingListingIds.push(...matchingBottoms.map((entry) => entry.listing_id));
    }

    const listingInfoPromises = [];
    for (const listing_id of matchingListingIds) {
      listingInfoPromises.push(getListingData(listing_id));
    }
    const matchingListings: ListingData[] = await Promise.all(listingInfoPromises);
    return res.json(matchingListings);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: String(error) });
  }
});

async function queryBottoms(filterData: ListingsFilterData, listingsIdsWithTag: number[], user_id: string) {
  const listingsTableOrSubQuery =
    filterData.tags.length > 0
      ? db
          .select()
          .from(listings)
          .where(
            and(
              and(inArray(listings.id, listingsIdsWithTag), eq(listings.category, "bottom")),
              not(eq(listings.owner_id, user_id)),
            ),
          )
          .as("sq")
      : db
          .select()
          .from(listings)
          .where(and(eq(listings.category, "bottom"), not(eq(listings.owner_id, user_id))))
          .as("bottoms");
  if (filterData.waist_sizes.length > 0 && filterData.inseam_lengths.length > 0 && filterData.sizes.length > 0) {
    return await db
      .select({ listing_id: listingsTableOrSubQuery.id })
      .from(listingsTableOrSubQuery)
      .where(
        or(
          or(
            inArray(listingsTableOrSubQuery.waist, filterData.waist_sizes),
            inArray(listingsTableOrSubQuery.inseam, filterData.inseam_lengths),
          ),
          inArray(listingsTableOrSubQuery.size, filterData.sizes),
        ),
      );
  } else if (filterData.waist_sizes.length > 0 && filterData.sizes.length > 0) {
    return await db
      .select({ listing_id: listingsTableOrSubQuery.id })
      .from(listingsTableOrSubQuery)
      .where(
        or(
          inArray(listingsTableOrSubQuery.waist, filterData.waist_sizes),
          inArray(listingsTableOrSubQuery.size, filterData.sizes),
        ),
      );
  } else if (filterData.inseam_lengths.length > 0 && filterData.sizes.length > 0) {
    return await db
      .select({ listing_id: listingsTableOrSubQuery.id })
      .from(listingsTableOrSubQuery)
      .where(
        or(
          inArray(listingsTableOrSubQuery.inseam, filterData.inseam_lengths),
          inArray(listingsTableOrSubQuery.size, filterData.sizes),
        ),
      );
  } else if (filterData.inseam_lengths.length > 0 && filterData.waist_sizes.length > 0) {
    return await db
      .select({ listing_id: listingsTableOrSubQuery.id })
      .from(listingsTableOrSubQuery)
      .where(
        or(
          inArray(listingsTableOrSubQuery.inseam, filterData.inseam_lengths),
          inArray(listingsTableOrSubQuery.waist, filterData.waist_sizes),
        ),
      );
  } else if (filterData.inseam_lengths.length > 0) {
    return await db
      .select({ listing_id: listingsTableOrSubQuery.id })
      .from(listingsTableOrSubQuery)
      .where(inArray(listingsTableOrSubQuery.inseam, filterData.inseam_lengths));
  } else if (filterData.waist_sizes.length > 0) {
    return await db
      .select({ listing_id: listingsTableOrSubQuery.id })
      .from(listingsTableOrSubQuery)
      .where(inArray(listingsTableOrSubQuery.waist, filterData.waist_sizes));
  } else if (filterData.sizes.length > 0) {
    return await db
      .select({ listing_id: listingsTableOrSubQuery.id })
      .from(listingsTableOrSubQuery)
      .where(inArray(listingsTableOrSubQuery.size, filterData.sizes));
  } else {
    return await db.select({ listing_id: listingsTableOrSubQuery.id }).from(listingsTableOrSubQuery);
  }
}

/**
 * Updates a listing for an item of clothing to be published on cinder
 *
 * @route PUT /listing/:listing_id
 * @param {Object} reqBody - The body of the request
 * @param {Buffer|Buffer[]} reqBody.file - The binary of the image(s) of the
 *     listing
 * @param {string} reqBody.listing_name - The name of the listing
 * @param {string} reqBody.description - The description for the listing
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
 * @param {number} reqBody.waist - The length of the waist of bottoms
 * @param {number} reqBody.inseam - The length of the inseam of bottoms
 * @param {Size} reqBody.size - The size of a clothing item
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

      // Validate info for sizing
      if (listingFormData.category === "top") {
        if (listingFormData.size === undefined) {
          return res.status(400).json({ message: "Please include a size for tops" });
        } else if (!SIZE_OPTIONS.includes(listingFormData.size)) {
          return res.status(400).json({
            message: "Please include a valid size for tops, accepted values inlcude XXS, XS, S, M, L, XL, 2XL, and 3XL",
          });
        }
      }

      if (listingFormData.category !== "bottom") {
        if (+listingFormData.waist > 0 || +listingFormData.inseam > 0) {
          return res.status(400).json({ message: "Only bottoms can have a waist or an inseam" });
        }
        listingFormData.waist = undefined;
        listingFormData.inseam = undefined;
      }

      const owner_id = session.user.userId;
      // Update DB
      const [{ inserted_id }]: any = await db
        .insert(listings)
        .values({
          listing_name: listingFormData.listing_name,
          owner_id,
          category: listingFormData.category,
          description: listingFormData.description,
          inseam: listingFormData.inseam ? Number(listingFormData.inseam) : undefined,
          waist: listingFormData.waist ? Number(listingFormData.waist) : undefined,
          size: listingFormData.size ? (listingFormData.size as any) : undefined,
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

app.get("/account", async (req: Request, res: Response) => {
  const authRequest = auth.handleRequest(req, res);
  const session = await authRequest.validate(); // or `authRequest.validateBearerToken()`
  if (!session) {
    return res.sendStatus(401);
  }

  const your_user_id: string = session.user.userId;

  try {
    return res.json(await getAccountInfo(your_user_id));
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: String(error) });
  }
});

/**
 * Gets the data for a particular user_id
 *
 * @route GET /user/:user_id
 * @param {string} user_id - The id for the user you want data for
 * @returns {}
 */
app.get("/account/:account_id", async (req: Request, res: Response) => {
  let { account_id } = req.params;

  try {
    return res.json(await getAccountInfo(account_id));
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: String(error) });
  }
});

app.listen(3000, () => console.log("Server started on port 3000"));
