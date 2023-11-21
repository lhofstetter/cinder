import express from "express";
import { auth } from "../lucia.js";
import { LuciaError } from "lucia";
import { getUrlForImage } from "../utils/imageUpload.js";
export const authHandler = express.Router();
authHandler.post("/signup", async (req, res) => {
    const { username, password, phone_number } = req.body;
    let image_url;
    if (req.files?.file) {
        const file = req.files?.file;
        image_url = await getUrlForImage(file.data, file.name);
    }
    // basic check
    if (typeof username !== "string" || username.length < 4 || username.length > 31) {
        return res.status(400).send("Invalid username");
    }
    if (typeof password !== "string" || password.length < 6 || password.length > 255) {
        return res.status(400).send("Invalid password");
    }
    try {
        const user = await auth.createUser({
            key: {
                providerId: "username",
                providerUserId: username.toLowerCase(),
                password, // hashed by Lucia
            },
            attributes: {
                username,
                phone_number,
                profile_pic: image_url ??
                    "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
            },
        });
        const session = await auth.createSession({
            userId: user.userId,
            attributes: {},
        });
        const authRequest = auth.handleRequest(req, res);
        authRequest.setSession(session);
        // redirect to profile page
        return res.status(200).send("OK");
    }
    catch (e) {
        // this part depends on the database you're using
        // check for unique constraint error in user table
        if (e?.code === "SQLITE_CONSTRAINT") {
            console.error(e);
            return res.status(400).send("Username already taken");
        }
        console.error(e);
        return res.status(500).send("An unknown error occurred");
    }
});
authHandler.post("/login", async (req, res) => {
    const { username, password } = req.body;
    // basic check
    if (typeof username !== "string" || username.length < 1 || username.length > 31) {
        return res.status(400).send("Invalid username");
    }
    if (typeof password !== "string" || password.length < 1 || password.length > 255) {
        return res.status(400).send("Invalid password");
    }
    try {
        // find user by key
        // and validate password
        const key = await auth.useKey("username", username.toLowerCase(), password);
        const session = await auth.createSession({
            userId: key.userId,
            attributes: {},
        });
        const authRequest = auth.handleRequest(req, res);
        authRequest.setSession(session);
        return res.status(200).send("OK");
    }
    catch (e) {
        // check for unique constraint error in user table
        if (e instanceof LuciaError && (e.message === "AUTH_INVALID_KEY_ID" || e.message === "AUTH_INVALID_PASSWORD")) {
            // user does not exist
            // or invalid password
            return res.status(400).send("Incorrect username or password");
        }
        return res.status(500).send("An unknown error occurred");
    }
});
authHandler.post("/logout", async (req, res) => {
    const authRequest = auth.handleRequest(req, res);
    const session = await authRequest.validate(); // or `authRequest.validateBearerToken()`
    if (!session) {
        return res.sendStatus(401);
    }
    await auth.invalidateSession(session.sessionId);
    authRequest.setSession(null); // for session cookie
    return res.status(200).send("OK");
});
