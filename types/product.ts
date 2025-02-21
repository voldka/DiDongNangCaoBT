export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  images: string[];
  type: string;
}

export interface RatingRequest {
  rating: number;
  comment?: string;
}
