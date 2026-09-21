import type { Product, ProductValues } from "./schema";

export interface ProductRepository {
  list(): Promise<Product[]>;
  get(id: string): Promise<Product | null>;
  create(input: ProductValues): Promise<Product>;
  update(id: string, input: ProductValues): Promise<Product>;
  delete(id: string): Promise<void>;
}
