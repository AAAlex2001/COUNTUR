export type OrderStatus =
  | "new"
  | "confirmed"
  | "awaiting_payment"
  | "paid"
  | "shipped"
  | "completed"
  | "canceled";

export type OrderItem = {
  product_id: number | null;
  product_name: string;
  product_sku: string | null;
  image_url: string | null;
  price: string;
  quantity: number;
  subtotal: string;
};

export type Order = {
  id: number;
  status: OrderStatus;
  payment_status: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  delivery_method: string;
  delivery_address: string | null;
  comment: string | null;
  items: OrderItem[];
  total: string;
  created_at: string;
};
