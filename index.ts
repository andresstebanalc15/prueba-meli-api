import express, { Express } from "express";
import cors from "cors";
import { iProduct } from "./models/Product";
import { iItemsResponse, iItemResponse } from "./models/ProductResponse";
import { RequestInfo, RequestInit } from "node-fetch";

import {
  TypedRequestParams,
  TypedRequestQuery,
  TypedResponse,
} from "./models/general";

const app: Express = express();
const port = 8000;

const fetch = (url: RequestInfo, init?: RequestInit) =>
  import("node-fetch").then(({ default: fetch }) => fetch(url, init));

app.use(
  cors({
    origin: ["http://localhost:8080"],
  })
);

app.get(
  "/api/items",
  async (
    req: TypedRequestQuery<{ q: string }>,
    res: TypedResponse<iItemsResponse>
  ) => {
    const { q } = req.query;
    const items: iProduct[] = [];
    var categories = [];
    const response = await fetch(
      `https://api.mercadolibre.com/sites/MCO/search?q=:${q}`
    );

    const { results = [], filters = {} } = (await response.json()) as any;

    results.forEach((product: any) => {
      items.push({
        id: product.id,
        title: product.title,
        price: {
          currency: product.currency_id,
          amount: product.price,
          decimals: 0,
        },
        picture: product.thumbnail,
        condition: product.address.city_name,
        free_shipping: product.shipping.free_shipping,
      });
    });

    filters.forEach((category: any) => {
      category.id === "category" ? (categories = category.values) : "";
    });

    res.json({
      author: { name: "Andres Steban", lastname: "Luna Cortes" },
      categories: categories,
      items,
    });
  }
);

app.get(
  "/api/items/:id",
  async (
    req: TypedRequestParams<{ id: string }>,
    res: TypedResponse<iItemResponse>
  ) => {
    const { id } = req.params;
    var categories = [];

    const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
    const descriptionResponse = await fetch(
      `https://api.mercadolibre.com/items/${id}/description`
    );

    const product = (await response.json()) as any;

    const categoryResponse = await fetch(
      `https://api.mercadolibre.com/categories/${product.category_id}`
    );

    const category = (await categoryResponse.json()) as any;

    const { plain_text: description } =
      (await descriptionResponse.json()) as any;

    const item: iProduct = {
      id: product.id,
      title: product.title,
      price: {
        currency: product.currency_id,
        amount: product.price,
        decimals: 0,
      },
      picture: product && product.pictures[0].url,
      condition: product.condition,
      free_shipping: product.shipping.free_shipping,
      sold_quantity: product.sold_quantity,
      description: description,
    };

    categories.push(category);
    res.json({
      author: { name: "Andres Steban", lastname: "Luna Cortes" },
      item,
      categories: categories,
    });
  }
);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
