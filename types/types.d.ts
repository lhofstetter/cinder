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
  price?: number;
  category: Category;
  created_at: string;
  tags?: string[];
  image_links: string[];
}

/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("./server/lucia.js").Auth;
  type DatabaseUserAttributes = {
    username: string;
  };
  type DatabaseSessionAttributes = {};
}
