export type Availability = "in_stock" | "out_of_stock" | "expected";

export type CartBrand = {
  id: number;
  slug: string;
  name: string;
};

export type CartProduct = {
  id: number;
  slug: string;
  name: string;
  brand: CartBrand | null;
  highlights: string[];
  price: string;
  old_price: string | null;
  availability: Availability;
  image_url: string | null;
};

export type CartItem = {
  product: CartProduct;
  quantity: number;
  subtotal: string;
};

export type Cart = {
  items: CartItem[];
  total_quantity: number;
  total: string;
};

export const EMPTY_CART: Cart = { items: [], total_quantity: 0, total: "0" };
