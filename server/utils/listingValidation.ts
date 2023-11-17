import { Request, Response } from "express";

export function validateListingId(req: Request, res: Response, next: () => void) {
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
