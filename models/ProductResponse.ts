import { iProduct } from "./Product";

export interface iItemResponse {
  author: {
    name: string;
    lastname: string;
  };
  categories: string[];

  item: iProduct;
}

export interface iItemsResponse {
  author: {
    name: string;
    lastname: string;
  };
  categories: string[];
  items: iProduct[];
}
