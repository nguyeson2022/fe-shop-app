import {ProductImage} from "./product.image";

export interface Product {
  id: number;
  name: string;
  price: number;
  thumbnail: string;
  description: string;
  category_id: number | string;  // Can be either number or string
  category_name?: string;      // For displaying category name
  url?: string;                // Make optional with ?
  product_images: ProductImage[];
  brand?: string;
  model?: string;
  specifications?: string;
  warranty?: string;
  stock?: number;
  color?: string;
  created_at?: Date;
  updated_at?: Date;
  displayImageUrl?: string; 
}
