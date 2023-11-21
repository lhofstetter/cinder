import axios, { AxiosError } from "axios";
import dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envFilePath = path.resolve(__dirname, "../.env");
dotenv.config({ path: envFilePath });
const CLIENT_ID = process.env.CLIENT_ID;
if (CLIENT_ID === undefined) {
    console.log("[ERROR]: Please include CLIENT_ID in the .env");
    process.exit(1);
}
/**
 * Gets the url for the provided image after it has been uploaded
 *
 * @param name - The name of the image
 * @param image - The binary of the image data
 * @returns - The url of the image
 */
export async function getUrlForImage(image, name) {
    const apiRes = await uploadImage(image, name);
    if (apiRes instanceof AxiosError) {
        return undefined;
    }
    return apiRes?.data?.data?.link;
}
/**
 * Uploads an image to imgur
 *
 * @param name - The name of the image
 * @param  image - The binary of the image data
 */
export async function uploadImage(image, name) {
    let formatted_image;
    if (!(name.includes(".jpg") || name.includes(".jpeg"))) {
        formatted_image = await sharp(image).toFormat("jpeg").toArray();
    }
    const formdata = new FormData();
    formdata.append("image", new Blob(formatted_image ?? Array(image)), name);
    return await axios.post("https://api.imgur.com/3/upload", formdata, {
        headers: {
            Authorization: `Client-ID ${CLIENT_ID}`,
            "Content-Type": "multipart/form-data",
            Expect: "100-continue",
        },
    });
}
