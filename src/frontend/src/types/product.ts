import type { Product } from "../backend";

export type ProductWithId = Product & { id: bigint };

export const CLOTHING_TYPES = [
  "Tops",
  "Bottoms",
  "Dresses",
  "Outerwear",
  "Activewear",
  "Accessories",
];

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export const COLOURS = [
  "Black",
  "White",
  "Navy",
  "Grey",
  "Beige",
  "Brown",
  "Red",
  "Blue",
  "Green",
  "Pink",
  "Yellow",
  "Purple",
];

export const IMAGE_FALLBACKS: Record<string, string> = {
  tops: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
  bottoms:
    "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80",
  dresses:
    "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80",
  outerwear:
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
  activewear:
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80",
  accessories:
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
  default:
    "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80",
};

export function getProductImage(product: Product): string {
  if (product.imageUrl) return product.imageUrl;
  const key = product.clothingType.toLowerCase();
  return IMAGE_FALLBACKS[key] ?? IMAGE_FALLBACKS.default;
}
