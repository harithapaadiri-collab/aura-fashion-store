import { type ReactNode, createContext, useContext, useState } from "react";
import type { ProductWithId } from "../types/product";

export interface CartItem {
  product: ProductWithId;
  selectedSize: string;
  selectedColour: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: ProductWithId, size: string, colour: string) => void;
  removeItem: (productId: bigint, size: string, colour: string) => void;
  updateQuantity: (
    productId: bigint,
    size: string,
    colour: string,
    qty: number,
  ) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (product: ProductWithId, size: string, colour: string) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) =>
          i.product.id === product.id &&
          i.selectedSize === size &&
          i.selectedColour === colour,
      );
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id &&
          i.selectedSize === size &&
          i.selectedColour === colour
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        );
      }
      return [
        ...prev,
        { product, selectedSize: size, selectedColour: colour, quantity: 1 },
      ];
    });
  };

  const removeItem = (productId: bigint, size: string, colour: string) => {
    setItems((prev) =>
      prev.filter(
        (i) =>
          !(
            i.product.id === productId &&
            i.selectedSize === size &&
            i.selectedColour === colour
          ),
      ),
    );
  };

  const updateQuantity = (
    productId: bigint,
    size: string,
    colour: string,
    qty: number,
  ) => {
    if (qty <= 0) {
      removeItem(productId, size, colour);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId &&
        i.selectedSize === size &&
        i.selectedColour === colour
          ? { ...i, quantity: qty }
          : i,
      ),
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
