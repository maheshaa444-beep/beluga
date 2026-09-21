import type { ProductRepository } from "./repository";
import type { Product, ProductValues } from "./schema";
import { seedProducts } from "./seed";

function cloneProduct(product: Product): Product {
  return structuredClone(product);
}

export class MemoryProductRepository implements ProductRepository {
  private items: Product[];
  private listDelayMs: number;

  constructor(initial: Product[] = seedProducts, options?: { listDelayMs?: number }) {
    this.items = initial.map(cloneProduct);
    this.listDelayMs = options?.listDelayMs ?? 0;
  }

  async list(): Promise<Product[]> {
    if (this.listDelayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.listDelayMs));
    }
    return this.items
      .map(cloneProduct)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async get(id: string): Promise<Product | null> {
    const found = this.items.find((item) => item.id === id);
    return found ? cloneProduct(found) : null;
  }

  async create(input: ProductValues): Promise<Product> {
    const now = new Date().toISOString();
    const product: Product = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    this.items.push(product);
    return cloneProduct(product);
  }

  async update(id: string, input: ProductValues): Promise<Product> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error(`Product not found: ${id}`);
    }
    const current = this.items[index];
    const updated: Product = {
      ...current,
      ...input,
      id: current.id,
      createdAt: current.createdAt,
      updatedAt: new Date().toISOString(),
    };
    this.items[index] = updated;
    return cloneProduct(updated);
  }

  async delete(id: string): Promise<void> {
    const next = this.items.filter((item) => item.id !== id);
    if (next.length === this.items.length) {
      throw new Error(`Product not found: ${id}`);
    }
    this.items = next;
  }
}

export function createMemoryProductRepository(
  initial?: Product[],
  options?: { listDelayMs?: number },
): ProductRepository {
  return new MemoryProductRepository(initial ?? seedProducts, options);
}

let singleton: ProductRepository | null = null;

export function getProductRepository(): ProductRepository {
  if (!singleton) {
    singleton = createMemoryProductRepository(seedProducts, {
      listDelayMs: 420,
    });
  }
  return singleton;
}

export function resetProductRepositoryForTests(
  repository: ProductRepository | null = null,
) {
  singleton = repository;
}
