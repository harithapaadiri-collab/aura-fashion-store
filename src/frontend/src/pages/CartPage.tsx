import { Separator } from "@/components/ui/separator";
import { useNavigate } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCart } from "../context/CartContext";
import { getProductImage } from "../types/product";

export default function CartPage() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, totalItems, totalPrice } =
    useCart();

  if (totalItems === 0) {
    return (
      <main
        className="max-w-[1400px] mx-auto px-6 lg:px-12 py-24 text-center"
        data-ocid="cart.empty_state"
      >
        <ShoppingBag size={48} className="mx-auto mb-6 text-border" />
        <h1 className="font-serif text-3xl mb-3">Your cart is empty</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Discover our latest pieces and add them to your cart.
        </p>
        <button
          type="button"
          onClick={() =>
            navigate({
              to: "/catalog",
              search: {
                gender: undefined,
                type: undefined,
                brand: undefined,
                sale: undefined,
                view: undefined,
              },
            })
          }
          className="bg-foreground text-primary-foreground text-xs tracking-widest uppercase px-10 py-4 hover:opacity-90 transition-opacity"
          data-ocid="cart.primary_button"
        >
          Continue Shopping
        </button>
      </main>
    );
  }

  return (
    <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-10">
      <h1 className="font-serif text-3xl mb-10">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Items */}
        <div className="lg:col-span-2" data-ocid="cart.list">
          <AnimatePresence mode="popLayout">
            {items.map((item, i) => {
              const img = getProductImage(item.product);
              return (
                <motion.div
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColour}`}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex gap-5 py-6 border-b border-border"
                  data-ocid={`cart.item.${i + 1}`}
                >
                  {/* Image */}
                  <button
                    type="button"
                    className="w-24 h-32 flex-shrink-0 overflow-hidden bg-secondary cursor-pointer p-0 border-0"
                    onClick={() =>
                      navigate({
                        to: "/product/$id",
                        params: { id: item.product.id.toString() },
                      })
                    }
                  >
                    <img
                      src={img}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </button>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-1">
                      {item.product.brand}
                    </p>
                    <p className="text-sm font-medium text-foreground mb-1">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      {item.selectedSize} · {item.selectedColour}
                    </p>

                    {/* Qty */}
                    <div className="flex items-center border border-border w-fit">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.selectedSize,
                            item.selectedColour,
                            item.quantity - 1,
                          )
                        }
                        className="px-2.5 py-1.5 hover:bg-secondary transition-colors"
                        data-ocid={`cart.secondary_button.${i + 1}`}
                      >
                        <Minus size={11} />
                      </button>
                      <span className="px-4 py-1.5 text-xs border-x border-border">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.selectedSize,
                            item.selectedColour,
                            item.quantity + 1,
                          )
                        }
                        className="px-2.5 py-1.5 hover:bg-secondary transition-colors"
                        data-ocid={`cart.secondary_button.${i + 1}`}
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                  </div>

                  {/* Price + Delete */}
                  <div className="flex flex-col items-end justify-between flex-shrink-0">
                    <p className="text-sm font-medium">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        removeItem(
                          item.product.id,
                          item.selectedSize,
                          item.selectedColour,
                        )
                      }
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      data-ocid={`cart.delete_button.${i + 1}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div
            className="bg-card border border-border p-6 sticky top-24"
            data-ocid="cart.panel"
          >
            <h2 className="text-[10px] tracking-widest uppercase font-semibold mb-5">
              Order Summary
            </h2>

            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Subtotal ({totalItems} items)
                </span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>{totalPrice >= 150 ? "Free" : "$9.99"}</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between text-sm font-medium mb-6">
              <span>Total</span>
              <span>
                ${(totalPrice + (totalPrice >= 150 ? 0 : 9.99)).toFixed(2)}
              </span>
            </div>

            <button
              type="button"
              className="w-full bg-foreground text-primary-foreground text-xs tracking-widest uppercase py-4 font-medium hover:opacity-90 transition-opacity mb-3"
              onClick={() => {
                /* checkout placeholder */
              }}
              data-ocid="cart.primary_button"
            >
              Proceed to Checkout
            </button>
            <button
              type="button"
              onClick={() =>
                navigate({
                  to: "/catalog",
                  search: {
                    gender: undefined,
                    type: undefined,
                    brand: undefined,
                    sale: undefined,
                    view: undefined,
                  },
                })
              }
              className="w-full text-xs tracking-widest uppercase py-3 border border-border hover:bg-secondary transition-colors"
              data-ocid="cart.secondary_button"
            >
              Continue Shopping
            </button>

            {totalPrice < 150 && (
              <p className="text-[11px] text-muted-foreground text-center mt-4">
                Add ${(150 - totalPrice).toFixed(2)} more for free shipping
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
