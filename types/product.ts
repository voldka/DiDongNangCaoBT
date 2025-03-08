export interface Product {
  _id: string;
  id: string;
  name: string;
  description?: string;
  price: number;
  image: string[];
  images: string[];
  type: string;
}

export interface RatingRequest {
  rating: number;
  comment?: string;
}
