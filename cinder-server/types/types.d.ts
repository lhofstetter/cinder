declare type Category = "top" | "bottom" | "accessory" | "shoes";

declare type Size = "XXS" | "XS" | "S" | "M" | "L" | "XL" | "2XL" | "2XL";

declare interface ListingFormData {
  listing_name: string;
  description: string;
  category: Category;
  tags?: string | string[];
  size?: Size;
  waist?: number; // EX: 30
  inseam?: number; // EX: 29
}

declare interface ListingData {
  id: number;
  listing_name: string;
  description: string;
  size?: Size;
  waist?: number; // EX: 30
  inseam?: number; // EX: 29
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

declare interface ListingsFilterData {
  sizes: Size[];
  waist_sizes: number[];
  inseam_lengths: number[];
  categories: Category[];
  tags: string[];
}
