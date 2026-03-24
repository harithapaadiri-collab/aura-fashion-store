import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Minus, Plus, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";
import { useProduct } from "../hooks/useQueries";
import { getProductImage } from "../types/product";

export default function ProductDetailPage() {
  const { id } = useParams({ from: "/product/$id" });
  const navigate = useNavigate();
  const productId = BigInt(id);
  const { data: product, isLoading } = useProduct(productId);
  const { addItem } = useCart();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColour, setSelectedColour] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);

  const handleAddToCart = () => {
    if (!product) return;
    const size = selectedSize ?? product.sizes[0] ?? "One Size";
    const colour = selectedColour ?? product.availableColours[0] ?? "Default";
    for (let i = 0; i < quantity; i++) {
      addItem(product, size, colour);
    }
    toast.success(`${product.name} added to cart`);
  };

  if (isLoading) {
    return (
      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div
            className="aspect-[3/4] bg-secondary animate-pulse"
            data-ocid="product.loading_state"
          />
          <div className="space-y-4">
            <div className="h-4 bg-secondary animate-pulse w-24" />
            <div className="h-8 bg-secondary animate-pulse w-3/4" />
            <div className="h-6 bg-secondary animate-pulse w-20" />
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main
        className="max-w-[1400px] mx-auto px-6 lg:px-12 py-24 text-center"
        data-ocid="product.error_state"
      >
        <p className="font-serif text-2xl mb-4">Product not found</p>
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
          className="text-xs tracking-widest uppercase border border-foreground px-6 py-3"
        >
          Back to Catalog
        </button>
      </main>
    );
  }

  const imageUrl = imgError
    ? "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80"
    : getProductImage(product);

  return (
    <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-10">
      {/* Back link */}
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
        className="flex items-center gap-2 text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors mb-10"
        data-ocid="product.link"
      >
        <ArrowLeft size={14} /> Back to Catalog
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="aspect-[3/4] overflow-hidden bg-secondary"
        >
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col"
        >
          <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-2">
            {product.brand}
          </p>
          <h1 className="font-serif text-3xl lg:text-4xl leading-tight mb-3">
            {product.name}
          </h1>
          <p className="text-2xl font-light mb-6">${product.price}</p>

          {/* Gender badges */}
          <div className="flex gap-2 mb-6">
            {product.isForWomen && (
              <span className="text-[9px] tracking-widest uppercase border border-border px-2 py-1 text-muted-foreground">
                Women
              </span>
            )}
            {product.isForMen && (
              <span className="text-[9px] tracking-widest uppercase border border-border px-2 py-1 text-muted-foreground">
                Men
              </span>
            )}
            {product.isForKids && (
              <span className="text-[9px] tracking-widest uppercase border border-border px-2 py-1 text-muted-foreground">
                Kids
              </span>
            )}
            <span className="text-[9px] tracking-widest uppercase border border-border px-2 py-1 text-muted-foreground">
              {product.clothingType}
            </span>
          </div>

          {/* Colour selector */}
          {product.availableColours.length > 0 && (
            <div className="mb-6">
              <p className="text-[10px] tracking-widest uppercase mb-3">
                Colour{selectedColour ? `: ${selectedColour}` : ""}
              </p>
              <div className="flex gap-3">
                {product.availableColours.map((c) => (
                  <button
                    type="button"
                    key={c}
                    title={c}
                    onClick={() => setSelectedColour(c)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColour === c
                        ? "border-foreground scale-110"
                        : "border-transparent hover:border-muted-foreground"
                    }`}
                    style={{
                      backgroundColor:
                        c === "Beige"
                          ? "#d4b896"
                          : c === "Navy"
                            ? "#1e3a5f"
                            : c === "Grey"
                              ? "#888888"
                              : c === "Brown"
                                ? "#7c5c3a"
                                : c.toLowerCase(),
                    }}
                    data-ocid="product.toggle"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size selector */}
          {product.sizes.length > 0 && (
            <div className="mb-8">
              <div className="flex items-baseline justify-between mb-3">
                <p className="text-[10px] tracking-widest uppercase">
                  Size{selectedSize ? `: ${selectedSize}` : ""}
                </p>
                <button
                  type="button"
                  className="text-[10px] text-muted-foreground underline"
                >
                  Size guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`text-xs px-4 py-2.5 border transition-colors ${
                      selectedSize === s
                        ? "bg-foreground text-primary-foreground border-foreground"
                        : "bg-card text-foreground border-border hover:border-foreground"
                    }`}
                    data-ocid="product.toggle"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <p className="text-[10px] tracking-widest uppercase">Qty</p>
            <div className="flex items-center border border-border">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-2 hover:bg-secondary transition-colors"
                data-ocid="product.secondary_button"
              >
                <Minus size={12} />
              </button>
              <span className="px-5 py-2 text-sm border-x border-border">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-2 hover:bg-secondary transition-colors"
                data-ocid="product.secondary_button"
              >
                <Plus size={12} />
              </button>
            </div>
          </div>

          {/* Add to cart */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-3 w-full bg-foreground text-primary-foreground text-xs tracking-widest uppercase py-4 font-medium hover:opacity-90 transition-opacity mb-4"
            data-ocid="product.primary_button"
          >
            <ShoppingBag size={16} /> Add to Cart
          </button>

          {/* Description */}
          <div className="border-t border-border pt-6 mt-2">
            <p className="text-[10px] tracking-widest uppercase mb-3">
              Description
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="border-t border-border pt-4 mt-4">
            <p className="text-xs text-muted-foreground">
              {Number(product.stock) > 0
                ? `${Number(product.stock)} in stock`
                : "Out of stock"}
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
