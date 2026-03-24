import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import ProductCard from "../components/products/ProductCard";
import { useAllProducts } from "../hooks/useQueries";

const CATEGORY_TILES = [
  {
    label: "WOMEN'S ESSENTIALS",
    image:
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80",
    param: "women",
  },
  {
    label: "MEN'S TAILORING",
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
    param: "men",
  },
  {
    label: "ACCESSORIES",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
    param: "accessories",
  },
  {
    label: "KIDS' EDIT",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80",
    param: "kids",
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { data: products, isLoading } = useAllProducts();
  const featured = products?.slice(0, 8) ?? [];

  return (
    <main>
      {/* Hero */}
      <section
        className="relative h-[80vh] min-h-[500px] overflow-hidden"
        data-ocid="hero.section"
      >
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=90"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/20 to-transparent" />
        <div className="relative h-full flex items-center">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-lg"
            >
              <p className="text-[11px] tracking-[0.25em] uppercase text-primary-foreground/70 mb-4">
                New Season 2026
              </p>
              <h1 className="font-serif text-5xl lg:text-7xl text-primary-foreground leading-tight tracking-tight mb-6">
                Define Your
                <br />
                <em className="not-italic">Signature</em>
              </h1>
              <p className="text-sm text-primary-foreground/80 mb-8 leading-relaxed">
                Curated fashion for every story. Discover this season's
                most-wanted pieces.
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
                className="inline-flex items-center gap-3 bg-primary-foreground text-foreground text-xs tracking-widest uppercase px-8 py-4 font-medium hover:bg-primary-foreground/90 transition-colors"
                data-ocid="hero.primary_button"
              >
                Shop Now <ArrowRight size={14} />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category Tiles */}
      <section
        className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16"
        data-ocid="categories.section"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORY_TILES.map((tile, i) => (
            <motion.div
              key={tile.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group cursor-pointer relative overflow-hidden aspect-[3/4]"
              onClick={() => {
                if (tile.param === "women")
                  navigate({
                    to: "/catalog",
                    search: {
                      gender: "women",
                      type: undefined,
                      brand: undefined,
                      sale: undefined,
                      view: undefined,
                    },
                  });
                else if (tile.param === "men")
                  navigate({
                    to: "/catalog",
                    search: {
                      gender: "men",
                      type: undefined,
                      brand: undefined,
                      sale: undefined,
                      view: undefined,
                    },
                  });
                else if (tile.param === "kids")
                  navigate({
                    to: "/catalog",
                    search: {
                      gender: "kids",
                      type: undefined,
                      brand: undefined,
                      sale: undefined,
                      view: undefined,
                    },
                  });
                else if (tile.param === "accessories")
                  navigate({
                    to: "/catalog",
                    search: {
                      gender: undefined,
                      type: "Accessories",
                      brand: undefined,
                      sale: undefined,
                      view: undefined,
                    },
                  });
              }}
              data-ocid={`categories.item.${i + 1}`}
            >
              <img
                src={tile.image}
                alt={tile.label}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-[11px] tracking-[0.2em] uppercase text-primary-foreground font-medium">
                  {tile.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Latest Arrivals */}
      <section
        className="max-w-[1400px] mx-auto px-6 lg:px-12 pb-20"
        data-ocid="arrivals.section"
      >
        <div className="flex items-baseline justify-between mb-10">
          <h2 className="font-serif text-3xl tracking-wide">Latest Arrivals</h2>
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
            className="text-[11px] tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            data-ocid="arrivals.link"
          >
            View All <ArrowRight size={12} />
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {["a", "b", "c", "d", "e", "f", "g", "h"].map((k) => (
              <div
                key={k}
                className="aspect-[3/4] bg-secondary animate-pulse"
                data-ocid="arrivals.loading_state"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {featured.map((p, i) => (
              <ProductCard key={p.id.toString()} product={p} index={i} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
