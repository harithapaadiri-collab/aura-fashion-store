import { Link } from "@tanstack/react-router";
import { Facebook, Instagram } from "lucide-react";
import { SiX } from "react-icons/si";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(
    typeof window !== "undefined" ? window.location.hostname : "",
  );

  return (
    <footer className="bg-foreground text-primary-foreground mt-auto">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-1">
          <p className="font-serif text-2xl tracking-[0.18em] mb-4">AURA</p>
          <p className="text-xs text-primary-foreground/60 leading-relaxed max-w-[200px]">
            Modern fashion for the discerning individual. Curated brands,
            timeless style.
          </p>
        </div>

        {/* Shop */}
        <div>
          <p className="text-[10px] tracking-widest uppercase mb-4 text-primary-foreground/40">
            Shop
          </p>
          <ul className="space-y-2">
            {["New Arrivals", "Women", "Men", "Kids", "Sale"].map((l) => (
              <li key={l}>
                <Link
                  to="/catalog"
                  search={{
                    gender: undefined,
                    type: undefined,
                    brand: undefined,
                    sale: undefined,
                    view: undefined,
                  }}
                  className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div>
          <p className="text-[10px] tracking-widest uppercase mb-4 text-primary-foreground/40">
            Help
          </p>
          <ul className="space-y-2">
            {["Shipping & Returns", "Size Guide", "Contact Us", "FAQs"].map(
              (l) => (
                <li key={l}>
                  <span className="text-sm text-primary-foreground/70">
                    {l}
                  </span>
                </li>
              ),
            )}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <p className="text-[10px] tracking-widest uppercase mb-4 text-primary-foreground/40">
            Newsletter
          </p>
          <p className="text-xs text-primary-foreground/60 mb-3">
            Subscribe for exclusive offers and new arrivals.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 text-xs px-3 py-2 outline-none focus:border-primary-foreground/60 transition-colors"
              data-ocid="newsletter.input"
            />
            <button
              type="button"
              className="bg-primary-foreground text-foreground text-xs px-4 py-2 font-medium hover:opacity-90 transition-opacity"
              data-ocid="newsletter.submit_button"
            >
              JOIN
            </button>
          </div>
          <div className="flex gap-4 mt-6">
            <Instagram
              size={16}
              className="text-primary-foreground/50 hover:text-primary-foreground cursor-pointer transition-colors"
            />
            <Facebook
              size={16}
              className="text-primary-foreground/50 hover:text-primary-foreground cursor-pointer transition-colors"
            />
            <SiX
              size={14}
              className="text-primary-foreground/50 hover:text-primary-foreground cursor-pointer transition-colors mt-0.5"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 px-6 lg:px-12 py-5">
        <p className="text-center text-[11px] text-primary-foreground/40">
          © {year}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary-foreground/70 transition-colors"
          >
            Built with love using caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}
