export type Availability = "in_stock" | "out_of_stock" | "expected";

export type ProductSort = "popular" | "price_asc" | "price_desc" | "name_asc" | "name_desc";

export type CatalogView = "grid" | "list";

export type Brand = {
  id: number;
  slug: string;
  name: string;
};

export type CategoryShort = {
  id: number;
  slug: string;
  name: string;
};

export type Category = CategoryShort & {
  products_count: number;
};

export type ProductImage = {
  id: number;
  url: string;
  sort_order: number;
};

export type ProductSpec = {
  attribute_id: number;
  group: string;
  name: string;
  value: string;
};

export type ProductCardData = {
  id: number;
  slug: string;
  name: string;
  category: CategoryShort;
  brand: Brand | null;
  highlights: string[];
  price: string;
  old_price: string | null;
  discount_percent: number | null;
  availability: Availability;
  is_hit: boolean;
  image_url: string | null;
  rating: string | null;
  reviews_count: number;
};

export type Product = ProductCardData & {
  sku: string | null;
  short_description: string | null;
  description: string | null;
  images: ProductImage[];
  specs: ProductSpec[];
};

export type ProductList = {
  products: ProductCardData[];
  total: number;
};

export type SitemapEntry = {
  slug: string;
  updated_at: string;
};

export type Review = {
  id: number;
  author_name: string;
  rating: number;
  text: string;
  created_at: string;
};

export type ReviewList = {
  reviews: Review[];
  total: number;
};

export type AttributeFilter = {
  id: number;
  group: string;
  name: string;
  values: string[];
};

export type CatalogFilters = {
  price_min: string | null;
  price_max: string | null;
  brands: Brand[];
  attributes: AttributeFilter[];
};
