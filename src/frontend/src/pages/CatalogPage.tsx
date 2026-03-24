import { useNavigate, useSearch } from "@tanstack/react-router";
import { SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import FilterSidebar, {
  type FilterState,
} from "../components/products/FilterSidebar";
import ProductCard from "../components/products/ProductCard";
import { useAllProducts } from "../hooks/useQueries";
import type { ProductWithId } from "../types/product";

const DEFAULT_FILTERS: FilterState = {
  genders: { women: false, men: false, kids: false },
  clothingTypes: [],
  brands: [],
  sizes: [],
  colours: [],
  priceRange: [0, 600],
};

type CatalogSearch = {
  gender?: string;
  type?: string;
  brand?: string;
  sale?: string;
  view?: string;
};

export default function CatalogPage() {
  const search = useSearch({ from: "/catalog" }) as CatalogSearch;
  const navigate = useNavigate();
  const { data: allProducts, isLoading } = useAllProducts();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initialise filters from URL params
  const [filters, setFilters] = useState<FilterState>(() => {
    const base = { ...DEFAULT_FILTERS };
    if (search.gender === "women") base.genders.women = true;
    if (search.gender === "men") base.genders.men = true;
    if (search.gender === "kids") base.genders.kids = true;
    if (search.type) base.clothingTypes = [search.type];
    if (search.brand) base.brands = [search.brand];
    if (search.sale === "true") base.priceRange = [0, 49];
    return base;
  });

  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc">(
    "newest",
  );

  const availableBrands = useMemo(() => {
    const brands = new Set((allProducts ?? []).map((p) => p.brand));
    return Array.from(brands).sort();
  }, [allProducts]);

  const filtered = useMemo(() => {
    let list: ProductWithId[] = allProducts ?? [];

    const { genders, clothingTypes, brands, sizes, colours, priceRange } =
      filters;
    const anyGender = genders.women || genders.men || genders.kids;

    list = list.filter((p) => {
      if (anyGender) {
        const match =
          (genders.women && p.isForWomen) ||
          (genders.men && p.isForMen) ||
          (genders.kids && p.isForKids);
        if (!match) return false;
      }
      if (clothingTypes.length > 0 && !clothingTypes.includes(p.clothingType))
        return false;
      if (brands.length > 0 && !brands.includes(p.brand)) return false;
      if (sizes.length > 0 && !sizes.some((s) => p.sizes.includes(s)))
        return false;
      if (
        colours.length > 0 &&
        !colours.some((c) => p.availableColours.includes(c))
      )
        return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      return true;
    });

    if (sortBy === "price-asc")
      list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc")
      list = [...list].sort((a, b) => b.price - a.price);

    return list;
  }, [allProducts, filters, sortBy]);

  const title =
    search.gender === "women"
      ? "Women"
      : search.gender === "men"
        ? "Men"
        : search.gender === "kids"
          ? "Kids"
          : search.sale === "true"
            ? "Sale"
            : "All Products";

  return (
    <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-10">
      {/* Header row */}
      <div className="flex items-baseline justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filtered.length} items
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Mobile filter toggle */}
          <button
            type="button"
            className="lg:hidden flex items-center gap-2 text-xs tracking-widest uppercase border border-border px-3 py-2"
            onClick={() => setSidebarOpen(true)}
            data-ocid="catalog.secondary_button"
          >
            <SlidersHorizontal size={14} /> Filter
          </button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="text-xs border border-border bg-card px-3 py-2 text-foreground outline-none"
            data-ocid="catalog.select"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="flex gap-10">
        {/* Desktop sidebar */}
        <div className="hidden lg:block w-56 flex-shrink-0">
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            availableBrands={availableBrands}
          />
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-foreground/40"
              onClick={() => setSidebarOpen(false)}
              onKeyDown={(e) => e.key === "Enter" && setSidebarOpen(false)}
              role="button"
              tabIndex={0}
              aria-label="Close filter"
            />
            <div className="absolute right-0 top-0 h-full w-80 bg-card overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs tracking-widest uppercase font-semibold">
                  Filter
                </span>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  data-ocid="filter.close_button"
                >
                  <X size={18} />
                </button>
              </div>
              <FilterSidebar
                filters={filters}
                onChange={(f) => {
                  setFilters(f);
                }}
                availableBrands={availableBrands}
              />
            </div>
          </div>
        )}

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l"].map(
                (k) => (
                  <div
                    key={k}
                    className="aspect-[3/4] bg-secondary animate-pulse"
                    data-ocid="catalog.loading_state"
                  />
                ),
              )}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24" data-ocid="catalog.empty_state">
              <p className="font-serif text-2xl mb-3">No items found</p>
              <p className="text-sm text-muted-foreground mb-6">
                Try adjusting your filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setFilters(DEFAULT_FILTERS);
                  navigate({
                    to: "/catalog",
                    search: {
                      gender: undefined,
                      type: undefined,
                      brand: undefined,
                      sale: undefined,
                      view: undefined,
                    },
                  });
                }}
                className="text-xs tracking-widest uppercase border border-foreground px-6 py-3 hover:bg-foreground hover:text-primary-foreground transition-colors"
                data-ocid="catalog.secondary_button"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div
              className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6"
              data-ocid="catalog.list"
            >
              {filtered.map((p, i) => (
                <ProductCard key={p.id.toString()} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
