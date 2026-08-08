export type Category =
  | "sunscreen"
  | "deodorant"
  | "protein"
  | "skincare"
  | "hair"
  | "oral"
  | "electrolytes"
  | "supplements";

export type Brand = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  story: string;
  location: string;
  founded: number;
  categories: Category[];
  accent: string;
  rating: number;
  reviewCount: number;
  followerCount: number;
};

export type Product = {
  id: string;
  slug: string;
  brandId: string;
  name: string;
  category: Category;
  price: number;
  description: string;
  ingredients: string[];
  freeFrom: string[];
  rating: number;
  reviewCount: number;
  accent: string;
  badge?: string;
  imageUrl?: string;
  /** Username of who placed this direct listing */
  placedBy?: string;
};

export type Review = {
  id: string;
  productId?: string;
  brandId?: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  helpful: number;
  daysAgo: number;
};

export type CommunityPost = {
  id: string;
  author: string;
  topic: string;
  title: string;
  body: string;
  replies: number;
  likes: number;
  hoursAgo: number;
  tags: string[];
};
