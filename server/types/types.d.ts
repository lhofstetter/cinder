declare type Category = "top" | "bottom" | "accessory" | "shoes";

declare interface ListingFormData {
  listing_name: string;
  price?: string;
  description: string;
  category: Category;
  tags?: string | string[];
}

declare interface ListingData {
  id: number;
  listing_name: string;
  description: string;
  category: Category;
  created_at: string;
  tags?: string[];
  image_links: string[];
}

/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("../lucia.js").Auth;
  type DatabaseUserAttributes = {
    username: string;
    profile_pic: string;
    phone_number: string;
  };
  type DatabaseSessionAttributes = {};
}
