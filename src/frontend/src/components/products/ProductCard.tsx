import { useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { getProductImage } from "../../types/product";
import type { ProductWithId } from "../../types/product";

interface ProductCardProps {
  product: ProductWithId;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const imageUrl = imgError
    ? "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80"
    : getProductImage(product);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const size = product.sizes[0] ?? "One Size";
    const colour = product.availableColours[0] ?? "Default";
    addItem(product, size, colour);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group cursor-pointer"
      onClick={() =>
        navigate({ to: "/product/$id", params: { id: product.id.toString() } })
      }
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-ocid={`product.item.${index + 1}`}
    >
      {/* Image container */}
      <div className="relative overflow-hidden bg-secondary aspect-[3/4]">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgError(true)}
          loading="lazy"
        />

        {/* Quick Add overlay */}
        <div
          className={`absolute inset-x-0 bottom-0 transition-all duration-300 ${
            hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
          }`}
        >
          <button
            type="button"
            onClick={handleQuickAdd}
            className="w-full bg-foreground text-primary-foreground text-xs tracking-widest uppercase py-3 font-medium hover:bg-primary/90 transition-colors"
            data-ocid={`product.primary_button.${index + 1}`}
          >
            Quick Add
          </button>
        </div>

        {/* SALE badge */}
        {product.price < 50 && (
          <div className="absolute top-3 left-3 bg-foreground text-primary-foreground text-[9px] tracking-widest uppercase px-2 py-1">
            SALE
          </div>
        )}
      </div>

      {/* Info */}
      <div className="pt-3 pb-1">
        <p className="text-[10px] tracking-widest uppercase text-muted-foreground font-medium mb-1">
          {product.brand}
        </p>
        <p className="text-sm text-foreground leading-snug line-clamp-1">
          {product.name}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-sm font-medium text-foreground">
            ${product.price}
          </p>
          {/* Colour dots */}
          <div className="flex gap-1 ml-auto">
            {product.availableColours.slice(0, 3).map((c) => (
              <div
                key={c}
                title={c}
                className="w-3 h-3 rounded-full border border-border"
                style={{
                  backgroundColor:
                    c.toLowerCase() === "beige"
                      ? "#d4b896"
                      : c.toLowerCase() === "navy"
                        ? "#1e3a5f"
                        : c.toLowerCase(),
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
