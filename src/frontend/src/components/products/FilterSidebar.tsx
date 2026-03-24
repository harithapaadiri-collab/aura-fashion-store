import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { CLOTHING_TYPES, COLOURS, SIZES } from "../../types/product";

export interface FilterState {
  genders: { women: boolean; men: boolean; kids: boolean };
  clothingTypes: string[];
  brands: string[];
  sizes: string[];
  colours: string[];
  priceRange: [number, number];
}

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  availableBrands: string[];
  maxPrice?: number;
}

function Section({
  title,
  children,
}: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-border pb-5 mb-5">
      <button
        type="button"
        className="flex items-center justify-between w-full text-left mb-3"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="text-[10px] tracking-widest uppercase font-semibold text-foreground">
          {title}
        </span>
        {open ? (
          <ChevronUp size={14} className="text-muted-foreground" />
        ) : (
          <ChevronDown size={14} className="text-muted-foreground" />
        )}
      </button>
      {open && children}
    </div>
  );
}

export default function FilterSidebar({
  filters,
  onChange,
  availableBrands,
  maxPrice = 500,
}: FilterSidebarProps) {
  const update = (patch: Partial<FilterState>) =>
    onChange({ ...filters, ...patch });

  const toggleGender = (g: keyof FilterState["genders"]) =>
    update({ genders: { ...filters.genders, [g]: !filters.genders[g] } });

  const toggleList = (
    key: "clothingTypes" | "brands" | "sizes" | "colours",
    value: string,
  ) => {
    const list = filters[key];
    update({
      [key]: list.includes(value)
        ? list.filter((x) => x !== value)
        : [...list, value],
    });
  };

  return (
    <aside className="w-full" data-ocid="filter.panel">
      <div className="flex items-center justify-between mb-6">
        <span className="text-[10px] tracking-widest uppercase font-semibold">
          Filter
        </span>
        <button
          type="button"
          onClick={() =>
            onChange({
              genders: { women: false, men: false, kids: false },
              clothingTypes: [],
              brands: [],
              sizes: [],
              colours: [],
              priceRange: [0, maxPrice],
            })
          }
          className="text-[10px] text-muted-foreground hover:text-foreground transition-colors tracking-wide"
          data-ocid="filter.secondary_button"
        >
          Clear all
        </button>
      </div>

      {/* Gender */}
      <Section title="Gender">
        {(["women", "men", "kids"] as const).map((g) => (
          <div key={g} className="flex items-center gap-2 mb-2">
            <Checkbox
              id={`gender-${g}`}
              checked={filters.genders[g]}
              onCheckedChange={() => toggleGender(g)}
              data-ocid="filter.checkbox"
            />
            <Label
              htmlFor={`gender-${g}`}
              className="text-sm text-foreground capitalize cursor-pointer"
            >
              {g.charAt(0).toUpperCase() + g.slice(1)}
            </Label>
          </div>
        ))}
      </Section>

      {/* Clothing Type */}
      <Section title="Category">
        {CLOTHING_TYPES.map((type) => (
          <div key={type} className="flex items-center gap-2 mb-2">
            <Checkbox
              id={`type-${type}`}
              checked={filters.clothingTypes.includes(type)}
              onCheckedChange={() => toggleList("clothingTypes", type)}
              data-ocid="filter.checkbox"
            />
            <Label
              htmlFor={`type-${type}`}
              className="text-sm text-foreground cursor-pointer"
            >
              {type}
            </Label>
          </div>
        ))}
      </Section>

      {/* Brands */}
      {availableBrands.length > 0 && (
        <Section title="Brand">
          {availableBrands.map((brand) => (
            <div key={brand} className="flex items-center gap-2 mb-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={filters.brands.includes(brand)}
                onCheckedChange={() => toggleList("brands", brand)}
                data-ocid="filter.checkbox"
              />
              <Label
                htmlFor={`brand-${brand}`}
                className="text-xs text-foreground cursor-pointer"
              >
                {brand}
              </Label>
            </div>
          ))}
        </Section>
      )}

      {/* Sizes */}
      <Section title="Size">
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => toggleList("sizes", s)}
              className={`text-xs px-3 py-1.5 border transition-colors ${
                filters.sizes.includes(s)
                  ? "bg-foreground text-primary-foreground border-foreground"
                  : "bg-card text-foreground border-border hover:border-foreground"
              }`}
              data-ocid="filter.toggle"
            >
              {s}
            </button>
          ))}
        </div>
      </Section>

      {/* Colours */}
      <Section title="Colour">
        <div className="flex flex-wrap gap-2">
          {COLOURS.map((c) => (
            <button
              type="button"
              key={c}
              title={c}
              onClick={() => toggleList("colours", c)}
              className={`w-6 h-6 rounded-full border-2 transition-all ${
                filters.colours.includes(c)
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
              data-ocid="filter.toggle"
            />
          ))}
        </div>
      </Section>

      {/* Price Range */}
      <Section title="Price">
        <Slider
          min={0}
          max={maxPrice}
          step={10}
          value={[filters.priceRange[0], filters.priceRange[1]]}
          onValueChange={(v) => update({ priceRange: [v[0], v[1]] })}
          className="mb-3"
          data-ocid="filter.toggle"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>${filters.priceRange[0]}</span>
          <span>${filters.priceRange[1]}</span>
        </div>
      </Section>
    </aside>
  );
}
